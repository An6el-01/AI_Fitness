const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    }catch(error){
        rest.status(500).json({ message: 'Error registering user :(' });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials. Please try again." });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials. Please try again." });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error("Error in login function[userController.js]:", error); // Log detailed error
        res.status(500).json({ error: 'An internal error occurred. Please try again later.' });
    }
};

exports.getUserProfile = async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({ message: "User not found[userController.js]" })
        }
        res.json(user);
    }catch(error){
        console.error("Error fetching user profile[userController.js]:", error);
        res.status(500).json({ error: "Failed to fetch user profile "});
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