const jwt = require('jsonwebtoken');

// ================
// Verificar token
// ================

let verifyToken = (req, res, next) => {

    let token = req.get('token'); // or use Authorization, this name
    // is more common use in request headers

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;
        next();
    
    });
};

module.exports = {
    verifyToken
};