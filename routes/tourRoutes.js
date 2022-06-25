const express = require('express');
const tourController = require('../controllers/tourController.js');
const authController = require('../controllers/authController.js');
const tourPhotoController = require('./../controllers/tourPhotoController.js');

const reviewRouter = require('./reviewRoutes.js');
const bookingRouter = require('./bookingRoutes.js');

const validID = require('../utils/validID.js');
const router = express.Router();

const { protect, restricTo } = authController;

const {
  getAllTours,
  getTourById,
  createTour,
  updateTourById,
  deleteTour,

  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
} = tourController;

const {
  uploadTourImages,
  resizeTourImages,
  updateTourImages,
} = tourPhotoController;

router.param('id', validID.checkID);
router.get('/top-5-cheap', aliasTopTours, getAllTours);
router.get('/tour-stats', getTourStats);
router.get(
  '/monthly-plan/:year',
  protect,
  restricTo('admin', 'lead-guide', 'guide'),
  getMonthlyPlan
);

router.get('/distances/:latlng/unit/:unit', getDistances);
router.get('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin);

// mounting router
router.use('/:id/reviews', reviewRouter);
router.use('/:id/bookings', protect, bookingRouter);

router.get('/', getAllTours);
router.get('/:id', getTourById);

router.use(protect, restricTo('admin', 'lead-guide'));
router.post(
  '/',
  uploadTourImages,
  resizeTourImages,

  updateTourImages,
  createTour
);
router.patch(
  '/:id',
  uploadTourImages,
  resizeTourImages,

  updateTourImages,
  updateTourById
);
router.delete('/:id', deleteTour);

module.exports = router;
