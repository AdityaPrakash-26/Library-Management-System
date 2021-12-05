const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: String,
    authors: String,
    average_rating: Number,
    isbn: String,
    isbn13: String,
    language_code: String,
    num_pages: Number,
    ratings_count: Number,
    text_reviews_count: Number,
    publication_date: String,
    publisher: String,
    quantity: {type: Number, default: 1}
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;