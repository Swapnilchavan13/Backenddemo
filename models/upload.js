const mongoose = require('mongoose');

const upload = new mongoose.Schema({
  upload: {
    type: String,
    required: true,
  },
});

const Upload = mongoose.model('Upload', upload);

module.exports = Upload;