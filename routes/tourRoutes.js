const express = require('express');
const tourController = require('../controllers/tourController.js');
const router = express.Router();

const {
  getAllTours,
  getTourById,
  createTour,
  updateTourById,
  removeTourById,
  checkID,
  checkBody,
} = tourController;

router.param('id', checkID);

router.get('/', getAllTours);
router.get('/:id', getTourById);
router.post('/', checkBody, createTour);
router.patch('/:id', updateTourById);
router.delete('/:id', removeTourById);

module.exports = router;
