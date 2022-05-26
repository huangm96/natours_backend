const Tour = require('./../models/tourModel.js');
const catchAsync = require('./../utils/catchAsync');
// const APIFeatures = require('./../utils/apiFeatures.js');
const AppError = require('./../utils/appError');
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

//'/tours-within/:distance/center/:latlng/unit/:unit'
//'/tours-within/250/center/-40,45/unit/mi'
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // divide our distance by the radius of the earth.
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400
      )
    );
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: { tours },
  });
});

///distances/:latlng/unit/:unit
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400
      )
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      //project: the fields that we want to keep
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    results: distances.length,
    data: { distances },
  });
});

exports.getAllTours = factory.getAll(Tour);
exports.createTour = factory.createOne(Tour);
exports.updateTourById = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getTourById = factory.getOne(Tour, { path: 'reviews' });
