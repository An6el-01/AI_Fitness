const request = require('supertest');
const app = require('../../server');
const { connect, disconnect, clearDatabase } = require('../setup');
const WorkoutPlan = require('../../models/WorkoutPlan')

beforeAll(async() => connect());
afterEach(async() => clearDatabase());
afterAll(async() => disconnect());

describe('Workout Controller', () => {
    let token;

    beforeEach(async () => {
        const userResponse = await request(app)
        .post('api/users/register')
        .send({ name: 'John Doe', email: 'john@example.com', password: 'password' });
        
        token = userResponse.body.token;
    });

    it('should create a workout plan successfully', async () => {
        const res = await request(app)
        .post('/api/plans')
        .set('Authorization', `Bearer ${token}`)
        .send({
            weight: 75,
            height: 175,
            age: 28,
            sex: 'male',
            activityFrequency: 3,
            activityIntensity: 'moderate',
            experience: 'beginner',
            goal: 'Build Muscle',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.goal).toBe('Build Muscle');
        expect(res.body.exercises).toBeDefined();
    });

    it('should fail to create a workout plan without required fields', async () => {
        const res = await request(app)
        .post('/api/plans').set('Authorization', `Bearer ${token}`)
        .send({ goal: 'Lose Weight' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid input, all fields are required.');
    });

    it('should retrieve a workout plan successfully', async () => {
        const createdPlan = await WorkoutPlan.create({
            userId: 'some-user-id',
            goal: 'Build Muscle',
            exercises: [{ exerciseId: 'some-exercise-id', duration: 30 }],
        });

        const res = await request(app)
        .get(`api/plans/${createdPlan._id}`)
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.goal).toBe('Build Muscle');
    });

    it('should return 404 if workout plan not found', async () => {
        const res = await request(app)
        .get('/api/plans/invalid-plan-id')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Workout plan not found');
    });
});