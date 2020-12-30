const mongoose = require('mongoose');
const ChatRoomSchema = new mongoose.Schema({
    chatroom: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ChatRoom',

    },
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Message', ChatRoomSchema);