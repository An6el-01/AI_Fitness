const { generateWorkoutPlan } = require('../../utils/workoutPlanHelper');
const Exercise = require('../../models/Exercise');
const { connect, disconnect, clearDatabase } = require('../setup');

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () =>  await disconnect());

describe('Workout Plan Helper', () => {
    beforeEach(async () => {
        await Exercise.create([
            {name: 'Push Up', category: 'strength', fitnessLevel: 'Beginner', targetMuscle: 'Chest', duration: 10 },
            {name: 'Running', category: 'cardio', fitnessLevel: 'Intermediate', targetMuscle: 'Legs', duration: 20 }
        ]);
    });

    it('should generate a workout plan for weight loss', async () => {
        const plan =  await generateWorkoutPlan('Lose Weight', 'Intermediate');
        expect(plan).toHaveLength(1);
        expect(plan[0].exerciseId).toBeDefined();
    });

    it('should throw an error if no exercises are available', async () => {
        await clearDatabase();
        await expect(generateWorkoutPlan('Lose Weight', 'Beginner')).rejects.toThrow(
            'No exercises found for the given fitness level.'
        );
    });
});