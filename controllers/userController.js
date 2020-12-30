const mongoose = require('mongoose');
const User = mongoose.model('User');
const sha256 = require('js-sha256');
const jwt = require('jwt-then');
exports.register = async (req, res) => {
    const {nickname, name, surname, password} = req.body;
    if (password.length < 6) throw 'Password must be at least 6 characters long';
    const userExists = await User.findOne({
        nickname,
    });
    if (userExists) throw 'User with this nickname already exists';
    const user = new User({
        nickname,
        name,
        surname,
        password: sha256(password + process.env.SALT),
    });

    await user.save();
    res.json({
        message: `User ${nickname} registered successfully!` ,
    });
};

exports.login = async (req, res) => {
    const {nickname,password} = req.body;
    const user = await User.findOne({nickname,
        password: sha256(password + process.env.SALT)
    });
    if (!user) throw 'Nickname and Password did not match.';

    const token = await jwt.sign({ id: user.id }, process.env.SECRET);

    res.json({
        message: `User ${nickname} logged in successfully`,
        token,
        nickname,
    });
};