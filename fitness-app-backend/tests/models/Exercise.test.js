const Exercise = require('../../models/Exercise');
const { connect, disconnect, clearDatabase } = require('../setup');

beforeAll(async() => clearDatabase());
afterEach(async() => connect());
afterAll(async() => disconnect());

describe('Exercise Model', () => {
    it('should create an exercise successfully', async () => {
        const exercise = await Exercise.create({
            name: 'Push Up',
            category: 'strength',
            fitnessLevel: 'Beginner',
            targtMuscle: 'Chest',
            duration: 10,
        });

        expect(exercise._id).toBeDefined();
        expect(exercise.name).toBe('Push Up');
    });

    it('should fall if required fields are missing', async () => {
        await expect(
            Exercise.create({ name: 'Push Up' })
        ).rejects.toThrow();
    });
});