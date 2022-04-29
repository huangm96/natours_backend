const mongoose = require('mongoose');
const AppError = require('./appError');

exports.checkID = async (req, res, next, val) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError('Id is not valid', 404));
  }
  next();
};
