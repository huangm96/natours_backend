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
} = tourController;

router.param('id', checkID);

router.get('/', getAllTours);
router.get('/:id', getTourById);
router.post('/', createTour);
router.patch('/:id', updateTourById);
router.delete('/:id', removeTourById);

module.exports = router;
