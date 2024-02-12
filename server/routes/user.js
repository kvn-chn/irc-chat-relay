const express = require('express');
const User = require('../models/userModel');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            const missingFields = [];

            if (!username) missingFields.push('Username');
            if (!password) missingFields.push('Password');

            return res.status(400).json({
                message: `Please provide data to create a user. Missing fields: ${missingFields.join(', ')}.`
            });
        }
        else if (typeof username !== 'string' || typeof password !== 'string') {
            const wrongFields = [];

            if (typeof username !== 'string') wrongFields.push('username');
            if (typeof password !== 'string') wrongFields.push('password');

            return res.status(400).json({
                message: `Please provide the correct types to create a user. Wrong fields: ${wrongFields.join(', ')}.`
            });
        }

        const existingUser = await User.findOne({ username });
        
        if (existingUser) return res.status(400).json({ message: 'Username already used' });

        const createdUser = await User.create({ username, password });
        const hashedPassword = await createdUser.hashPassword(password);
        console.log(hashedPassword)
    
        await createdUser.updateOne({ username: username, password: hashedPassword });
        
        const token = await createdUser.generateToken();

        return res.cookie('token', token, { httpOnly: true }).status(201).json({ message: 'User registered successfully', token: token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            const missingFields = [];

            if (!username) missingFields.push('Username');
            if (!password) missingFields.push('Password');

            return res.status(400).json({
                message: `Please provide data to create a user. Missing fields: ${missingFields.join(', ')}.`
            });
        }
        else if (typeof username !== 'string' || typeof password !== 'string') {
            const wrongFields = [];

            if (typeof username !== 'string') wrongFields.push('username');
            if (typeof password !== 'string') wrongFields.push('password');

            return res.status(400).json({
                message: `Please provide the correct types to create a user. Wrong fields: ${wrongFields.join(', ')}.`
            });
        }

        const existingUser = await User.findOne({ username });
        console.log('existingUser',existingUser);
        
        if (!existingUser) return res.status(404).json({ message: 'Account does not exist' });

        if (await existingUser.comparePassword(password)) {
            const token = await existingUser.generateToken();
            
            return res.cookie('token', token, { httpOnly: true }).status(201).json({ message: 'Successfully logged in', token: token, userId: existingUser._id });
        }
        return res.status(401).json({ message: "Invalid Username or Password" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error '});
    }
});

function getUser(username) {
    const user = User.findOne({ username });
    return user;
}

function getUserById(id) {
    const user = User.findById(id);
    return user;
}

module.exports = { router, getUser, getUserById };