const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  filename: String,
  contentType: String,
});

module.exports = mongoose.model('New', ImageSchema);
