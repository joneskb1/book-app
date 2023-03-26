const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route("/add-book/:id").patch(userController.addBook);
router.route("/mark-read/:id").patch(userController.markRead);
router.route("/mark-unread/:id").patch(userController.markUnread);

module.exports = router;
