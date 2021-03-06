const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, default: Date.now },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tour.'],
    },
    tourStartDate: {
      type: Date,
      required: [true, 'Booking must have a start date.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user.'],
    },
    price: {
      type: Number,
      min: [0, 'price must be above 0'],
      required: [true, 'Booking must have a price.'],
    },
    sessionId: {
      type: String,
    },
    quantity: {
      type: Number,
      required: [true, 'Booking must have a quantity.'],
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, toObjects: { virtuals: true } }
);
bookingSchema.index({ tourStartDate: 1 });
bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name startLocation duration imageCover price',
  });
  next();
});
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
