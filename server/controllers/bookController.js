const Book = require('../models/bookModel');
const fetch = require('node-fetch');
const User = require('../models/userModel');
const sanitizeHtml = require('sanitize-html');
const AppError = require('../utils/appError');

const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const books = await Book.find(req.query).sort({ title: 1 });

  res.status(200).json({
    status: 'success',
    data: {
      data: books,
    },
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) return next(new AppError('The book was not found', 404));

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

  if (!book) return next(new AppError('The book was not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      data: book,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) return next(new AppError('The book was not found', 404));

  res.status(204).json({
    status: 'success',
    data: 'deleted successfully',
  });
});

exports.findBook = catchAsync(async (req, res, next) => {
  let { searchBy, term } = req.params;

  const url = `https://www.googleapis.com/books/v1/volumes?q=${searchBy}:${term}&langRestrict=en&startIndex=0&maxResults=40&key=AIzaSyAxAcySjBTXODsfv8ID_lR9ZvS8r7G0wPs`;

  const response = await fetch(url);

  const data = await response.json();

  if (!data) {
    return next(new AppError('The book was not found', 404));
  }
  //grab all the user's google book Ids
  const user = await User.findById(req.user.id);

  const userBookData = {};

  user.books.map((book) => {
    id = book._id.googleBooksId;

    if (!userBookData[id]) {
      userBookData[id] = book.hasRead;
    }
  });

  const books = data.items.map((el) => {
    const info = el.volumeInfo;

    let hasRead = 'N/A';
    let inUsersBooks = false;

    if (userBookData.hasOwnProperty(el.id)) {
      inUsersBooks = true;
      hasRead = userBookData[el.id];
    }

    const sanitizedDescription = info.description
      ? sanitizeHtml(info.description, {
          allowedAttributes: {},
          allowedTags: [],
        })
      : 'N/A';
    return {
      title: info.title ?? 'N/A',

      authors: info.authors ? info.authors : 'N/A',

      isbn: info.industryIdentifiers
        ? info.industryIdentifiers[0].identifier
        : 'N/A',
      publishedDate: info.publishedDate ?? 'N/A',
      categories: info.categories ? info.categories : 'N/A',

      pageCount: info.pageCount ?? 'N/A',
      googleBooksId: el.id ?? 'N/A',
      avgGoogleBooksRating: info.averageRating ?? 0,
      googleBooksRatingsCount: info.ratingsCount ?? 0,
      description: sanitizedDescription,
      publisher: info.publisher ?? 'N/A',
      imageLinks: {
        smallThumbnail: info.imageLinks?.smallThumbnail ?? 'N/A',
        thumbnail: info.imageLinks?.thumbnail ?? 'N/A',
      },
      inUsersBooks,
      hasRead,
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
  let user;
  let newBook;
  const googleBooksId = req.params.id;

  // is book in book nook db
  const book = await Book.findOne({ googleBooksId });

  // create a book if it doesn't exist
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
        : 0,
      pageCount: info.pageCount ?? 0,
      avgGoogleBooksRating: info.averageRating ?? 0,
      googleBooksRatingsCount: info.ratingsCount ?? 0,
      publishedDate: info.publishedDate ?? 'N/A',
      authors: info.authors ?? 'N/A',
      categories: info.categories ?? 'N/A',
      description: sanitizedDescription,
      publisher: info.publisher ?? 'N/A',
      imageLinks: {
        smallThumbnail: info.imageLinks?.smallThumbnail ?? 'N/A',
        thumbnail: info.imageLinks?.thumbnail ?? 'N/A',
      },
      googleBooksId: data.id ?? 'N/A',
    };

    newBook = await Book.create(bookDetails);
  }

  if (book) {
    userHasBoook = await User.find({
      _id: req.user.id,
      books: { $elemMatch: { _id: book._id } },
    });

    if (userHasBoook.length !== 0) {
      return next(new AppError('This book is already in your book list', 400));
    }
  }

  // update the user with the book
  const update = {
    $push: {
      books: {
        _id: newBook ? newBook.id : book.id,
        hasRead: false,
      },
    },
  };

  user = await User.findByIdAndUpdate(req.user.id, update, { new: true });

  const newBookAdded = user.books[user.books.length - 1];

  res.status(201).json({
    status: 'success',
    data: {
      data: newBook ? newBook : book,
      user,
      newBookAdded,
    },
  });
});
