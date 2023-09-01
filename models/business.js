const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
  },
  description: {
    type: String,
  },
//   logoFile: {
//     type: Buffer
//   },
//   productPhotos: [{}],
//   productVideos: [{}],
  selectedAdTypes: {
    type:[String],
  },
  selectedAdjectives: {
    type:[String],
  },
  selectedDuration: {
    type: String,
  },
  selectedModelTypes: {
    type:[String],
  },

//   storePhotos: [{}],
//   storeVideos: [{}],
//   tagline: {
//     text: {
//       type: String,
//     },
//     dataType: {
//       type: String,
//     },
tagline: {
    type: String,
}
});

module.exports = mongoose.model('Business', businessSchema);
