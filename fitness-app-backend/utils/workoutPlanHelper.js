//Generates workout plans dynamically

const Exercise = require('../models/Exercise');

async function generateWorkoutPlan(goal, fitnessLevel, sport = null){
    const exercises = await Exercise.find({ fitnessLevel }).lean();

    if(exercises.length === 0){
        throw new Error("No exercises found for the given fitness level.");
    }

    //Filter exercises based on the user's goal
    const filteredExercises = exercises.filter((exercise) => {
        if (goal === 'Lose Weight') return exercise.category === 'Cardio';
        if (goal === 'Gain Weight') return exercise.category === 'Strength';
        if (goal === 'Atheltic Gain') {
            if (sport) {
                return exercise.sport === sport;
            };

            return exercise.category === "Functional Training"
        }
        return true;
    });

    if (filteredExercises.length === 0) {
        throw new Error(`No exercises found for goal: ${goal} and sport: ${sport || 'default functional training'}`);
    }

    //Construct the plan
    const workoutPlan = filteredExercises.slice(0, 10).map((exercise) => ({
        exerciseId: exercise._id,
        sets: goal === 'Gain Weight' ? 4 : 3,
        reps: goal === "Gain Weight" ? 8 : 12,
        duration: exercise.category === 'Cardio' ?  exercise.duration : null,
    }));

    return workoutPlan;
}

module.exports = generateWorkoutPlan;