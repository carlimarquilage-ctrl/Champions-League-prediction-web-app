const typeDefs = `#graphql
    type User{
        id: ID!
        username: String!
        email: String!
    }

    type Prediction {
        id: ID!
        userId: ID!
        homeTeam: String!
        awayTeam: String!
        predictedResult: String!
        createdAt: String
    }
    type Query {
        getTeams: [String!]!
        getUserPredictions: [Prediction!]!
        getModelMetrics: ModelMetrics
        getTeamHistory(team: String!): TeamHistory
        }
    
    type ModelMetrics {
        accuracy: Float!
        precision: Float
        recall: Float
        F1: Float}
    
    type TeamHistory {
    team: String!
    matchesPlayed: Int!
    wins: Int!
    draws: Int!
    losses: Int!}

    type Mutation {
    register(
        username: String!
        email: String!
        password: String!
    ): String!
    
    login(email: String!, password: String!): String!
    

    savePrediction(
    homeTeam: String!
    awayTeam: String!
    predictedResult: String!): Prediction!

    deletePrediction(id: ID!): Boolean!
    }
    `;

module.exports = typeDefs;

