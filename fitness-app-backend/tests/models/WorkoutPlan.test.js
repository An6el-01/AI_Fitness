const mongoose = require('mongoose');
const WorkoutPlan = require('../../models/WorkoutPlan');
const { connect, disconnect, clearDatabase } = require('../setup');

beforeAll(async () => connect());
afterEach(async () => clearDatabase());
afterAll(async () => disconnect());

describe('WorkoutPlan Model', () => {
    it('should create a workout plan successfully', async () => {
        const plan = await WorkoutPlan.create({
            userId: new mongoose.Types.ObjectId(),
            goal: 'Lose Weight',
            fitnessLevel: 'Beginner',
            exercises: [{exerciseId: new mongoose.Types.ObjectId(), sets: 4, reps: 10}],
        });

        expect(plan._id).toBeDefined();
        expect(plan.goal).toBe('Lose Weight');
    });

    it('should fail if required fields are missing', async () => {
        await expect(
            WorkoutPlan.create({ goal: 'Lose Weight' })
        ).rejects.toThrow();
    });
});