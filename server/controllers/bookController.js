const Book = require("../models/bookModel");

const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const books = await Book.find(req.query);

  res.status(200).json({
    status: "success",
    data: {
      data: books,
    },
  });
});

exports.createBook = catchAsync(async (req, res, next) => {
  const book = await Book.create(req.body);

  if (req.params.id) {
    req.body.book = book;
    return next();
  }

  res.status(201).json({
    status: "success",
    data: {
      data: book,
    },
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) return next(new Error("book id not found, can not get book"));

  res.status(200).json({
    status: "success",
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

  if (!book) return next(new Error("book id not found, can not update book"));

  res.status(200).json({
    status: "success",
    data: {
      data: book,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) return next(new Error("book id not found, can not delete book"));

  res.status(204).json({
    status: "success",
    data: null,
  });
});
