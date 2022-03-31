const express = require('express');

const router = express.Router();

const getAllUsers = (req, res) => {
  res.status(500).json({ status: 'Err', message: 'Not yet defined' });
};
const getUserById = (req, res) => {
  res.status(500).json({ status: 'Err', message: 'Not yet defined' });
};
const createUser = (req, res) => {
  res.status(500).json({ status: 'Err', message: 'Not yet defined' });
};
const updateUser = (req, res) => {
  res.status(500).json({ status: 'Err', message: 'Not yet defined' });
};
const removeUserById = (req, res) => {
  res.status(500).json({ status: 'Err', message: 'Not yet defined' });
};

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', removeUserById);

module.exports = router;
