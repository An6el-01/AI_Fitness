const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['Cardio', 'Strength', 'Functional Training'],  required: true },
    fitnessLevel: { type: String, enum: ['Beginner', "Intermediate", "Advanced"], required: true },
    targetMuscle: { type: String, required: true },
    equipment: { type: String, default: 'None' },
    duration: { type: Number, required: true },
    sport: {type: String, default: 'None'},
});

module.exports = mongoose.model('Exercise', ExerciseSchema);