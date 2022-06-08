const express = require('express')
const { default: mongoose } = require('mongoose')
const Product = require('../models/product')
const multer = require('multer')
const router = express.Router()
const CheckAuth = require('../middleware/check-auth')



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {

        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}
)
// const upload = multer({ dest: 'uploads/' })


router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(result => {
            return res.status(200).json({
                ProductData: result
            })
        })

        .catch(err1 => {
            res.status(500).json({
                error: err1
            })
        })
})
router.post('/', CheckAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save()
        .then(result => {

            res.status(200).json({
                msg: "Product created successfully",
                product: {
                    name: result.name,
                    price: result.price,
                    _id: result._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err: err
            })
        })
    // res.status(200).json({
    //     msg:"handling POST request to /products"
    // })
})

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            res.status(200).json({
                doc: doc
            })
        })
        .catch(error => {
            res.status(500).json({
                err: error
            })
        })

})


router.put('/:productID', (req, res, next) => {
    Product.findByIdAndUpdate(req.params.productID, {
        $set: {
            name: req.body.name,
            price: req.body.price

        }
    })
        .then(result => {
            res.status(200).json({
                msg: result
            })
        })
        .catch(err => {
            err: err
        })
})

router.delete('/:productID', (req, res, next) => {
    Product.deleteOne({ _id: req.params.productID })
        .exec()
        .then(result => {
            res.status(200).json({
                msg: result
            })
        })
        .catch(err => {
            res.status(200).json({
                err: err

            })
        }
        )
})

module.exports = router