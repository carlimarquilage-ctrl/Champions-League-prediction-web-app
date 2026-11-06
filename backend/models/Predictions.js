const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    homeTeam: {
        type: String,
        required: true
    },
    awayTeam: {
        type: String,
        required: true
    },
    predictedResult: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Prediction = mongoose.model('Prediction', predictionSchema)

module.exports = Prediction;

