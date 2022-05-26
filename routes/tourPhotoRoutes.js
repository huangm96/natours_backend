const express = require('express');
const tourPhotoController = require('./../controllers/tourPhotoController');
const authController = require('./../controllers/authController');

const validID = require('../utils/validID.js');

const router = express.Router({ mergeParams: true });

const { protect, restricTo } = authController;

const { getTourPhotoById, deleteTourPhoto } = tourPhotoController;

router.param('id', validID.checkID);

router.get('/:id', getTourPhotoById);

// protect all routes after this middleware
router.use(protect);
router.delete('/:id', restricTo('lead-guide', 'admin'), deleteTourPhoto);

module.exports = router;
