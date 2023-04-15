const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Authschema = new Schema({
    hospital_id:{
        type: String,
        required:true,
    },
    aadhaar_num:{
        type:String,
        required:true,
    },
     otp:{
        type:String,
        required:true,
    } 
})

module.exports = mongoose.model("Auth", Authschema)


const Auth = new Schema({
    hospital_id:{
        type: String,
        required:true,
    },
    aadhaar_num:{
        type:String,
        required:true,
    },
     otp:{
        type:String,
        required:true,
    } 
})

module.exports = mongoose.model("AuthA", Auth)