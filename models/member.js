const mongoose = require('mongoose');
const Book = require('./models/book');

const MemberSchema = mongoose.Schema({
    name: String,
    age: Number,
    debt: Number,
    books: [Book.schema]
});

const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;