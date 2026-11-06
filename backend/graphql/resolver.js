const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Prediction = require('../models/Predictions');

const resolvers = {
    Query: {
        getTeams: () => {
            return ["Real Madrid", "Barcelona", "Bayern Munich"]
        },
        getTeamHistory: (_, { team }) => {
            return {
                team: team,
                matchesPlayed: 10,
                wins: 7,
                draws: 2,
                losses: 1
            };
        },
        getUserPrediction: async (_, __, context) => {
            if (!context.userID) {
                throw new Error("You must be logged in to view predictions");
            }

            const predictions = await Prediction.find({
                userID: context.userID
            });

            return predictions.map((prediction) => ({
                id: prediction._id.toString(),
                userId: prediction.userID.toString(),
                homeTeam: prediction.homeTeam,
                awayTeam: prediction.awayTeam,
                predictedResult: prediction.predictedResult,
                createdAt: prediction.createdAt.toISOString()
            }));
        }
    },


    Mutation: {
        register: async (_, { username, email, password }) => {
            const existingUser = await User.findOne({ email: email });

            if (existingUser) {
                throw new Error("Email is already registered")
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            await User.create({
                username: username,
                email: email,
                password: hashedPassword
            });

            return "User registered succesfully";
        },

        login: async (_, { email, password }) => {

            const user = await User.findOne({ email: email })

            if (!user) {
                throw new Error("Invalid email");
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                throw new Error("Invalid password");
            }

            const token = jwt.sign(
                { userID: user._id.toString() },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            )

            return token;
        },

        savePrediction: async (_, { homeTeam, awayTeam, predictedResult }, context) => {
            if (!context.userID) {
                throw new Error("You must be logged in to save a prediction");
            }

            if (homeTeam === awayTeam) {
                throw new Error("Home and away teams must be different");
            }

            const allowedResults = ["Home Win", "Draw", "Away Win"];

            if (!allowedResults.includes(predictedResult)) {
                throw new Error("Invalid predicted result");
            }

            const prediction = await Prediction.create({
                userID: context.userID,
                homeTeam,
                awayTeam,
                predictedResult
            });

            return {
                id: prediction._id.toString(),
                userId: prediction.userID.toString(),
                homeTeam: prediction.homeTeam,
                awayTeam: prediction.awayTeam,
                predictedResult: prediction.predictedResult,
                createdAt: prediction.createdAt.toISOString()
            };
        }



    }
};

module.exports = resolvers;