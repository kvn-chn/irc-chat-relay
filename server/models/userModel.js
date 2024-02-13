const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.SECRETKEY;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:  true,
    },
    password: {
        type: String,
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
            { userId: this._id, username: this.username },
            secretKey,
            { expiresIn: '3h' }
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
