const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');
const validID = require('../utils/validID.js');

const router = express.Router();

const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  restricTo,
} = authController;

const {
  getAllUsers,
  getUserById,
  updateMe,
  deleteMe,
  deleteUser,
  updateUser,
} = userController;

router.param('id', validID.checkID);

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updateMyPassword);

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.get('/', protect, getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', protect, restricTo('admin'), deleteUser);
// Do Not update password
router.patch('/:id', protect, restricTo('admin'), updateUser);

module.exports = router;
