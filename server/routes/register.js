const express = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/', async (req, res) => {
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({ username, password: hashedPassword });

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;