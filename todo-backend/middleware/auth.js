const jwt = require('jsonwebtoken');
const config = require('../config/env');

// runs before any protected route -> verifies the token from authorizatio header
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // checking if header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Not authorized, no token' 
        });
    }

    // "bearer token..." -> split it on space and take index[1]
    const token = authHeader.split(' ')[1]; 

    try {
        // decoded = { id:.., username:..., iat:..., exp:...}
        const decoded = jwt.verify(token, config.jwt.accessSecret);

        req.user = decoded;
        next(); /// move on to the actual route handler
    } catch (err) {
        if(err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token expired, please log in again',
                code: 'TOKEN_EXPIRED'
            })
        } else {
            return res.status(401).json({
                message: 'Not authorized, invalid token',
                code: 'INVALID_TOKEN'
            })
        }
    }
}

module.exports = { protect};