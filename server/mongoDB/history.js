const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    username: {
    type: String,
    required: true
  },
  historyInfo: {
    query: {
      type: String,
      required: true
    },
    graph: {
      type: String, // Storing graph as a JSON string
      required: true
    }
  }
});

const History = mongoose.model('History',historySchema);

module.exports = History;
