const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.SECRETKEY;

exports.cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, secretKey);
        req.user = user;
        next();
    }
    catch (err) {
        res.clearCookie("token");
        return res.redirect('/login');
    }
}

exports.cookieJwtAuth = async (req, res, next) => {
    const token = req.cookies.token;
    
    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.userId, { attributes: { exclude: ['password'] } });

        if (!user) return res.status(404).json({ message: 'User not found' });

        next();
    } 
    catch (error) {
        console.error(error);

        res.clearCookie("token");
        const port = req.get('host').split(':')[1];
        return res.redirect(`http://${req.hostname}:${port}/login`);
    }
}