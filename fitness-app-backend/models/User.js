const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required:true },
    email: { type: String, required:true, unique: true },
    password: { type: String, required:true },
    age: { type: Number, default: null },
    height: { type: Number, default: null}, //in centimeters
    weight: { type: Number, default: null}, //in kilograms
    fitnessGoal: { type: String, default: null}, //e.g "weight loss", "muscle gain"
    activityLevel: { type:String, default: null }, //e.g "sedentary, "active"
    fitnessLevel: { type: String, default: null },
    dietType: { type: String, default: null },
    allergies: { type: [String], default: []},
    createdAt: { type:Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);