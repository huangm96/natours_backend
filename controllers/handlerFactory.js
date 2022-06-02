const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures.js');
const TourPhoto = require('../models/tourPhotoModel.js');
const UserPhoto = require('../models/userPhotoModel.js');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }
    // Delete images if we need to delete Tour
    if (doc.images || doc.imageCover) {
      if (doc.imageCover) {
        await TourPhoto.findByIdAndDelete(doc.imageCover.id);
      }
      if (doc.images) {
        Promise.all(
          doc.images.map(async (image) => {
            await TourPhoto.findByIdAndDelete(image.id);
          })
        );
      }
    } // Delete avatar if we need to delete User
    if (doc.avatar) {
      await UserPhoto.findByIdAndDelete(doc.avatar.id);
    }
    res.status(204).send({
      status: 'Success',
      data: {},
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) {
      return next(new AppError('No document found with that id', 404));
    }
    res.status(200).send({
      status: 'Success',
      data: {
        updatedDoc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).send({
      status: 'Success',
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model, popOptions, fieldOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id, fieldOptions);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'Success',
      requestTime: req.requestTime,
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filterOptions = {};
    if (req.filterOptions) {
      filterOptions = req.filterOptions;
    }

    // if (req.params.tourId) {
    //   filter = { tour: req.params.tourId };
    // }

    // execute query
    const features = new APIFeatures(Model.find(filterOptions), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const doc = await features.query;
    // query.sort().select().skip().limit()
    res.status(200).json({
      status: 'Success',
      results: doc.length,
      data: doc,
    });
  });
