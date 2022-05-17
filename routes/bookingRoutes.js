const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController.js');
const validID = require('../utils/validID.js');

const router = express.Router();
const { protect } = authController;
const { getCheckoutSession } = bookingController;

router.param('id', validID.checkID);

// tourId
router.get('/checkout-session/:id', protect, getCheckoutSession);

module.exports = router;
