const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController.js');
const validID = require('../utils/validID.js');

const router = express.Router();
const { protect } = authController;
const {
  getCheckoutSession,
  UserFilter,
  getBookingByUserId,
} = bookingController;

router.param('id', validID.checkID);
router.use(protect);
// tourId
router.post('/checkout-session/:id', getCheckoutSession);
router.get('/myBookings', UserFilter, getBookingByUserId);
module.exports = router;
