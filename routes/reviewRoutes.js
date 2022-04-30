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

// protect all routes after this middleware
router.use(protect);

router.get('/:id', getReviewById);

router.post('/', restricTo('user'), setTourUserIds, createReview);
router.delete('/:id', restricTo('user', 'admin'), deleteReview);
router.patch('/:id', restricTo('user', 'admin'), updateReview);

module.exports = router;
