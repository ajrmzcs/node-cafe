const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body

    User.findOne({email: body.email}, (err, dbUser) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                message: 'Invalid user or password'
            });
        }

        if (!bcrypt.compareSync(body.password, dbUser.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Invalid user or password'
            });
        }
        
        let token = jwt.sign({
            user: dbUser,

        }, process.env.SEED, {expiresIn: process.env.TOKEN_EXPIRATION})

        res.json({
            ok: true,
            user: dbUser,
            token
        });
    
    });
    
    

});



module.exports = app;