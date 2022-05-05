const mongoose = require('mongoose');
const Photo = require('../models/photoModel.js');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const sharp = require('sharp');

// Init gfs
let gfs;
mongoose.connection.once('open', () => {
  // Init stream
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('avatar');
});

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

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 });
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  next();
});

exports.uploadUserPhoto = upload.single('avatar');

exports.getUserPhoto = catchAsync(async (req) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file) {
      return new AppError('No file exists', 404);
    }
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
    console.log(res);
  });
});

exports.updateUserAvatar = catchAsync(async (req, res, next) => {
  if (req.file) {
    filename = req.file.filename;
    contentType = req.file.mimetype;
    user = req.user.id;
    img = req.file.buffer;
    let updateAvatar;
    updateAvatar = await Photo.findOneAndUpdate(
      { user: req.user.id },
      { filename, contentType, user, img },
      {
        new: true,
      }
    );
    if (!updateAvatar) {
      updateAvatar = await Photo.create({ filename, contentType, user, img });
    }

    req.body.avatar = updateAvatar.id;
  }

  next();
});
