const User = require('./../models/userModel.js');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures.js');
const AppError = require('./../utils/appError');
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  //   send response
  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getUserById = (req, res) => {
  res.status(500).json({ status: 'Err', message: 'Not yet defined' });
};
exports.createUser = (req, res) => {
  res.status(500).json({ status: 'Err', message: 'Not yet defined' });
};
exports.updateUser = (req, res) => {
  res.status(500).json({ status: 'Err', message: 'Not yet defined' });
};
exports.removeUserById = (req, res) => {
  res.status(500).json({ status: 'Err', message: 'Not yet defined' });
};
