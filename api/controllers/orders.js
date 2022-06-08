const Order = require('../models/order')
exports.order_get_all=(req, res, next) => {
    Order.find()
        .populate('product')
        .select('product quantity _id')
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                orders: result
            })
        })
        .catch(err => {
            res.status(500).json({
                err: err
            })
        })
}