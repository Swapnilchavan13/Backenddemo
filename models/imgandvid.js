const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
    mainid: String,
    imgurl1: [String],
    vidurl1: [String],
  });

const imgandvidSchema = new mongoose.Schema({
imgandvid:[subSchema]
});

module.exports = mongoose.model('Imgandvid', imgandvidSchema);