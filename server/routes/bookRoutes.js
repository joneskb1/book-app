const express = require('express');
const bookController = require('../controllers/bookController');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/findbook/:searchBy/:term').get(bookController.findBook);

router.route('/').get(bookController.getAllBooks);

router
  .route('/:id')
  .get(bookController.getBook)
  //createBook uses GoogleId others just use the bookID from mongo
  .post(userController.protect, bookController.createBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
