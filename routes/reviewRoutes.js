const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController.js');

const router = express.Router();

const { protect, restricTo } = authController;

const { getAllReviews, getReviewById, createReview } = reviewController;

router.get('/', getAllReviews);
router.post('/', protect, restricTo('user'), createReview);

module.exports = router;
