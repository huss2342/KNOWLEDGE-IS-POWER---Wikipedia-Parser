const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    username: {
    type: String,
    required: true
  },
  bookmarkInfo: {
    query: {
      type: String,
      required: true,
      unique: true
    },
    graph: {
      type: String, // Storing graph as a JSON string
      required: true
    },
  }
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
