import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => console.log('MongoDB Connection ready'));
mongoose.connection.on('error', err => console.error(err));

async function mongoConnect() {
    if (MONGO_URL) {
        await mongoose.connect(MONGO_URL);
    } else {
        throw new Error('Missing Mongo URL env');
    }
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

export { mongoConnect, mongoDisconnect };
