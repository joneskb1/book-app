const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userController.createUser);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.post("/forgotpassword", userController.forgotPassword);
router.post("/resetpassword/:token", userController.resetPassword);

router.use(userController.protect);

router.route("/updatePassword").patch(userController.updatePassword);

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// book ID (not google)
router.route("/delete/:id").delete(userController.deleteBook);
router.route("/markread/:id").patch(userController.markRead);
router.route("/markunread/:id").patch(userController.markUnread);

module.exports = router;
