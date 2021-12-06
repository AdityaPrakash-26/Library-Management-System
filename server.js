// Requiring module
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const axios = require('axios');
const bodyParser = require('body-parser');
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
// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 

// HANDLING GET REQUESTS
// INDEX ROUTE
app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs');
})

app.get('/api/method/frappe-library', (req, res) => {
    res.send(req);
})

// BOOK ROUTES BEGIN
app.get('/books', async (req, res) => {
    const books = await Book.find({});
    res.render(__dirname + '/views/books/books.ejs', {books});
})

app.post('/books', async(req, res) => {
    const book = new Book(req.body.book);
    await book.save();
    res.redirect(`/books/${book._id}`);
})

app.get('/books/new', (req, res) => {
    res.render(__dirname + '/views/books/new.ejs');
})

app.get('/books/import', (req, res) => {
    // show the import page
    res.render(__dirname + '/views/books/import.ejs');
})

app.post('/books/import', (req, res) => {
    // get the variables from the form
    var title = req.body.book.title;
    var authors = req.body.book.authors;
    var isbn = req.body.book.isbn;
    var publisher = req.body.book.publisher;
    var page = req.body.book.page;

    console.log(title);

    // loop through the above variables, and replace spaces by %20
    // if(title) {
    //     title = title.replace(/ /g, '%20');
    // }

    // console.log(title);

    // if(authors) {
    //     authors = authors.replace(/ /g, '%20');
    // }
    // if(isbn) {
    //     isbn = isbn.replace(/ /g, '%20');
    // }
    // if(publisher) {
    //     publisher = publisher.replace(/ /g, '%20');
    // }
    // if(page) {
    //     page = page.replace(/ /g, '%20');
    // }

    makeGetRequest(title, authors, isbn, publisher, page)
        .then(response => {
            // get the response from the frappe server
            const { data } = response;
            console.log(response);
            // get the books from the response
            const books = data.message;
            // loop through the books
            books.forEach(async book => {
                // create a new book
                const newBook = new Book(book);
                // save the book
                await newBook.save();
                // log the book
                console.log(newBook.title);
            })
            res.redirect(/books/);
        })
        .catch(err => {
            console.log(err);
            res.redirect('/books/import');
        })
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

app.get('/members/:id/issue', async (req, res) => {
    const member = await Member.findById(req.params.id);
    const books = await Book.find({});
    res.render(__dirname + '/views/members/issue.ejs', {member, books});
})

app.get('/members/:id/return', async (req, res) => {
    const member = await Member.findById(req.params.id);
    const books = await Book.find({});
    res.render(__dirname + '/views/members/return.ejs', {member, books});
})

app.get('/members/:id/clear', async (req, res) => {
    // set member's debt to 0
    const member = await Member.findById(req.params.id);
    member.debt = 0;
    await member.save();
    res.redirect(`/members/${member._id}`);
})

app.put('/members/:id/issue', async (req, res) => {
    // get the list of chosen books
    const books = req.body.books;
    // get the member
    const member = await Member.findById(req.params.id);
    // loop through the books
    for (let i = 0; i < books.length; i++) {
        // get the book
        const book = await Book.findById(books[i]);
        // add the book to the member
        member.books.push(book);
        // subtract the book from the library
        book.quantity -= 1;
        await book.save();
    }
    // save the member
    await member.save();
    // redirect to the member's show page
    res.redirect(`/members/${member._id}`);
})

app.put('/members/:id/return', async (req, res) => {
    // get the list of chosen books
    const books = req.body.books;
    // get the member
    const member = await Member.findById(req.params.id);
    // loop through the books
    for (let i = 0; i < books.length; i++) {
        // get the book
        const book = await Book.findById(books[i]);
        // remove the book from the member
        member.books.pull(book);
        // add the book back to the library
        book.quantity += 1;
        await book.save();
        member.debt += book.rent;
    }
    // save the member
    await member.save();
    // redirect to the member's show page
    res.redirect(`/members/${member._id}`);
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

// AXIOS ROUTES BEGIN

async function makeGetRequest(title, authors, isbn, publisher, page) {
    // if the parameters are not defined, make the default request
    if (!title && !authors && !isbn && !publisher && !page) {
        return axios.get('https://frappe.io/api/method/frappe-library')
    }
    // use only defined parameters
    const params = {};
    if (title) {
        params.title = title;
    }
    if (authors) {
        params.authors = authors;
    }
    if (isbn) {
        params.isbn = isbn;
    }
    if (publisher) {
        params.publisher = publisher;
    }
    if (page) {
        params.page = page;
    }
    return axios.get('https://frappe.io/api/method/frappe-library', {params});
}

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Port Number
const PORT = process.env.PORT ||5000;

// Server Setup
app.listen(PORT,console.log(`Server started on port ${PORT}`));