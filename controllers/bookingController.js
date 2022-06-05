const Tour = require('./../models/tourModel.js');
const User = require('./../models/userModel.js');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('./../models/bookingModel');

exports.UserFilter = (req, res, next) => {
  req.filterOptions = { user: req.user.id };
  next();
};

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. get the currently booked tour
  const tour = await Tour.findById(req.params.id);
  // 2. create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `http://127.0.0.1:3000/me/mybooking`,
    cancel_url: `https://www.gmail.com`,
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: {
      tourStartDate: req.body.tourStartDate,
      quantity: req.body.quantity,
    },
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        amount: tour.price * 100 * req.body.quantity,
        currency: 'usd',
        quantity: req.body.quantity,
      },
    ],
  });
  // 3. create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

const createBookingCheckout = async (session) => {
  console.log(session);
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;
  const tourStartDate = session.metadata.tourStartDate;
  const sessionId = session.id;
  const quantity = session.metadata.quantity;
  await Booking.create({
    tour,
    user,
    price,
    tourStartDate,
    sessionId,
    quantity,
  });
};
exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);

    return;
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }
  if (event.type === 'charge.succeeded') {
    console.log('charged, send email');
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(400).json({ received: true });
});

exports.getBookingByUserId = factory.getAll(Booking);
exports.getBookingByTourId = factory.getAll(Booking);
