const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  selectedVillages: {
    type: [String],
  },
  selectedTalukas: {
    type: [String],
  },
  selectedRanges: {
    type: [String],
  },
  selectedGenders: {
    type: [String],
  },
  selectedDistrict: {
    type: String,
  },
  selectedAttributes: {
    type: [String],
  },
  range: {
    type: String,
  },
  mediaVideo: {
    type: Boolean, // Corrected data type to Boolean
  },
  mediaSlide: {
    type: Boolean, // Corrected data type to Boolean
  },
  media3D: {
    type: Boolean, // Corrected data type to Boolean
  },
  detail: {
    type: String,
  },
  budget: {
    type: Number, // Corrected data type to Number
  },
});

module.exports = mongoose.model('Campaign', campaignSchema);
