const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'Fail', message: 'Invalid id' });
  }
  req.tour = tour;
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: 'Fail', message: 'Missing name or price.' });
  }
  next();
};
exports.getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'Success', results: tours.length, data: { tours } });
};
exports.getTourById = (req, res) => {
  res.status(200).json({ status: 'Success', data: { tour: req.tour } });
};
exports.createTour = (req, res) => {
  console.log(req.body);
  res.status(201).send({ status: 'Success' });
};
exports.updateTourById = (req, res) => {
  res.status(200).send({ status: 'Success', data: { tour: req.tour } });
};
exports.removeTourById = (req, res) => {
  res.status(204).send({ status: 'Success', data: { tour: req.tour } });
};
