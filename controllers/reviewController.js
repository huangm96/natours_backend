const Review = require('./../models/reviewModel');
const Tour = require('./../models/tourModel.js');
const User = require('./../models/userModel.js');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getReviews = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError('Need tour Id to find the reviews', 404));
  }
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that id', 404));
  }

  const filter = { tour: req.params.id };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
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
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      review: newReview,
    },
  });
});
