const mongoose=require('mongoose');
const { MONGOURI } = require('../config/keys');
mongoose.connect(MONGOURI,{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true });
var conn=mongoose.Collection;
var passSchema=new mongoose.Schema({
     password_category : {
         type:String,
         required:true,
         index:{
             unique:true,
         }
     },
     project_name : {
        type:String,
        required:true,
    },
     password_detail : {
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    }
});

var passModel=mongoose.model('password_details',passSchema);
module.exports=passModel;