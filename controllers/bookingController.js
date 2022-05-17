const Tour = require('./../models/tourModel.js');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. get the currently booked tour
  const tour = await Tour.findById(req.params.id);
  console.log(tour);
  // 2. create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `https://www.google.com`,
    cancel_url: `https://www.gmail.com`,
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        image: [tour.coverImage],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  // 3. create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
