const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

//Authentication
router.post('/register', userController.register);
router.post('/login', userController.login);

// * Fetch user profile
router.get('/me', authenticate, userController.getUserProfile);
router.get('/:id', userController.getUserProfile);
// * Update user profile
router.put('/:id', userController.updateUserProfile);


module.exports = router;