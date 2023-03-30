const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  // sub 1 sec so token is always created after password is changed
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (candidatepw, userpw) {
  return await bcrypt.compare(candidatepw, userpw);
};

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  //password was changed
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimeStamp < changedTimeStamp;
  }

  //password not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // create token
  const resetPasswordToken = crypto.randomBytes(32).toString("hex");

  // encrypting token for DB
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  // set expiration
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetPasswordToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
