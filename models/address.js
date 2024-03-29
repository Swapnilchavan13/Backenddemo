const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  register_id: {
    type:String,
  },
  address1: {
    type:String,
  },
  address2: {
    type:String,
  },

  
  businessType1: {
    type:String,
  },
  businessType2: {
    type:String,
  },
  city: {
    type:String,
  },
  contactPerson: {
    type:String,
  },
  des: {
    type:String,
  },
  email: {
    type:String,
  },
  etc: {
    type:String,
  },
  name: {
    type:String,
  },
  phone: {
    type:String,
  },
  businessphone: {
    type:String,
  },
  pin: {
    type:String,
  },
  state: {
    type:String,
  },
  year: {
    type:String,
  },
});

module.exports = mongoose.model('Address', addressSchema);
