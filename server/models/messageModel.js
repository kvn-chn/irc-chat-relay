const mongoose = require('mongoose');
const { isStringTextContainingNode } = require('typescript');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    },
    isPrivate: {
        type: Boolean,
        required: true
    }
},{ timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;