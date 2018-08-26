/*
  HUGE takeaway here: if you are not sending a
  response, remember to use next()

*/

const express = require('express');

const app = express();

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

app.use((req, res, next) => {
  res.send('Hello from Express...');
});

module.exports = app;
