const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Mock database
const users = [];

// Signup route
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const userExists = users.find(user => user.username === username);

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    users.push({ username, password });
    res.status(201).json({ message: 'User created successfully' });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});