const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');

const router = express.Router();

const {
  signup,
  login,
  protect,
  restricTo,
  forgotPassword,
  resetPassword,
} = authController;

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  removeUserById,
} = userController;

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.get('/', protect, getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', removeUserById);

module.exports = router;
