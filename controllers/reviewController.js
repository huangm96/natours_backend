const Review = require('./../models/reviewModel');
const Tour = require('./../models/tourModel.js');
const User = require('./../models/userModel.js');
// const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.TourFilter = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError('Need tour Id to find the reviews', 404));
  }
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that id', 404));
  }

  req.filter = { tour: req.params.id };
  next();
};

exports.setTourUserIds = async (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.id;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  const tour = await Tour.findById(req.body.tour);
  if (!tour) {
    return next(new AppError('No tour found with that id', 404));
  }
  const user = await User.findById(req.body.user);
  if (!user) {
    return next(new AppError('No user found with that id', 404));
  }
  next();
};

exports.getReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReviewById = factory.getOne(Review);
