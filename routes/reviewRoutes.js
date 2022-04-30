const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController.js');
const validID = require('../utils/validID.js');

const router = express.Router({ mergeParams: true });

const { protect, restricTo } = authController;

const {
  getReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReviewById,
  TourFilter,
} = reviewController;

router.param('id', validID.checkID);

router.get('/', TourFilter, getReviews);
router.get('/:id', protect, getReviewById);
router.post('/', restricTo('user'), setTourUserIds, createReview);
router.delete('/:id', protect, restricTo('user'), deleteReview);
router.patch('/:id', protect, restricTo('user'), updateReview);

module.exports = router;
