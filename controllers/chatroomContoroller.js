const mongoose = require('mongoose');
const ChatRoom = mongoose.model('ChatRoom');
const Message = mongoose.model('Message');
const User = mongoose.model('User');
exports.createChatroom = async (req, res) => {
    const { name } = req.body;

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) throw 'Chatroom name can contain only alphabets.';

    const chatroomExists = await ChatRoom.findOne({ name });
    if (chatroomExists) throw 'Chatroom with that name already exists!';

    const chatroom = new ChatRoom({
        name,
    });
    await chatroom.save();

    res.json({
        chatroom
    });
};

exports.getAllChatRooms = async (req, res) => {
    const chatRooms = await ChatRoom.find({});
    res.json(chatRooms);
};

exports.getMessages = async (req, res) => {
    const {chatroomId} = req.body;
    const messages = await Message.find({chatroom: chatroomId}).select('message userId name date -_id',).where({message: {$ne:" "}});
    res.json(messages);
}

exports.getUsers = async (req,res) => {
    const {chatroomId} = req.body;
    const users = await Message.find({chatroom: chatroomId}).distinct('name');
    const listOfUsers = await User.find({nickname: users}).select('-_id nickname is_online');
    res.json(listOfUsers);
}