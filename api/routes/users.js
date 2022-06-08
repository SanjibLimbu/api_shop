const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require('jsonwebtoken')


router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
        .then(user => {
            console.log(user)
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email already exits."
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash

                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result)
                                return res.status(200).json({
                                    message: "user created"
                                })
                            }

                            )
                            .catch(error => {
                                return res.status(500).json({
                                    error: error
                                })
                            }

                            )
                    }

                })

            }
        }

        )



});

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth Failed1"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth Failed2"
                    })

                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email:user[0].email,
                            password:user[0].password
                        },
                        process.env.jwt_secret,
                        {
                            expiresIn:'24h'
                        }

                    )
                    return res.status(200).json({
                        message: "Auth success",
                        token:token
                    })

                }

            })
        }

        )
        .catch(err => {
            return res.status(401).json({
                message: "Auth Failed3"
            })
        })

})


module.exports = router