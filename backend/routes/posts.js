const express = require('express');
const multer = require('multer');
const Post = require('../models/post');

const router = express.Router();
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type!');
    if (isValid) {
      error = null;
    }
    callback(error, 'backend/images');
    // this path is relative to server.js
  },
  filename: (req, file, callback) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-'); // any whitespace will be
    // ...replaced by dash
    const extension = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + extension);
  },
});

// single: expecting a single file
router.post(
  '',
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename,
    });

    post.save().then(createdPost => {
      res.status(201).json({
        message: 'Post added!',
        // postId: createdPost._id,
        post: {
          ...createdPost,
          id: createdPost._id,
          /*
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
          */
        },
      });
    });
  },
);

router.get('', (req, res, next) => {
  // res.send('Hello from Express...');

  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully.',
      posts: documents,
    });
    // console.log(documents);
  });
});

router.delete('/:id', (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted!' });
  });
});

router.put(
  '/:id',
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      // this means when edit mode,
      // ...a new file/image is uploading
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      // console.log(result);
      res.status(200).json({ message: 'Update successful!' });
    });
  },
);

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  });
});

module.exports = router;
