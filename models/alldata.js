const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  address: String,
  businessType1: String,
  businessType2: String,
  city: String,
  contactPerson: String,
  description: String,
  email: String,
  etc: String,
  name: String,
  phone: String,
  pin: String,
  state: String,
  year: String
});

module.exports = mongoose.model('Address', addressSchema);
