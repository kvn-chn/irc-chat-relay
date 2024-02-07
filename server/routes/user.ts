const express = require('express');
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const router = express.Router();

const jwtSecret = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNjY0MTUzNSwiaWF0IjoxNzA2NjQxNTM1fQ.Mj7cixwuIdP6rCNQ_6riQWoXa6WkNPYhoXmXwo4ptVs';

router.post('/register',async (req, res) => {
    const { username, password } = req.body;
    try {
      const createdUser = await User.create({ username, password });
      jwt.sign({ userId: createdUser._id, username }, jwtSecret, {} ,(err, token) => {
      if (err) throw err;
      res.cookie('token', token).status(201).json({
        id: createdUser._id,
      });
    });
    } catch (err) {
      if (err) throw err;
      res.status(500).json({ error: 'Failed to create user' });
    }
  });