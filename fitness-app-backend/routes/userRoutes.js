const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Authentication
router.post('/register', userController.register);
router.post('/login', userController.login);

//User Profile
// * Fetch user profile
router.get('/:id', userController.getUserProfile);

// * Update user profile
router.put('/:id', userController.updateUserProfile);
module.exports = router;