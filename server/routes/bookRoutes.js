const express = require("express");
const bookController = require("../controllers/bookController");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/findbook/:searchBy/:search").get(bookController.findBook);

router
  .route("/")
  .get(bookController.getAllBooks)
  // old
  .post(bookController.createCustomBook);

router
  .route("/:id")
  .get(bookController.getBook)
  .post(userController.protect, bookController.createBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
