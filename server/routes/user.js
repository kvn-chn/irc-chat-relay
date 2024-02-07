const express = require('express');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const router = express.Router();

const jwtSecret = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNjY0MTUzNSwiaWF0IjoxNzA2NjQxNTM1fQ.Mj7cixwuIdP6rCNQ_6riQWoXa6WkNPYhoXmXwo4ptVs';

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            const missingFields = [];

            if (!username) missingFields.push('Username');
            if (!username) missingFields.push('Password');

            return res.status(400).json({
                message: `Please provide data to create a user. Missing fields: ${missingFields.join(', ')}.`
            });
        }
        else if (typeof username !== 'string' || typeof password !== 'string') {
            const wrongFields = [];

            if (typeof username !== 'string') wrongFields.push('username');
            if (typeof password !== 'string') wrongFields.push('password');

            return res.status(400).json({
                message: `Please provide the correct types to create an employer. Wrong fields: ${wrongFields.join(', ')}.`
            });
        }

        const existingUser = await User.findOne({ where: { username } }) 
        
        if (existingUser) return res.status(400).json({ message: 'Email already used' });

    
        const createdUser = await User.create({ username, password });
        
        jwt.sign({ userId: createdUser._id, username }, jwtSecret, {} ,(err, token) => {
            if (err) throw err;
            res.cookie('token', token).status(201).json({id: createdUser._id, username: username, password: password });
        });
    } catch (err) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;