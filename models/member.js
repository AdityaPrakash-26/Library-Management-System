const mongoose = require('mongoose');
const Book = require('../models/book.js');

const MemberSchema = mongoose.Schema({
    name: String,
    age: Number,
    phone: Number,
    debt: {type: Number, default: '0'},
    books: [Book.schema]
});

const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;