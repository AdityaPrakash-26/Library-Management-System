// Requiring module
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');
const https = require('https');
const ExpressError = require('./utils/ExpressError');
var requestify = require('requestify');

requestify.get('https://frappe.io/api/method/frappe-library')
    .then(function(response) {
        // Get the response body (JSON parsed or jQuery object for XMLs)
        response.getBody();
    }
);


const Book = require('./models/book');
const Member = require('./models/member');

mongoose.connect('mongodb://localhost:27017/library', { useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Creating express object
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Handling GET request
app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs');
})

app.get('/member_list', (req, res) => {
    res.render(__dirname + '/views/member_list.ejs');
})

app.get('/book_list', (req, res) => {
    res.render(__dirname + '/views/book_list.ejs');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Port Number
const PORT = process.env.PORT ||5000;

// Server Setup
app.listen(PORT,console.log(`Server started on port ${PORT}`));