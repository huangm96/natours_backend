const express = require('express');
const fs = require('fs');

const router = express.Router();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'Success', results: tours.length, data: { tours } });
};
const getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({ status: 'Fail', message: 'Invalid id' });
  }

  res.status(200).json({ status: 'Success', data: { tour } });
};
const createTour = (req, res) => {
  console.log(req.body);
  res.status(201).send({ status: 'Success' });
};
const updateTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({ status: 'Fail', message: 'Invalid id' });
  }
  res.status(200).send({ status: 'Success', data: { tour } });
};
const removeTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({ status: 'Fail', message: 'Invalid id' });
  }
  res.status(204).send({ status: 'Success', data: { tour } });
};

router.get('/', getAllTours);
router.get('/:id', getTourById);
router.post('/', createTour);
router.patch('/:id', updateTourById);
router.delete('/:id', removeTourById);

module.exports = router;
