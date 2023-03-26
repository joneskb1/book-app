const User = require("../models/userModel");

const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: {
      data: users,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: newUser,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new Error("user id not found, can not get user"));

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(new Error("user id not found, can not update user"));

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return next(new Error("user id not found, can not delete user"));

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.addBook = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new Error("user id not found, can not update user"));

  if (req.body.bookId) {
    // if not creating a book
    user.booksToRead.push(req.body.bookId);
  } else {
    // creating a book
    user.booksToRead.push(req.body.book._id);
  }

  await user.save({ validateBeforeSave: false });

  // query again to get the book lists to populate
  const updatedUser = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      data: updatedUser,
    },
  });
});

exports.markRead = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new Error("user id not found, can not update user"));
  if (!req.body.bookId) return next(new Error("must have book ID"));

  //remove book from booksToRead array and add it to readBooks array
  user.booksToRead.remove(req.body.bookId);
  user.readBooks.push(req.body.bookId);

  await user.save({ validateBeforeSave: false });

  // query again to get the book lists to populate
  const updatedUser = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      data: updatedUser,
    },
  });
});

exports.markUnread = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new Error("user id not found, can not update user"));
  if (!req.body.bookId) return next(new Error("must have book ID"));

  //remove book from booksToRead array and add it to readBooks array
  user.readBooks.remove(req.body.bookId);
  user.booksToRead.push(req.body.bookId);

  await user.save({ validateBeforeSave: false });

  // query again to get the book lists to populate
  const updatedUser = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      data: updatedUser,
    },
  });
});
