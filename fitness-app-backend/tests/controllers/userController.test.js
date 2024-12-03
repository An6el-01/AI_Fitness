const request = require('supertest');
const app = require('../../server');
const { connect, disconnect, clearDatabase } = require('../setup');

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => disconnect());

describe('User Controller', () => {
    it('should return a user successfully', async () => {
        const res = await request(app)
        .post('/api/users/register')
        .send({ name: 'John Doe', email: 'john@example.com', password: 'password '});
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('User registered successfully!');
    });

    it('should fail to login with invalid credentials', async() => {
        const rest = await request(app)
        .post('api/users/login')
        .send({ email: 'invalid@example.com', password:'password'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid credentials, please try again.');
    });
});
