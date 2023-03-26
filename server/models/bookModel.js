const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "a book must have a title"],
  },
  isbn: {
    type: Number,
    unique: true,
  },
  author: {
    type: String,
    required: [true, "a book must have an author"],
  },
  genre: {
    type: String,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
