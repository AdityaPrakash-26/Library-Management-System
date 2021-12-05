// Requiring module
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');
const https = require('https');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');


const Book = require('./models/book');
const Member = require('./models/member');

mongoose.connect('mongodb://localhost:27017/Library', { useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Creating express object
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// HANDLING GET REQUESTS
// INDEX ROUTE
app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs');
})

// BOOK ROUTES BEGIN
app.get('/books', async (req, res) => {
    const books = await Book.find({});
    res.render(__dirname + '/views/books/books.ejs', {books});
})

app.get('/books/new', (req, res) => {
    res.render(__dirname + '/views/books/new.ejs');
})

app.post('/books', async(req, res) => {
    const book = new Book(req.body.book);
    await book.save();
    res.redirect(`/books/${book._id}`);
})

app.get('/books/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render(__dirname + '/views/books/show.ejs', {book});
})

app.get('/books/:id/edit', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render(__dirname + '/views/books/edit.ejs', {book});
})

app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book});
    res.redirect(`/books/${book._id}`);
})

app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.redirect('/books');
})
// BOOK ROUTES END



// MEMBER ROUTES BEGIN
app.get('/members', async (req, res) => {
    const members = await Member.find({});
    res.render(__dirname + '/views/members/members.ejs', {members});
})

app.get('/members/new', (req, res) => {
    res.render(__dirname + '/views/members/new.ejs');
})

app.post('/members', async(req, res) => {
    const member = new Member(req.body.member);
    await member.save();
    res.redirect(`/members/${member._id}`);
})

app.get('/members/:id', async (req, res) => {
    const member = await Member.findById(req.params.id);

    res.render(__dirname + '/views/members/show.ejs', {member});
})

app.get('/members/:id/edit', async (req, res) => {
    const member = await Member.findById(req.params.id);
    res.render(__dirname + '/views/members/edit.ejs', {member});
})

app.put('/members/:id', async (req, res) => {
    const { id } = req.params;
    const member = await Member.findByIdAndUpdate(id, { ...req.body.member});
    res.redirect(`/members/${member._id}`);
})

app.delete('/members/:id', async (req, res) => {
    const { id } = req.params;
    await Member.findByIdAndDelete(id);
    res.redirect('/members');
})
// MEMBER ROUTES END

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Port Number
const PORT = process.env.PORT ||5000;

// Server Setup
app.listen(PORT,console.log(`Server started on port ${PORT}`));