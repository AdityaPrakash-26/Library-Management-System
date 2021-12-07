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
const Transaction = require('./models/transaction');

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
    // store the transaction
    const transaction = new Transaction({
        type: 'add',
        book: book._id,
        message: `${book.title} was added to the library`
    });
    await transaction.save();
    res.redirect(`/books/${book._id}`);
})

app.get('/books/new', (req, res) => {
    res.render(__dirname + '/views/books/new.ejs');
})

app.get('/books/import', (req, res) => {
    // show the import page
    res.render(__dirname + '/views/books/import.ejs');
})

app.post('/books/import', async (req, res) => {
    // get the variables from the form
    var title = req.body.book.title;
    var authors = req.body.book.authors;
    var isbn = req.body.book.isbn;
    var publisher = req.body.book.publisher;
    var page = req.body.book.page;
    var numberOfBooks = req.body.book.numberOfBooks;

    if(!numberOfBooks) {
        numberOfBooks = 20;
    }

    // store the transaction
    const transaction = new Transaction({
        type: 'import',
        message: `Books were imported using Frappe's API.`
    });
    await transaction.save();

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
            // get the books from the response
            const books = data.message;
            // loop through the books
            books.forEach(async book => {
                // create a new book
                if(numberOfBooks > 0) {
                    numberOfBooks--;
                    const newBook = new Book(book);
                    // save the book
                    await newBook.save();
                } else {
                    return;
                }
            })
            res.redirect(/books/);
        })
        .catch(err => {
            console.log(err);
            res.redirect('/books/import');
        })
})

app.get('/books/delete', async(req, res) => {
    // delete all books
    await Book.deleteMany({});
    // remove books from all members
    await Member.updateMany({}, {$pull: {books: {}}});
    // store the transaction
    const transaction = new Transaction({
        type: 'delete',
        message: `All books were deleted`
    });
    await transaction.save();
    res.redirect('/books');
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
    // store the transaction
    const transaction = new Transaction({
        type: 'edit',
        book: book._id,
        message: `${book.title} was edited`
    });
    await transaction.save();
    res.redirect(`/books/${book._id}`);
})

app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    // remove the book from all members
    await Member.updateMany({}, {$pull: {books: {_id: id}}});
    await Book.findByIdAndDelete(id);
    // store the transaction
    const transaction = new Transaction({
        type: 'delete',
        book: id,
        message: `A book was deleted`
    });
    await transaction.save();
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
    // store the transaction
    const transaction = new Transaction({
        type: 'add',
        member: member._id,
        message: `${member.name} was added to the library`
    });
    await transaction.save();
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
    member.total_amount_paid += member.debt;
    member.debt = 0;
    await member.save();
    // store the transaction
    const transaction = new Transaction({
        type: 'clear',
        member: member._id,
        message: `${member.name}'s debt was cleared`
    });
    await transaction.save();
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
        book.quantity_in_library -= 1;
        book.times_borrowed += 1;
        await book.save();
    }
    // save the member
    await member.save();
    // store the transaction
    const transaction = new Transaction({
        type: 'issue',
        member: member._id,
        message: `${member.name} issued ${books.length} book(s): `
    });
    // loop through the books
    for (let i = 0; i < books.length; i++) {
        // find book by id
        const book = await Book.findById(books[i]);
        // add the book to the transaction message
        if(i != books.length - 1) {
            transaction.message += `${book.title}, `;
        } else {
            transaction.message += `${book.title}.`;
        }
    }
    await transaction.save();
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
        book.quantity_in_library += 1;
        await book.save();
        member.debt += book.rent;
    }
    // save the member
    await member.save();
    // store the transaction
    const transaction = new Transaction({
        type: 'return',
        member: member._id,
        message: `${member.name} returned ${books.length} books: `
    });
    for (let i = 0; i < books.length; i++) {
        // find book by id
        const book = await Book.findById(books[i]);
        // add the book to the transaction message
        if(i != books.length - 1) {
            transaction.message += `${book.title}, `;
        } else {
            transaction.message += `${book.title}.`;
        }
    }
    await transaction.save();
    // redirect to the member's show page
    res.redirect(`/members/${member._id}`);
})

app.put('/members/:id', async (req, res) => {
    const { id } = req.params;
    const member = await Member.findByIdAndUpdate(id, { ...req.body.member});
    // store the transaction
    const transaction = new Transaction({
        type: 'edit',
        member: member._id,
        message: `${member.name} was edited`
    });
    await transaction.save();
    res.redirect(`/members/${member._id}`);
})

app.delete('/members/:id', async (req, res) => {
    const { id } = req.params;
    // get the member
    const member = await Member.findById(id);
    // loop through the member's books
    for (let i = 0; i < member.books.length; i++) {
        // get the book
        const book = await Book.findById(member.books[i]);
        // add the book back to the library
        book.quantity_in_library += 1;
        await book.save();
    }
    // store the transaction
    const transaction = new Transaction({
        type: 'delete',
        member: member._id,
        message: `${member.name} was deleted. His/her books were returned: ${member.books.join(', ')}`
    });
    await transaction.save();
    await Member.findByIdAndDelete(id);
    // store the transaction
    res.redirect('/members');
})
// MEMBER ROUTES END

// TRANSACTION ROUTES BEGIN

app.get('/transactions', async (req, res) => {
    const transactions = await Transaction.find({});
    res.render(__dirname + '/views/transactions/transactions.ejs', {transactions});
})

app.get('/transactions/delete', async(req, res) => {
    // delete all transactions
    await Transaction.deleteMany({});
    res.redirect('/transactions');
})

// TRANSACTION ROUTES END

// REPORT ROUTES BEGIN

app.get('/reports', async (req, res) => {
    const books = await Book.find({});
    res.render(__dirname + '/views/reports/reports.ejs', {books});
})

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

// AXIOS ROUTES END

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Port Number
const PORT = process.env.PORT ||5000;

// Server Setup
app.listen(PORT,console.log(`Server started on port ${PORT}`));