require('dotenv').config();

const mongoose = require('mongoose');
require('./models/User');
require('./models/ChatRoom');
require('./models/Message');

const app = require('./app');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const jwt = require('jwt-then');

server.listen(process.env.PORT, () => {
    console.log(`server listening port ${process.env.PORT}`);
});

mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(response => {
    console.log('database connection established');
}).catch(err => {
    console.log(`Can not connect to database, connection error + ${err}`);
});

const Message = mongoose.model('Message');
const User = mongoose.model('User');

io.use(async (socket, next) => {

    try {
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, process.env.SECRET);
        socket.userId = payload.id;
        next();
    } catch (err) {

    }
});

io.on('connection', async (socket) => {
    console.log('Connected: ' + socket.userId);
    await User.updateOne({_id: socket.userId}, {is_online: true});
    await io.emit('updateUsers');

    socket.on('disconnect', async () => {
        console.log('Disconnected ' + socket.userId);
        await User.updateOne({_id: socket.userId}, {is_online: false});
        await io.emit('updateUsers');
    });

    socket.on('JoinRoom', async ({chatroomId}) => {
        socket.join(chatroomId);
        const userInRoom = await Message.findOne({chatroom: chatroomId, userId: socket.userId});

        if (!userInRoom) {
            const user = await User.findOne({_id: socket.userId});
            const newUser = new Message({
                userId: user.id,
                name: user.nickname,
                chatroom: chatroomId,
                message: " "
            });

            await newUser.save();
            await io.emit('updateUsers');
        }
        console.log('A user joined chatroom: ' + chatroomId);
    });

    socket.on('leaveRoom', ({chatroomId}) => {
        socket.leave(chatroomId);
        console.log('A user left chatroom ' + chatroomId);
    });

    socket.on('chatroomMessage', async ({chatroomId, message, date}) => {
        if (message.trim().length > 0) {
            const user = await User.findOne({_id: socket.userId});
            const newMessage = new Message({
                chatroom: chatroomId,
                userId: socket.userId,
                name: user.nickname,
                date,
                message
            });

            io.to(chatroomId).emit('newMessage', {
                message,
                name: user.nickname,
                userId: socket.userId,
                date
            });

            await newMessage.save();
        }
    })
})