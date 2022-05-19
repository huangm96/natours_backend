const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');
const TourPhoto = require('./../../models/tourPhotoModel');
const UserPhoto = require('./../../models/userPhotoModel');
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
  console.log('DB Connected');
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-new.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    await TourPhoto.create();
    await UserPhoto.create();
    console.log('data successfully created');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    await TourPhoto.deleteMany();
    await UserPhoto.deleteMany();
    console.log('data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '---import') {
  importData();
} else if (process.argv[2] === '---delete') {
  deleteData();
}
console.log(process.argv);

//node ./dev-data/data/import-dev-data.js ---import
