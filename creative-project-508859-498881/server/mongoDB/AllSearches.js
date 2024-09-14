const mongoose = require('mongoose');

const allSearchesSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  allSearchesInfo: {
    query: {
      type: String,
      required: true,
      unique: true
    },
    graph: {
      type: String, 
      required: true
    },
    popularityCount: {
      type: Number,
      default: 1
    }
  }
});

const AllSearches = mongoose.model('AllSearches', allSearchesSchema);

module.exports = AllSearches;
