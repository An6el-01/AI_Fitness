const authenticate = require('../../middleware/authenticate');
const jwt = require('jsonwebtoken');

describe('Authenticate Middleware', () => {
    it('should call next() if token is valid', () => {
        const req = {
            headers: {
                authorization:'Bearer valid_token',
            },
        };
        const res = {};
        const next = jest.fn();

        jest.spyOn(jwt, 'verify').mockImplementation(() => ({ userId: '12345 '}));
        authenticate(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toBeDefined();
        expect(req.user.userId).toBe('12345');
    });

    it('should return 401 if token is missing', () => {
        const req = { headers: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
    
        authenticate(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authentication token is missing' });
    });

    if('should return 400 if token is invalid', () => {
        const req = {
            headers: {
                authorization: 'Bearer invalid_token',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        const next = jest.fn();

        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error('Invalid token');
        });
        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWidth(400);
        expect(res.json).toHaveBeenCalledWidth({ error: 'Invalid token.' });
    });
});