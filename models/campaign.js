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
        type:String,
      },
selectedAttributes: {
    type: [String],
  },
  range: {
    type: String,
  },
  mediaVideo: {
    type:String,
  },
  mediaSlide: {
    type:String,
  },
  media3D: {
    type: String,
  },
  detail: {
    type:String,
  },

  budget: {
    type: String,
}
});

module.exports = mongoose.model('Campaign', campaignSchema);
