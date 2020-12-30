const express = require('express');

const app = express();
app.use(require('cors')());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', require('./routes/user'));
app.use('/chatroom', require('./routes/chatroom'));

const errorHandlers = require('./handlers/errorHandlers');
app.use(errorHandlers.catchErrors);
app.use(errorHandlers.mongooseErrors);
app.use(errorHandlers.notFound);

module.exports = app;