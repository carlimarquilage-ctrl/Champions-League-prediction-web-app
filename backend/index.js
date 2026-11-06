const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolver')
const { ApolloServerPluginLandingPageLocalDefault } =
    require('@apollo/server/plugin/landingPage/default');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const connectDB = require('./db')

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Champions League Predictor!');
});

const startServer = async () => {
    await connectDB();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [
            ApolloServerPluginLandingPageLocalDefault({
                embed: true
            })]
    });

    await server.start();

    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => {
            const authHeader = req.headers.authorization || '';

            if (!authHeader.startsWith('Bearer ')) {
                return { userID: null };
            }

            const token = authHeader.slice(7);

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                return { userID: decoded.userID };
            } catch (err) {
                return { userID: null };
            }
        }
    }));

    app.listen(4000, () => {
        console.log("Server running on http://localhost:4000")
        console.log("GraphQl available at http://localhost:4000/graphql")
    });

}

startServer();


