const mongoose = require('mongoose');
const Book = require('../models/book.js');
const Member = require('../models/member.js');

const TransactionSchema = mongoose.Schema({
    name: Member.schema,
    book: Book.schema,
    type: String,
    message: String
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;