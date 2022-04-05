const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxLength: [40, 'A tour name must have less or equal than 40 characters'],
    minlength: [10, 'A tour name must have more or equal than 10 characters'],
  },
  slug: String,
  duration: { type: Number, required: [true, 'A tour must have a duration'] },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a max group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, meidum or difficult',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    // set: (val) => Math.round(val * 10) / 10, //4.666666 *10 = 46.66666, rounded to 47, 47/10 =4.7
  },
  ratingsQuantity: { type: Number, default: 0 },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    ////custom validator
    // validate: {
    //   validator: function (val) {
    //    //"this" only points to current doc on NEW document creation, so it will not work on patch
    //     return val < this.price;
    //   },
    //   message: 'Discount price ({VALUE}) should be less than regular price',
    // },
  },
  summary: { type: String, trim: true },
  description: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: { type: Date, default: Date.now(), select: false },
  startDates: [Date],
  //   secretTour: { type: Boolean, default: false },
  //   startLocation: {
  //     //GeoJSON
  //     type: {
  //       type: String,
  //       default: 'Point',
  //       enum: ['Point'],
  //     },
  //     coordinates: [Number],
  //     address: String,
  //     description: String,
  //   },
  //   locations: [
  //     {
  //       type: {
  //         type: String,
  //         default: 'Point',
  //         enum: ['Point'],
  //       },
  //       coordinates: [Number],
  //       address: String,
  //       description: String,
  //       day: Number,
  //     },
  //   ],
  //   guides: [
  //     {
  //       type: mongoose.Schema.ObjectId,
  //       ref: 'User',
  //     },
  //   ],
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
