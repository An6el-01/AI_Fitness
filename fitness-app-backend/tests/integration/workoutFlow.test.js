const request = require('supertest');
const app = require('../../server');
const { connect, disconnect, clearDatabase } = require('../setup');

beforeAll(async () => connect());
afterEach(async () => clearDatabase());
afterAll(async () => disconnect());

 describe('Work Flow', () => {
    it('should create a workout plan for a registered user', async () => {
        const user = await request(app)
        .post('/api/users/register')
        .send({ name: 'Jane Doe', email: 'jane@example.com', password: 'password' });

        const token = user.body.token;
        const res = await request(app)
        .post('/api/plans')
        .set('Authorization', `Bearer ${token}`)
        .send({
            weight: 70,
            height: 170,
            age:30,
            sex: 'female',
            activityFrequency: 4,
            activityIntensity: 'moderate',
            experience: 'intermediate',
            goal: 'Lose Weight',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.goal).toBe('Lose Weight');
    });
 });