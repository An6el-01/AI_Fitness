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
                experience: 'intermediate',
                goal: 'Lose Weight',
            },
        };
        const res = {
            status:  jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        validateWorkoutPlanInput(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 if input is invalid', () => {
        const req = { body: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        validateWorkoutPlanInput(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input, all fields are required.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid value in fields', () => {
        const req = {
            body: {
                weight: -10,
                height: 170,
                age: 30,
                sex: 'inavlid_sex',
                activityFrequency: 3,
                activityIntensity: 'invalid_intensity',
                experience: 'invalid_experience',
                goal: 'invalid_goal',
            },
        };
        const res ={
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        validateWorkoutPlanInput(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input values. Numbers must be positive.'});
        expect(next).not.toHaveBeenCalled();
    })
});