const mongoose = require('mongoose');

const upload = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  uploadDate: { type: Date, default: Date.now },
});

const Upload = mongoose.model('Upload', upload);

module.exports = Upload;