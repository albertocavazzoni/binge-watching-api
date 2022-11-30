import mongoose from 'mongoose';

const user = {
    username: process.env.MONGO_USER,
    password: process.env.MONGO_URL,
};

console.log(user);

const MONGO_URL = `mongodb+srv://${user.username}:${user.password}@cluster0.zfjcqjr.mongodb.net/?retryWrites=true&w=majority`;

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
