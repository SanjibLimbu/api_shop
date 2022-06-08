const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const Product = require('../models/product')
const mongoose = require('mongoose')
const OrderController = require('../controllers/orders')


router.get('/', OrderController.order_get_all)




router.post('/', (req, res, next) => {
    Product.findById(req.body.productID)
        .then(od => {
            if (!od) {
                return res.status(404).json({
                    msg: "product not found if"
                })
            }
            console.log(od)

            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productID

            })
            return order.save()
        })
        .then(result => {
            res.status(201).json({
                msg: result
            })
        })

        .catch(err => {
            res.status(500).json({
                msg: "product not found"
            })
        })
})

router.get('/:orderID', (req, res, next) => {
    Order.findById(req.params.orderID)
        .select('product quantity _id')
        .exec()
        .then(orderr => {
            if (!orderr) {
                return res.status(404).json({
                    msg: 'order not found if'
                })
            }
            res.status(200).json({
                msg: orderr
            })
        })
        .catch(err => {
            res.status(500).json({
                msg: "order not found"
            })
        })
})

router.delete('/:orderID', (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderID })
        .exec()
        .then(result => {
            res.status(200).json({
                msg: "order deleted"
            })
        })
        .catch(err => {
            res.status(500).json({
                msg: "order not deleted"
            })
        })
})



module.exports = router