const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController.js');
const validID = require('../utils/validID.js');

const router = express.Router({ mergeParams: true });

const { protect, restricTo } = authController;

const { getReviews, createReview } = reviewController;

router.param('id', validID.checkID);

router.get('/', getReviews);
router.post('/', protect, restricTo('user'), createReview);

module.exports = router;
