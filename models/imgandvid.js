const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
    mainid: String,
    imgurl1: String,
    imgurl2: String,
    imgurl3: String,
    imgurl4: String,
    imgurl5: String,
    vidurl1: String,
    vidurl2: String,
    vidurl3: String,
    vidurl4: String,
    vidurl5: String,
  });

const imgandvidSchema = new mongoose.Schema({
imgandvid:[subSchema]
});

module.exports = mongoose.model('Imgandvid', imgandvidSchema);