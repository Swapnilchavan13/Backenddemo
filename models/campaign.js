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
    type:Boolean,
  },
  mediaSlide: {
    type:Boolean,
  },
  media3D: {
    type: Boolean,
  },
  detail: {
    type:String,
  },

  budget: {
    type: Number,
}
});

module.exports = mongoose.model('Campaign', campaignSchema);

