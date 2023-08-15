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
    type: String,
  required: true,
  // maxlength: 50 * 1024 * 1024
  },
});

module.exports = mongoose.model('Data', DataSchema);
