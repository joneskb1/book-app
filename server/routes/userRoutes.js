const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userController.createUser);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.post("/forgotpassword", userController.forgotPassword);
router.post("/resetpassword/:token", userController.resetPassword);

router
  .route("/updatePassword")
  .patch(userController.protect, userController.updatePassword);

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route("/add-book/:id").patch(userController.addBook);
router.route("/mark-read/:id").patch(userController.markRead);
router.route("/mark-unread/:id").patch(userController.markUnread);

module.exports = router;
