const Book = require('../models/bookModel');
const fetch = require('node-fetch');
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const books = await Book.find(req.query);

  res.status(200).json({
    status: 'success',
    data: {
      data: books,
    },
  });
});

exports.createBook = catchAsync(async (req, res, next) => {
  // get title or isbn from user & create middleware to verify we do not have the book already in our DB
  // if book not in our DB, fetch data from google api
  const book = await Book.create(req.body);

  if (req.params.id) {
    req.body.book = book;
    return next();
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: book,
    },
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) return next(new Error('book id not found, can not get book'));

  res.status(200).json({
    status: 'success',
    data: {
      data: book,
    },
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!book) return next(new Error('book id not found, can not update book'));

  res.status(200).json({
    status: 'success',
    data: {
      data: book,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) return next(new Error('book id not found, can not delete book'));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.findBook = catchAsync(async (req, res, next) => {
  let { searchBy, search } = req.params;

  if (searchBy === 'title') {
    searchBy = 'intitle';
  } else if (searchBy === 'author') {
    searchBy = 'inauthor';
  } else if (searchBy === 'isbn') {
    searchBy = 'isbn';
  }

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${searchBy}:${search}&langRestrict=en&startIndex=0&maxResults=30&key=AIzaSyAxAcySjBTXODsfv8ID_lR9ZvS8r7G0wPs`
  );

  const data = await response.json();

  const books = data.items.map((el) => {
    const info = el.volumeInfo;

    return {
      title: info.title ? info.title : 'N/A',
      author: info.authors ? info.authors[0] : 'N/A',
      isbn13: info.industryIdentifiers
        ? info.industryIdentifiers[0].identifier
        : 'N/A',
      publishedDate: info.publishedDate ? info.publishedDate : 'N/A',
      category: info.categories ? info.categories[0] : 'N/A',
      pageCount: info.pageCount ? info.pageCount : 'N/A',
      googleBookId: el.id ? el.id : 'N/A',
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: books,
    },
  });
});
