const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DataSchema = new Schema({
  mediaTitle: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  mediaSource: {
    type: [String],
    required: true,
  },
  mediaType: {
    type: String,
    required: true,
  },
  keywords: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer,
  required: true,
  },
});

module.exports = mongoose.model('Data', DataSchema);
