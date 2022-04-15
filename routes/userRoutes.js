const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');

const router = express.Router();

const { signup, login } = authController;

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  removeUserById,
} = userController;

router.post('/signup', signup);
router.post('/login', login);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', removeUserById);

module.exports = router;
