/*
  HUGE takeaway here: if you are not sending a
  response, remember to use next()

*/

const express = require('express');
const bodyParser = require('body-parser');

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

const Post = require('./models/post');

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
    'GET, POST, PATCH, DELETE, PUT, OPTIONS',
  );
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added!',
      postId: createdPost._id,
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  // res.send('Hello from Express...');

  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully.',
      posts: documents,
    });
    // console.log(documents);
  });
  /*
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
  */
});

app.delete('/api/posts/:id', (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted!' });
  });
});

app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    // console.log(result);
    res.status(200).json({ message: 'Update successful!' });
  });
});

app.get('/api/posts/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  });
});

module.exports = app;
