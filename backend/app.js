/*
  HUGE takeaway here: if you are not sending a
  response, remember to use next()

*/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://rollschild:uWVwvAOZD3ywymgs@rollscluster-j6avi.gcp.mongodb.net/new-mean-messenger?retryWrites=true',
  )
  .then(() => {
    console.log('Connected to mongoDB successfully!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

const app = express();

/*
app.use((req, res, next) => {
  console.log('First middleware');
  next();
  // go ahead and reach other middleware
  // if we do not use next(), it will not
  // ...go ahead and reach the next middleware
  // ...which means it will not send back a
  // ...response ->> hence will load indefinitely
  // ...and timeout eventually
});
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Allow backend/images folder be statically accessed by external requests
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, PUT, OPTIONS',
  );
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
