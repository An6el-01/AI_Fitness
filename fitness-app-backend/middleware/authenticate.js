const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '').trim();
        if (!token) {
            console.error('Missing token');
            return res.status(401).json({ message: 'Authentication token is missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findById(decoded.userId)
        //Handle Mock Scenario
        if (user && typeof user.select === 'function'){
            user = await user.select('-password');
        }
        if (!user) {
            console.error('User not found for token:', decoded.userId);
            return res.status(401).json({ message: 'Authentication failed, user not found' });
        }

        req.user = user; 
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid or malformed token' });
        }
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authenticate;