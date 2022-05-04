const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app.js');

process.on('unhandledRejection', (err) => {
  console.log('Unhandler rejection! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught rejection! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

// local connection
// mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
//   console.log('DB connection successful!');
// });

//   start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
