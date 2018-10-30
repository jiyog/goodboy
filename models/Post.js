const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    body: {type: String, trim: true},
    image: {type: String, trim: true},
    likes: [],
    comment: [{
        userID: {type: String},
        username: {type: String},
        bodyComment: {type: String}
    }],
    date: {type: Date, default: Date.now()},
    owner: {}
}, {collection: 'posts'});

module.exports = mongoose.model('posts', postSchema, 'posts');