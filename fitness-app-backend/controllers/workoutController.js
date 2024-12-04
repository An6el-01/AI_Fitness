// Handles API Requests

const WorkoutPlan = require('../models/WorkoutPlan');
const generateWorkoutPlan = require('../utils/workoutPlanHelper');
const {determineFitnessLevel} = require('../utils/fitnessLevelHelper');

exports.createWorkoutPlan = async (req, res) => {
    try {
        const { weight, height, sex, availableTime, activityFrequency, activityIntensity, experience, goal, sport } = req.body;
        const fitnessLevel = determineFitnessLevel(req.body.age, weight, height, activityFrequency, activityIntensity, experience);
        const exercises = await generateWorkoutPlan(goal, fitnessLevel, sport);

        // Save the workout plan to the database
        const workoutPlan = new WorkoutPlan({
            userId: req.user._id,
            goal,
            fitnessLevel,
            exercises,
        });
        await workoutPlan.save();

        res.status(201).json(workoutPlan);
    } catch (error) {
        console.error("Error creating workout plan: ", error);
        res.status(500).json({ message: "Failed to create workout plan" });
    }
};

exports.getWorkoutPlan = async (req, res) => {
    try {
        const workoutPlan = await WorkoutPlan.findById(req.params.id);

        if (!workoutPlan) {
            return res.status(404).json({ error: 'Workout plan not found' }); // Matches test case
        }

        res.status(200).json(workoutPlan);
    } catch (error) {
        console.error("Error fetching workout plan: ", error);
        res.status(500).json({ error: "Failed to fetch workout plan" });
    }
};
