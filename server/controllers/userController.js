const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { sendMail } = require('../utils/email');
const crypto = require('crypto');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };

  if (req.secure) {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      data: users,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Error('Must provide email and password'));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new Error('Email or password is incorrect'));
  }

  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) return next(new Error('user id not found, can not get user'));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getUserBooks = catchAsync(async (req, res, next) => {
  const { filterBy, sort } = req.query;

  const user = await User.findById(req.user.id);
  if (!user) return next(new Error('user not found, can not get users books'));

  let books = user.books;

  if (filterBy === 'read') {
    books = books.filter((el) => el.hasRead === true);
  } else if (filterBy === 'unread') {
    books = books.filter((el) => el.hasRead === false);
  }

  if (sort === 'title') {
    books = books.sort((a, b) => {
      if (a._id.title < b._id.title) {
        return -1;
      }
      if (a._id.title > b._id.title) {
        return 1;
      }
      return 0;
    });
  } else if (sort === 'author') {
    books = books.sort((a, b) => {
      const authorNameA = a._id.authors[0].split(' ');
      const lastA = authorNameA[authorNameA.length - 1];

      const authorNameB = b._id.authors[0].split(' ');
      const lastB = authorNameB[authorNameB.length - 1];

      if (lastA < lastB) {
        return -1;
      }
      if (lastA > lastB) {
        return 1;
      }
      return 0;
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      books,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(new Error('user id not found, can not update user'));

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);

  if (!user) return next(new Error('user id not found, can not delete user'));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // if token is not in cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new Error('no token'));
  }

  // extract payload from jwt
  const jwtPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(jwtPayload.id);
  if (!user) {
    return next(new Error('user not found with that token'));
  }

  //check if user changed password after token was issued
  if (user.changedPasswordAfter(jwtPayload.iat)) {
    return next(new Error('user recently changed password'));
  }

  // add user to req for other functions to use
  req.user = user;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // verify the token.
      const decodedPayload = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // check if the user still exists
      const currentUser = await User.findById(decodedPayload.id);

      if (!currentUser) {
        return next(new Error('no user'));
      }

      // make sure pw wasn't changed after token was issued.
      if (currentUser.changedPasswordAfter(decodedPayload.iat)) {
        return next(new Error('password recently changed. log in again.'));
      }

      // if it makes it here, there is a logged in user
      res.status(200).json({
        status: 'success',
        message: 'user is logged in',
        currentUser,
      });
    } catch (err) {
      // console.log(err);
      return next(new Error('unable to verify token'));
    }
  }
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new Error('user not found'));
  }

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new Error('wrong password'));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  createSendToken(user, 200, req, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new Error('no user found with provided email'));
  }

  const resetPasswordToken = user.createPasswordResetToken();

  // saving hashed token to DB from createPasswordResetToken()
  await user.save({ validateBeforeSave: false });

  // send email with non hashed reset token
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetPasswordToken}`;

  await sendMail(user.email, resetUrl);

  res.status(200).json({
    status: 'success',
    message: 'token sent to email',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  // set new password if token isn't expired & user exists
  if (!user) {
    return next(new Error('token invalid or expired'));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;

  await user.save();

  // update changedpasswordat prop in model middleware

  createSendToken(user, 200, req, res);
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { books: { _id: bookId } },
    },
    { new: true }
  );

  if (!user) {
    return next(new Error('unable to delete book'));
  }

  res.status(204).json({
    status: 'success',
  });
});

exports.markRead = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;

  const user = await User.findOneAndUpdate(
    { _id: req.user.id, 'books._id': bookId },
    {
      $set: {
        'books.$.hasRead': true,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

exports.markUnread = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;

  const user = await User.findOneAndUpdate(
    { _id: req.user.id, 'books._id': bookId },
    {
      $set: {
        'books.$.hasRead': false,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});
