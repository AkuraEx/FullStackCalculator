// Modules
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// MiddleWare
app.use(bodyParser.json());
app.use(express.static('public'));

// This stores all past equations entered
const history = [];

// This method lets the server receive the history information
app.get('/api', (req, res) => {
    res.json(history);
});

// This method pushes a new equation into the history array
app.post('/api', (req, res) => {
    const { equation, result } = req.body;

    if (!equation) {
        return res.status(400).json({error: 'Equation is required'});
    }

    const newEquation = {equation, result};
    history.push(newEquation);
    res.status(201).json(newEquation);
});

// Starts the server and listens for client requests
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});