const Tour = require('./../models/tourModel.js');
const catchAsync = require('./../utils/catchAsync');
// const APIFeatures = require('./../utils/apiFeatures.js');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = 5;

  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    //   {
    //     $match: { ratingsAverage: { $gte: 4.5 } },
    //   },
    {
      $group: {
        // group the document by difficulty
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).send({
    status: 'Success',
    data: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      //   split the array
      $unwind: '$startDates',
    },

    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // group them by the month
        //how many tours in each month
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } }, // _id will not show in the plan
    { $sort: { numToursStarts: -1 } },
    //   {
    //     $limit: 6,
    //   },
  ]);
  res.status(200).send({
    status: 'Success',
    data: {
      year,
      plan,
    },
  });
});

exports.getAllTours = factory.getAll(Tour);
exports.createTour = factory.createOne(Tour);
exports.updateTourById = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getTourById = factory.getOne(Tour, { path: 'reviews' });
