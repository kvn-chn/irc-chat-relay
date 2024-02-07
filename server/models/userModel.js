const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNjY0MTUzNSwiaWF0IjoxNzA2NjQxNTM1fQ.Mj7cixwuIdP6rCNQ_6riQWoXa6WkNPYhoXmXwo4ptVs';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    socket_id: {
        type: String,
        unique: true,
        required: true
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

User.prototype.hashPassword = async function (password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch (error) {
        throw error;
    }
};

User.prototype.generateToken = function () {
    try {
        const token = jwt.sign(
            { username: this.username },
            secretKey,
            { expiresIn: '1h' }
        );

        return token;
    } catch (err) {
        throw err;
    }
};

User.prototype.getInfoFromToken = function (token) {
    try {
        const decoded = jwt.verify(token, secretKey);

        if (decoded) {
            const username = decoded.username;

            return { username };
        }
        return null;
    } catch (err) {
        throw err;
    }
};

module.exports = User;
