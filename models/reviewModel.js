const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can't be empty"],
      min: [5, 'Rating must be more than 5 characters'],
      max: [500, 'Rating must be less than 500 characters'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating can't be empty"],
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: { type: Date, default: Date.now },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  { toJSON: { virtuals: true }, toObjects: { virtuals: true } }
);

//preventing user writes  duplicate reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name avatar',
  });
  next();
});
reviewSchema.pre('save', function (next) {
  this.populate({
    path: 'user',
    select: 'name avatar',
  });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  //"this" points to the Model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  //   console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post('save', function (doc) {
  // "this.constructor or doc.constructor points to the Model"
  // Review.calcAverageRatings
  // "this" points to current review
  //   console.log(doc);
  doc.constructor.calcAverageRatings(this.tour);
});

// findOneAndUpdate and findOneAndDelete
reviewSchema.post(/^findOneAnd/, async function (doc) {
  //console.log(doc);
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
