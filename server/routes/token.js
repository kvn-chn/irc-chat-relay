const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.SECRETKEY;

router.get('/verify', async (req, res) => {
    const token = req.cookies.token;
    
    if (!token) return res.status(401).json({ message: 'Token not provided' });
    
    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.userId, { attributes: { exclude: ['password'] } });

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ message: 'Token verified', id: user.id, username: user.username });
    } 
    catch (error) {
        console.error(error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        
        return res.status(401).json({ message: 'Invalid token' });
    }
});

router.delete('/', async (req, res) => {
    res.clearCookie('token').status(200).json({ message: 'Token deleted' });
});

module.exports = router;