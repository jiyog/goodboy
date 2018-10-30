const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true},
    password: {type: String, required: true, trim: true},
    email: {type: String},
    fullname: {type: String},
    address: {type: String},
    followers: [],
    following: [],
    likes: {type: Number, default: 0},
    posts: [{
        idPost: {type: String},
        bodyPost: {type: String, trim: true},
        image: {type: String}
    }]
}, {collection: 'users'});

userSchema.methods.hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

userSchema.methods.comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

module.exports = mongoose.model('users', userSchema, 'users');