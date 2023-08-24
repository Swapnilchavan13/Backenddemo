const mongoose = require('mongoose');

const upload = new mongoose.Schema({
  images: {
    type: String,
    required: true,
  },
});

const Upload = mongoose.model('Upload', upload);

module.exports = Upload;