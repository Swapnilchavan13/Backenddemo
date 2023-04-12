const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Authschema = new Schema({
    mobile:{
        type: String,
        required:true,
    },
    adhar:{
        type:String,
        required:true,
    },
     otp:{
        type:String,
        required:true,
    }
   
})
module.exports = mongoose.model("Auth", Authschema)