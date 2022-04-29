const express = require('express');
const tourController = require('../controllers/tourController.js');
const authController = require('../controllers/authController.js');
const reviewRouter = require('./reviewRoutes.js');

const validID = require('../utils/validID.js');
const router = express.Router();

const { protect, restricTo } = authController;

const {
  getAllTours,
  getTourById,
  createTour,
  updateTourById,
  removeTourById,

  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = tourController;

router.param('id', validID.checkID);
router.get('/top-5-cheap', aliasTopTours, getAllTours);
router.get('/tour-stats', getTourStats);
router.get('/monthly-plan/:year', getMonthlyPlan);

// mounting router
router.use('/:id/reviews', reviewRouter);

router.get('/', getAllTours);
router.get('/:id', getTourById);
router.post('/', protect, restricTo('admin', 'lead-guide'), createTour);
router.patch('/:id', protect, restricTo('admin', 'lead-guide'), updateTourById);
router.delete(
  '/:id',
  protect,
  restricTo('admin', 'lead-guide'),
  removeTourById
);

module.exports = router;
