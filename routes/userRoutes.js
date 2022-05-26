const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');
const validID = require('../utils/validID.js');
const userPhotoController = require('./../controllers/userPhotoController.js');
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
  deleteUser,
  updateUser,
  getMe,
  getMyId,
} = userController;

const {
  resizeUserPhoto,
  uploadUserPhoto,
  updateUserAvatar,
} = userPhotoController;

router.param('id', validID.checkID);

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.get('/:id', getUserById);
// protect all routes after this middleware
router.use(protect);

router.patch('/updateMyPassword', updateMyPassword);

router.get('/me', getMyId, getMe);
router.patch(
  '/updateMe',
  getMyId,
  uploadUserPhoto,
  resizeUserPhoto,
  updateUserAvatar,
  updateMe,
  updateUser
);
router.delete('/deleteMe', getMyId, deleteUser);

router.use(restricTo('admin'));

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);
// Do Not update password
router.patch('/:id', updateUser);

module.exports = router;
