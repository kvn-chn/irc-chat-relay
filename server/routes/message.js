const express = require('express');
const Message = require('../models/messageModel');
const router = express.Router();

const verifyToken = require('./verifyToken');

router.get('/messages', verifyToken, async (req, res) => {  
    try {
        const messages = await Message.find();
        return res.status(200).json(messages);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
);

router.post('/messages', verifyToken, async (req, res) => {
    try {
        const { senderId, sender, receiver, message, isPrivate } = req.body;
        const newMessage = await Message.create({ senderId, sender, receiver, message, isPrivate });
        return res.status(201).json(newMessage);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;