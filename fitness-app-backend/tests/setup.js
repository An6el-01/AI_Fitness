const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.JWT_SECRET = 'testsecret';

let mongoServer;

module.exports = {
    connect: async () => {
        if (!mongoServer) {
            mongoServer = await MongoMemoryServer.create();
        }
        if (mongoose.connection.readyState === 0) {
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
        }
    },
    disconnect: async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        if (mongoServer) {
            await mongoServer.stop();
            mongoServer = null;
        }
    },
    clearDatabase: async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            if(Object.hasOwnProperty.call(collections, key)){
                await collections[key].deleteMany();
            }
        }
    },
};
