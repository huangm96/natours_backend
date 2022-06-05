const express = require('express');
const bookingController = require('./../controllers/bookingController');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController.js');
const validID = require('../utils/validID.js');

const router = express.Router({ mergeParams: true });

const { protect } = authController;
const { TourFilter } = reviewController;
const {
  getCheckoutSession,
  UserFilter,
  getBookingByUserId,
  getBookingByTourId,
} = bookingController;

router.param('id', validID.checkID);

router.get('/', TourFilter, getBookingByTourId);

router.use(protect);
// tourId
router.post('/checkout-session/:id', getCheckoutSession);
router.get('/myBookings', UserFilter, getBookingByUserId);
module.exports = router;
