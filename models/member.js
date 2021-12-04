const mongoose = require('mongoose');

var MemberSchema = mongoose.Schema({
    memberID: Number,
    name: String,
    age: Number,
    debt: Number
});

const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;