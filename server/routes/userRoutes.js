const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', userController.createUser);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.post('/forgotpassword', userController.forgotPassword);
router.post('/resetpassword/:token', userController.resetPassword);
router.get('/check-login', userController.isLoggedIn);

router.use(userController.protect);

router.route('/updatePassword').patch(userController.updatePassword);

// router.route('/').get(userController.getAllUsers);

router
  .route('/')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route('/books').get(userController.getUserBooks);

// google ID
router.route('/delete/:id').delete(userController.deleteBook);
router.route('/toggle-read/:id').patch(userController.toggleRead);

module.exports = router;
