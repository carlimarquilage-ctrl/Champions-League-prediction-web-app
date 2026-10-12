
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

    app.listen(4000, () => {
        console.log("Server running on http://localhost:4000")
    });

}

startServer();


