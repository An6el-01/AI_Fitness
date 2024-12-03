const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authenticate = require('../middleware/authenticate');
const validateWorkoutPlanInput = require('../middleware/validateWorkoutPlanInput');

router.post('/plans', authenticate, validateWorkoutPlanInput, workoutController.createWorkoutPlan);

module.exports = router;
