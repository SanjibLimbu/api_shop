const express = require('express');
var cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express();
const productsRoute = require('./api/routes/products')
const ordersRoute = require('./api/routes/orders')
const UserRoute = require('./api/routes/users')


mongoose.connect(process.env.MONGODB_URI,(err,client)=>{
    if(!err) {
        console.log("successful connection with the server");  
    }
    else
        console.log("Error in the connectivity");
})
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(express.static('uploads'))

app.use('/products',productsRoute)
app.use('/orders',ordersRoute)
app.use('/user',UserRoute)

app.use((req,res,next)=>{
    res.status(404).json({
        msg:"bad request"
    })
})

module.exports = app