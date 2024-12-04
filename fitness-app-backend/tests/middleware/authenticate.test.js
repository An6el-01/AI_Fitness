const authenticate = require('../../middleware/authenticate');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

jest.mock('../../models/User'); 

describe('Authenticate Middleware', () => {
    it('should call next() if token is valid', async () => {
        const req = {
            headers: {
                authorization: 'Bearer valid_token',
            },
            header: function (name) {
                return this.headers[name.toLowerCase()];
            },
        };
        const res = {}; 
        const next = jest.fn();

        jest.spyOn(jwt, 'verify').mockImplementation(() => ({ userId: 'validUserId' }));

     
        User.findById.mockResolvedValue({
             select: jest.fn().mockResolvedValue({ _id: 'validUserId', name: 'John Doe', email: 'john@example.com'}), 
            });

        await authenticate(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toBeDefined();
        expect(req.user._id).toBe('validUserId');
    });

    it('should return 401 if token is missing', async () => {
        const req = {
            headers: {},
            header: function (name) {
                return this.headers[name.toLowerCase()];
            },
        };
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
            header: function (name) {
                return this.headers[name.toLowerCase()];
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw { name: 'JsonWebTokenError' };
        });

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or malformed token' });
        expect(next).not.toHaveBeenCalled();
    });
});
