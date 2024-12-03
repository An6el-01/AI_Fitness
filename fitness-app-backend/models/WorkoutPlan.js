const mongoose = require('mongoose');

const WorkoutPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    goal: {type: String, required: true },
    fitnessLevel: { type: String, required: true },
    exercises: [
        {
            exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise"},
            sets: { type: Number, required: true },
            reps: { type: Number, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WorkoutPlan', WorkoutPlanSchema);