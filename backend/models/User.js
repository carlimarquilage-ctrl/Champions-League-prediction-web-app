const moongoose = require('mongoose')

const userSchema = new moongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = moongoose.model('User', userSchema);

module.exports = User;