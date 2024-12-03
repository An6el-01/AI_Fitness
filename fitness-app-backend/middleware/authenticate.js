const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async ( req, res, next) => {
    try{
        const token = req.header('Authorization')?.replace('Bearer', '');
        if (!token){
            return res.status(401).json({ message: 'Authentication token is missing'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user){
            return res.status(401).json({ message: 'Authentication failed, user not found'});
        }

        req.user = user; 
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid or expired token.'});
    }
};

module.exports = authenticate;