const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'Success', results: tours.length, data: { tours } });
};
exports.getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({ status: 'Fail', message: 'Invalid id' });
  }

  res.status(200).json({ status: 'Success', data: { tour } });
};
exports.createTour = (req, res) => {
  console.log(req.body);
  res.status(201).send({ status: 'Success' });
};
exports.updateTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({ status: 'Fail', message: 'Invalid id' });
  }
  res.status(200).send({ status: 'Success', data: { tour } });
};
exports.removeTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({ status: 'Fail', message: 'Invalid id' });
  }
  res.status(204).send({ status: 'Success', data: { tour } });
};
