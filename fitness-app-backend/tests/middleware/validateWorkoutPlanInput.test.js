const validateWorkoutPlanInput = require('../../middleware/validateWorkoutPlanInput');

describe('Validate Workout Plan Input Middleware', () => {
    it('should call next() if input is valid', () => {
        const req = {
            body: {
                weight: 70,
                height: 170,
                age: 30,
                sex: 'male',
                activityFrequency: 3,
                activityIntensity: 'moderate',
                goal: 'Lose Weight',
            },
        };
        const res = {};
        const next = jest.fn();

        validateWorkoutPlanInput(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return 400 if input is invalid', () => {
        const req = { body: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        validateWorkoutPlanInput(req, res, next);

        expect(res.status).toHaveBeenCalledWidth(400);
        expect(res.json).toHaveBeenCalledWidth({ message: 'Invalid input. Please provide all required fields.' });
    });
});