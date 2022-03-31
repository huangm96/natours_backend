const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();

// middleware
app.use(morgan('dev'));

// built-in middleware, it parses incoming requests with JSON
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' });
});

// Route handler

//  routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//   start server
const port = 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
