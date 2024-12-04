const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Optional: set token expiration
        });

        res.status(201).json({ message: 'User registered successfully!', token });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials. Please try again.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid credentials. Please try again.' });
        }

        const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET);

        res.json({ token });
    } catch (error) {
        console.error('Error in login function[userController.js]:', error);
        res.status(500).json({ error: 'An internal error occurred. Please try again later.' });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id && req.params.id !== 'me' ? req.params.id : req.user._id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            console.error('User not found in DB');
            return res.status(404).json({ message: 'User not found[userController.js]' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile[userController.js]:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};


exports.updateUserProfile = async (req, res) => {
    try{
        const userId = req.params.id;
        const { name, age, height, weight, fitnessGoal, activityLevel, fitnessLevel, dietType, allergies } = req.body;

        const updateData = { name, age, height, weight, fitnessGoal, activityLevel, fitnessLevel, dietType, allergies };

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        if(!user){
            return res.status(400).json({ error: "User not found" });
        }
        res.json({ message: "Profile updated successfully", user });

    }catch(error){
        console.error("Error updating user profile[userController.js]:", error);
        res.status(500).json({ error: "Failed to update user profile "});
    }
}