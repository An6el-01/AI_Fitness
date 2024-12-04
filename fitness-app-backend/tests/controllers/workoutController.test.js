const request = require('supertest');
const app = require('../../server');
const { connect, disconnect, clearDatabase } = require('../setup');
const WorkoutPlan = require('../../models/WorkoutPlan')
const Exercise = require('../../models/Exercise');
const mongoose = require('mongoose');

beforeAll(async() => connect());
afterEach(async() => clearDatabase());
afterAll(async() => disconnect());

describe('Workout Controller', () => {
    let token;

    beforeEach(async () => {
        await Exercise.create([
            {
                name: 'Push Up',
                category: 'Strength',
                fitnessLevel: 'Beginner',
                targetMuscle: 'Chest',
                equipment: 'None',
                duration: 0,
                sport: 'None',
            },
            {
                name: 'Squat',
                category: 'Functional Training',
                fitnessLevel: 'Intermediate',
                targetMuscle: 'Legs',
                equipment: 'None',
                duration: 0,
                sport: 'None',
            },
        ]);

        const userResponse = await request(app)
            .post('/api/users/register')
            .send({ name: 'John Doe', email: 'john@example.com', password: 'password' });

        token = userResponse.body.token;
        expect(token).toBeDefined();
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
                goal: 'build muscle',
            });
            console.log('Response body1:', res.body);
            console.log('Response status1:', res.statusCode);
        expect(res.statusCode).toBe(201);
        expect(res.body.goal).toBe('build muscle');
        expect(res.body.exercises).toBeDefined();
    });

    it('should fail to create a workout plan without required fields', async () => {
        const res = await request(app)
            .post('/api/plans')
            .set('Authorization', `Bearer ${token}`)
            .send({ goal: 'Lose Weight' });
            console.log('Response body2:', res.body);
            console.log('Response status2:', res.statusCode);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Invalid input, all fields are required.');
    });

    it('should retrieve a workout plan successfully', async () => {
        const createdPlan = await WorkoutPlan.create({
            userId: new mongoose.Types.ObjectId(),
            goal: 'Build Muscle',
            fitnessLevel: 'Beginner',
            exercises: [
                {
                    exerciseId: new mongoose.Types.ObjectId(),
                    sets: 3,
                    reps: 12,
                },
            ],
        });

        const res = await request(app)
            .get(`/api/plans/${createdPlan._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.goal).toBe('Build Muscle');
    });

    it('should return 404 if workout plan not found', async () => {
        const invalidId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .get(`/api/plans/${invalidId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Workout plan not found');
    });
});
