const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authenticate = require('../middleware/authenticate');
const validateWorkoutPlanInput = require('../middleware/validateWorkoutPlanInput');

router.post('/', authenticate, validateWorkoutPlanInput, workoutController.createWorkoutPlan);
router.get('/:id', authenticate, workoutController.getWorkoutPlan);

module.exports = router;
