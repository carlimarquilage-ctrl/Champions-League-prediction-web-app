require('dotenv').config();

const connectDB = require('./db')
const User = require('./models/User');

async function testDatabase() {
    try {
        await connectDB();

        const user = await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'temporary-test-value'
        });

        console.log('User saved:', user.username);
    } catch (error) {
        console.error("Error:", error.message)
    } finally {
        const mongoose = require('mongoose');
        await mongoose.disconnect();
    }
}
testDatabase();