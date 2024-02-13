const express = require('express');
const Channel = require('../models/channelModel');
const { getUser, getUserById } = require('./user');
const channelRoutes = express.Router();

channelRoutes.post('/', async (req, res) => {
    try {
        const { channelName, userId } = req.body;
        console.log('userID', userId);

        if (!channelName) {
            return res.status(400).json({ message: 'Please provide a channelName for the channel' });
        }

        const existingChannel = await Channel.findOne({ name: channelName});

        if (existingChannel) return res.status(400).json({ message: 'Channel already exists, joining' });

        const userID = await getUserById(userId).then(user => user._id);

        const newChannel = await Channel.create({ name: channelName, ownerId: userID});

        return res.status(201).json(newChannel);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

channelRoutes.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Please provide an id for the channel' });
        }

        const deletedChannel = await Channel.findByIdAndDelete(id);

        if (!deletedChannel) return res.status(404).json({ message: 'Channel not found' });

        return res.status(200).json(deletedChannel);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

function getChannel(channelName) {
    return Channel.findOne({ name: channelName });
}

function getChannelById(channelId) {
    return Channel.findOne({ _id:channelId });
}

module.exports = { channelRoutes, getChannel, getChannelById };