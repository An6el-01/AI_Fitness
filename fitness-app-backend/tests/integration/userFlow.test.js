const request = require('supertest');
const app = require('../../server');
const { connect, disconnect, clearDatabase } = require('../setup');

beforeAll(async () =>  connect());
afterEach(async () => clearDatabase());
afterAll(async () => disconnect());

describe('User Flow', () => {
    it('should register, login, and fetch user details successfully', async () => {
        const registerRes =  await request(app)
        .post('/api/users/register')
        .send({ name: 'John Doe', email: 'john@example.com', password: 'password' });

        expect(registerRes.statusCode).toBe(201);
        expect(registerRes.body.message).toBe('User registered successfully!');

        const loginRes = await request(app)
        .post('/api/users/login')
        .send({ email:'john@example', password: 'password'});

        expect(loginRes.statusCode).toBe(200);
        expect(userDetailsRes.body.email).toBe('john@example.com');
    });

    it('should prevent duplicate registrations', async () => {
        await request(app)
        .post('api/users/register')
        .send({ name: 'Jane Doe', email: 'jane@example.com', password: 'password' });

        const res = await request(app)
        .post('api/users/register')
        .send({ name: 'Jane Doe', email: 'jane@example.com', password: 'password' }); 

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Email is already in use.');
    });

    it('should return error for invalid login credentials', async () => {
        const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'nonexistent@example.com', password: 'password '});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid credentials, please try again.');
    });

    it('should return unauthorized for protected route without token', async () => {
        const res = await request(app).get('/api/users/me');
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Unauthorized, no token provided.');
    });
});