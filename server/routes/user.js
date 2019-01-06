const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const User = require('../models/user');

// Usamos destructuracion para importar solo la funcion verificaToken
const { verifyToken } = require('../middlewares/authentication');

const app = express();

app.get('/users', verifyToken, (req, res) => {
    
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);
    
    User.find({status: true}, 'name email role status google img')
           .skip(from)
           .limit(limit)
           .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            User.count({status: true}, (err, count) => {
               
                res.json({
                    ok: true,
                    users,
                    count
                });
                
            });
           });
});

app.post('/users', function(req, res) {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, dbUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            user: dbUser
        });

    });
});

app.put('/users/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, dbUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        
        res.json({
            ok: true,
            user: dbUser
        });

    });


    
});

app.delete('/users/:id', function(req, res) {
    
    let id = req.params.id;

    let statusChange = {
        status: false
    }

    User.findByIdAndDelete(id, (err, deletedUser) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'User not found'
                }
            });
        }
        
        deletedUser.status = false;

        res.json({
            ok: true,
            user: deletedUser
        });
    });
});

module.exports = app;