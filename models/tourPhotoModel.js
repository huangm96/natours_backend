const mongoose = require('mongoose');

const tourPhotoSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, "filename can't be empty"],
      unique: true,
    },
    createdAt: { type: Date, default: Date.now },
    img: {
      type: Buffer,
      required: [true, "img can't be empty"],
    },
    contentType: String,
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
  },
  { toJSON: { virtuals: true }, toObjects: { virtuals: true } }
);

const TourPhoto = mongoose.model('TourPhoto', tourPhotoSchema);

module.exports = TourPhoto;
