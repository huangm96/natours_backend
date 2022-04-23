const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');

const router = express.Router();

const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updateMyPassword,
} = authController;

const { getAllUsers, getUserById, updateMe, deleteMe } = userController;

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updateMyPassword);

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.get('/', protect, getAllUsers);
router.get('/:id', getUserById);

module.exports = router;
