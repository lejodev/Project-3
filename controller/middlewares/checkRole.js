require ('dotenv').config();
const jwt = require('jsonwebtoken');

const JWTSecret = process.env.JWT_SECRET;
const ADMIN_ROLE = 1;

const checkRole = function (req, res, next) {
    
    const token = req.headers.authorization.split(' ')[1];

    if (token.length > 0) {
        
        const user = jwt.verify(token, JWTSecret);
        
        if (user.role === ADMIN_ROLE) {
            next();
        } else {
            res.status(401).send('You are not authorized to do this operation');
        }

    } else {
        res.status(400).send('No permission');
    }
}

module.exports = checkRole;