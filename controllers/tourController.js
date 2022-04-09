const Tour = require('./../models/tourModel.js');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures.js');
exports.checkID = (req, res, next, val) => {
  //   const id = req.params.id * 1;
  //   const tour = tours.find((el) => el.id === id);
  //   if (!tour) {
  //     return res.status(404).json({
  //       status: 'Fail',
  //       message: 'Invalid id',
  //     });
  //   }
  //   req.tour = tour;
  next();
};
exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = 5;

  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  // execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const tours = await features.query;

  //   send response
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
exports.getTourById = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
});
exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).send({
    status: 'Success',
    data: {
      newTour,
    },
  });
});
exports.updateTourById = catchAsync(async (req, res) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).send({
    status: 'Success',
    data: {
      updatedTour,
    },
  });
});
exports.removeTourById = catchAsync(async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).send({
    status: 'Success',
    data: {},
  });
});

exports.getTourStats = catchAsync(async (req, res) => {
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

exports.getMonthlyPlan = catchAsync(async (req, res) => {
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
