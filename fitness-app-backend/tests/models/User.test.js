const User = require('../../models/User');
const { connect, disconnect, clearDatabase } = require('../setup');

beforeAll(async() => connect());
afterEach(async() => clearDatabase());
afterAll(async() => disconnect());

describe('User Model', () => {
    it('should create a user successfully', async () => {
        const user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password',
        });

        expect(user._id).toBeDefined();
        expect(user.email).toBe('john@example.com');
    });

    it('should fail if email is not unique', async () => {
        await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password',
        })
        await expect(
            User.create({
                name: 'Jane Doe',
                email: 'john@example.com',
                password: 'password',
            })
        ).rejects.toThrow();
    });
});