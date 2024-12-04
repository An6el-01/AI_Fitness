const authenticate = require('../../middleware/authenticate');
const jwt = require('jsonwebtoken');

describe('Authenticate Middleware', () => {
    it('should call next() if token is valid', async () => {
        const req = {
            headers: {
                authorization: 'Bearer valid_token',
            },
        };
        const res = {}; // No need for res here as next() is called
        const next = jest.fn();

        jest.spyOn(jwt, 'verify').mockImplementation(() => ({ userId: '12345' }));
        await authenticate(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toBeDefined();
        expect(req.user._id).toBe('12345');
    });

    it('should return 401 if token is missing', async () => {
        const req = { headers: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authentication token is missing' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
        const req = {
            headers: {
                authorization: 'Bearer invalid_token',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or malformed token' });
        expect(next).not.toHaveBeenCalled();
    });
});
