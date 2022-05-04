const mongoose = require('mongoose');
const Avatar = require('./../models/avatarModel.js');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

// const sharp = require('sharp');

// Init gfs
let gfs;
mongoose.connection.once('open', () => {
  // Init stream
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('avatar');
});
// const DB = process.env.DATABASE.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD
// );
// const storage = new GridFsStorage({
//   url: DB,
//   options: { useNewUrlParser: true, useUnifiedTopology: true },

//   file: (req, file) => {
//     const ext = file.mimetype.split('/')[1];
//     return {
//       bucketName: 'avatar',
//       filename: `user-${req.user._id}-${Date.now()}.${ext}`,
//     };
//   },
// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  // if image, pass true, else, pass false
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 404), false);
  }
  const ext = file.mimetype.split('/')[1];
  file.filename = `user-${req.user._id}-${Date.now()}.${ext}`;
};
const upload = multer({
  //   storage: storage,
  storage: multerStorage,
  fileFilter: multerFilter,
});

// exports.resizeUploadPhoto = (req, res, next) => {
//   if (!req.file) return next();
//   sharp(req.file).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 });
// };

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
    updateAvatar = await Avatar.findOneAndUpdate(
      { user: req.user.id },
      { filename, contentType, user, img },
      {
        new: true,
      }
    );
    if (!updateAvatar) {
      updateAvatar = await Avatar.create({ filename, contentType, user, img });
    }

    req.body.avatar = updateAvatar.id;
  }

  next();
});
