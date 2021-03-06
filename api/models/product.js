const { type } = require('express/lib/response')
const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    price: {
        type: Number,
        required: true
    },
    name: {
       
        type: String,
        required: true
        
    },
    productImage : {
        type: String, 
        required: true
    }
})

module.exports = mongoose.model('Product',ProductSchema)