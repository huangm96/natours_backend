const TourPhoto = require('../models/tourPhotoModel.js');
const Tour = require('../models/tourModel.js');
const factory = require('./handlerFactory');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');

const sharp = require('sharp');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  // if image, pass true, else, pass false
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 404), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  // 1.Cover image
  if (req.files.imageCover) {
    const imageCoverFilename = `tour-${req.params.id}-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 });
    req.files.imageCover[0].filename = imageCoverFilename;
  }
  // 2. uploadTourImages
  let tourResizedImages = [];
  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i}.jpeg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 });
        file.filename = filename;
        tourResizedImages.push(file);
      })
    );
  }
  req.files.images = tourResizedImages;
  next();
});
exports.updateTourImages = catchAsync(async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  if (req.files.imageCover) {
    filename = req.files.imageCover[0].filename;
    contentType = req.files.imageCover[0].mimetype;
    tour = req.params.id;
    img = req.files.imageCover[0].buffer;
    //   if tour already has an image cover, we need to update the image cover.
    let updateTourImageCover;
    tour = await Tour.findById(req.params.id);
    if (tour.imageCover) {
      updateTourImageCover = await TourPhoto.findOneAndUpdate(
        tour.imageCover,
        { filename, contentType, tour, img },
        {
          new: true,
        }
      );
      // else, we are going to create the image cover
    } else {
      updateTourImageCover = await TourPhoto.create({
        filename,
        contentType,
        tour,
        img,
      });
    }
    req.body.imageCover = updateTourImageCover.id;
  }
  req.body.images = [];
  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (file) => {
        filename = file.filename;
        contentType = file.mimetype;
        tour = req.params.id;
        img = file.buffer;
        newImage = await TourPhoto.create({
          filename,
          contentType,
          tour,
          img,
        });
        req.body.images.push(newImage.id);
      })
    );
  }

  next();
});

exports.deleteTourPhoto = factory.deleteOne(TourPhoto);
