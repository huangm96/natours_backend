const express = require('express');
const tourController = require('../controllers/tourController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

const { protect } = authController;

const {
  getAllTours,
  getTourById,
  createTour,
  updateTourById,
  removeTourById,
  checkID,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = tourController;

router.param('id', checkID);
router.get('/top-5-cheap', aliasTopTours, getAllTours);
router.get('/tour-stats', getTourStats);
router.get('/monthly-plan/:year', getMonthlyPlan);

router.get('/', getAllTours);
router.get('/:id', getTourById);
router.post('/', createTour);
router.patch('/:id', updateTourById);
router.delete('/:id', removeTourById);

module.exports = router;
