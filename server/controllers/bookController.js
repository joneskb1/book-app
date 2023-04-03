const Book = require('../models/bookModel');
const fetch = require('node-fetch');
const User = require('../models/userModel');
const sanitizeHtml = require('sanitize-html');

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

exports.createCustomBook = catchAsync(async (req, res, next) => {
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
      title: info.title ?? 'N/A',
      author: info.authors ? info.authors[0] : 'N/A',
      isbn: info.industryIdentifiers
        ? info.industryIdentifiers[0].identifier
        : 'N/A',
      publishedDate: info.publishedDate ?? 'N/A',
      category: info.categories ? info.categories[0] : 'N/A',
      pageCount: info.pageCount ?? 'N/A',
      googleBookId: el.id ?? 'N/A',
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: books,
    },
  });
});

exports.createBook = catchAsync(async (req, res, next) => {
  const googleBooksId = req.params.id;

  // use googleID to verify we do not have the book already in our DB
  // if book not in our DB, fetch data from google api
  const book = await Book.findOne({ googleBooksId });
  let newBook;

  if (!book) {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${googleBooksId}`
    );

    const data = await response.json();
    const info = data.volumeInfo;

    const sanitizedDescription = info.description
      ? sanitizeHtml(info.description, {
          allowedAttributes: {},
          allowedTags: [],
        })
      : 'N/A';

    const bookDetails = {
      title: info.title ?? 'N/A',
      isbn: info.industryIdentifiers
        ? info.industryIdentifiers[0].identifier
        : 'N/A',
      pageCount: info.pageCount ?? 'N/A',
      avgGoogleBooksRating: info.averageRating ?? 'N/A',
      googleBooksRatingsCount: info.ratingsCount ?? 'N/A',
      publishedDate: info.publishedDate ?? 'N/A',
      authors: info.authors ?? 'N/A',
      categories: info.categories ?? 'N/A',
      description: sanitizedDescription,
      publisher: info.publisher ?? 'N/A',
      imageLinks: {
        smallThumbnail: info.imageLinks.smallThumbnail ?? 'N/A',
        thumbnail: info.imageLinks.thumbnail ?? 'N/A',
      },
      googleBooksID: data.id ?? 'N/A',
    };

    newBook = await Book.create(bookDetails);
  }

  const update = {
    books: {
      _id: newBook.id,
      hasRead: false,
    },
  };

  const user = await User.findByIdAndUpdate(req.user.id, update);

  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    data: {
      data: newBook,
    },
  });
});
