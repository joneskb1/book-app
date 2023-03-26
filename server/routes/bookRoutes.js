const express = require("express");
const bookController = require("../controllers/bookController");
const userController = require("../controllers/userController");

const router = express.Router();

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(bookController.createBook);

router
  .route("/:id")
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

router
  .route("/create-add/:id")
  .post(bookController.createBook, userController.addBook);

module.exports = router;
