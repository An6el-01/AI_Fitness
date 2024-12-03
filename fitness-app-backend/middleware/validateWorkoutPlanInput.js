const validateWorkoutPlanInput = (req, res, next) => {
    const { weight, height, age, sex, activityFrequency, activityIntensity, experience, goal, sport } = req.body;

    // Validate required fields
    if (!weight || !height || !age || !sex || !activityFrequency || !activityIntensity || !experience || !goal) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Validate positive numerical values
    if (weight <= 0 || height <= 0 || age <= 0 || activityFrequency <= 0) {
        return res.status(400).json({ message: 'Invalid input values. Numbers must be positive.' });
    }

    // Validate enumerated fields
    if (!['male', 'female', 'other'].includes(sex.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid value for sex.' });
    }

    if (!['light', 'moderate', 'vigorous'].includes(activityIntensity.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid value for activity intensity.' });
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(experience.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid value for experience.' });
    }

    if (!['lose weight', 'gain weight', 'bulk', 'cutting', 'muscle gaining', 'athletic gain'].includes(goal.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid value for fitness goal.' });
    }

    // Optional validation for sport (only if goal is "Athletic Gain")
    if (goal.toLowerCase() === 'athletic gain' && sport && typeof sport !== 'string') {
        return res.status(400).json({ message: 'Invalid value for sport.' });
    }

    next();
};

module.exports = validateWorkoutPlanInput;
