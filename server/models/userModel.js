const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name"],
    },
    email: {
      type: String,
      required: [true, "User must have an email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "User must enter a password"],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "passwords must match"],
      validate: {
        // only works on Create/SAVE not update!
        validator: function (el) {
          return this.password === el;
        },
        message: "Passwords are not the same!",
      },
    },
    booksToRead: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Book",
      },
    ],
    readBooks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre(/^find/, function (next) {
  this.populate({ path: "booksToRead readBooks", select: "-__v -_id" });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
