const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
  },
  description: {
    type: String,
  },
  logoFile: {
    type: Buffer
  },
//   productPhotos: [{}],
//   productVideos: [{}],
  selectedAdTypes: [String],
  selectedAdjectives: [String],
  selectedDuration: {
    type: String,
  },
  selectedModelTypes: [String],
//   storePhotos: [{}],
//   storeVideos: [{}],
  tagline: {
    text: {
      type: String,
    },
    dataType: {
      type: String,
    },
  },
});

module.exports = mongoose.model('Business', businessSchema);
