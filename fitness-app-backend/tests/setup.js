const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

module.exports = {
    connect: async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiesTopology: true });
    },
    disconnect: async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    },
    clearDatabase: async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections){
            const collection = collections[key];
            await collection.deleteMany();
        }
    },
};