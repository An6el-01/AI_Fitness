const { determineFitnessLevel } = require('../../utils/fitnessLevelHelper');

describe('Fitness Level Helper', () => {
    it('should return Beginner for low fitness score', () => {
        const result = determineFitnessLevel(40, 50, 170, 1, 'light', 'beginner');
        expect(result).toBe('Beginner');
    });

    it('should return Advanced for high fitness score', () => {
        const result = determineFitnessLevel(25, 70, 180, 6, 'vigorous', 'advanced');
        expect(result).toBe('Advanced');
    });
});