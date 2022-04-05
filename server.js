const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app.js');

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
