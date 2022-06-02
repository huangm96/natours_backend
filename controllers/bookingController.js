const Tour = require('./../models/tourModel.js');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('./../models/bookingModel');
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. get the currently booked tour
  const tour = await Tour.findById(req.params.id);
  // 2. create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `https://www.google.com`,
    cancel_url: `https://www.gmail.com`,
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: { tourStartDate: req.body.tourStartDate },
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        image: [tour.imageCover],
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
exports.UserFilter = (req, res, next) => {
  req.filterOptions = { user: req.user.id };
  next();
};
const createBookingCheckout = async (session) => {
  console.log('session', session);
  await Booking.create({});
};
exports.webhookCheckout = catchAsync(async (req, res, next) => {
  console.log('here');
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('paymentIntent', paymentIntent);
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    case 'checkout.session.completed':
      createBookingCheckout(event.data.object);
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send(200).json({ received: true });
});

exports.getBookingByUserId = factory.getAll(Booking);
