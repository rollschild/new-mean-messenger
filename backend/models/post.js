const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
});

// Uppercase for model
module.exports = mongoose.model('Post', postSchema);
// my collection name will be 'posts'
