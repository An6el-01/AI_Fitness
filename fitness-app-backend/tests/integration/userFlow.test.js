const request = require('supertest');
const app = require('../../server');
const { connect, disconnect, clearDatabase } = require('../setup');

beforeAll(async () => {
    process.env.JWT_SECRET = 'testsecret'; // Ensure JWT_SECRET is set
    await connect();
});
afterEach(async () => clearDatabase());
afterAll(async () => disconnect());

describe('User Flow', () => {
    it('should register, login, and fetch user details successfully', async () => {
        const registerRes = await request(app)
            .post('/api/users/register')
            .send({ name: 'John Doe', email: 'john@example.com', password: 'password' });

        expect(registerRes.statusCode).toBe(201);
        expect(registerRes.body.message).toBe('User registered successfully!');

        const loginRes = await request(app)
            .post('/api/users/login')
            .send({ email: 'john@example.com', password: 'password' });

        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body.token).toBeDefined();

        const token = loginRes.body.token;

        
        const userDetailsRes = await request(app)
            .get('/api/users/me') // `/me` route
            .set('Authorization', `Bearer ${token}`);
        expect(userDetailsRes.statusCode).toBe(200);
        expect(userDetailsRes.body.email).toBe('john@example.com');

    });

    it('should prevent duplicate registrations', async () => {
        await request(app)
            .post('/api/users/register')
            .send({ name: 'Jane Doe', email: 'jane@example.com', password: 'password' });

        const res = await request(app)
            .post('/api/users/register')
            .send({ name: 'Jane Doe', email: 'jane@example.com', password: 'password' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Email is already in use.');
    });

    it('should return error for invalid login credentials', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'nonexistent@example.com', password: 'password' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid credentials. Please try again.');
    });

    it('should return unauthorized for protected route without token', async () => {
        const res = await request(app).get('/api/users/me');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Authentication token is missing');
    });
});
