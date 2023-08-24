const mongoose = require('mongoose');

const upload = new mongoose.Schema({
images: {
    type: String, // Assuming you're storing the image path as a string
    required: true
}
});

const Upload = mongoose.model('Upload', upload);

module.exports = Upload;