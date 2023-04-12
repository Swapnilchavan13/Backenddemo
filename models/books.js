const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Bookschema = new Schema({
    title:{
        type: String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    }
    // discription:{
    //     type:String,
    //     required:true,
    // },
    // image:{
    //     type:Image,
    //     required:true,
    // }
})
module.exports = mongoose.model("Book", Bookschema)