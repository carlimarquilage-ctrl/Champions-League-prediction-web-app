const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

            return "Login successful";
        },



    }
};

module.exports = resolvers;