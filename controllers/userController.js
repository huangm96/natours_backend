const User = require('./../models/userModel.js');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures.js');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  // 2. Filtered out unwanted fields names that are not allowed to be updated.
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3.update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    updatedUser,
  });
});
