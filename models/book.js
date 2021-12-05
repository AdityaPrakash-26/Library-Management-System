const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    bookID: Number,
    title: String,
    authors: String,
    average_rating: Number,
    isbn: Number,
    isbn13: Number,
    language_code: String,
    num_pages: Number,
    ratings_count: Number,
    text_reviews_count: Number,
    publication_date: String,
    publisher: String
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;