const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  media_id:{
    type: String,
  },
  mi:{
    type: String,
  },
  businessName: {
    type: String,
  },
  description: {
    type: String,
  },
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
  tagline: {
    type: String,
}

});

module.exports = mongoose.model('Business', businessSchema);
