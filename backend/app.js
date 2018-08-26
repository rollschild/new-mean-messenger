/*
  HUGE takeaway here: if you are not sending a
  response, remember to use next()

*/

const express = require('express');
const bodyParser = require('body-parser');
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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added!',
  });
});

app.get('/api/posts', (req, res, next) => {
  // res.send('Hello from Express...');
  const posts = [
    {
      id: '2037',
      title: 'First server side post.',
      content: 'From server.',
    },
    {
      id: '5237',
      title: 'Second server side post',
      content: 'From server, too.',
    },
  ];
  res.status(200).json({
    message: 'Posts fetched successfully.',
    posts: posts,
  });
});

module.exports = app;
