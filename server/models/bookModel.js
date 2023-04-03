const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'a book must have a title'],
  },
  isbn: {
    type: Number,
    unique: true,
  },
  pageCount: {
    type: Number,
  },
  avgGoogleBooksRating: {
    type: Number,
  },
  googleBooksRatingsCount: {
    type: Number,
  },
  publishedDate: {
    type: String,
  },
  authors: {
    type: [String],
    required: [true, 'a book must have an author'],
  },
  categories: {
    type: [String],
  },
  description: {
    type: String,
  },
  publisher: {
    type: String,
  },
  imageLinks: {
    smallThumbnail: String,
    thumbnail: String,
  },
  googleBooksID: {
    type: String,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
