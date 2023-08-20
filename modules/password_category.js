const mongoose=require('mongoose');
const { MONGOURI } = require('../config/keys');
mongoose.connect(MONGOURI,{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true });
var conn=mongoose.Collection;
var passCatSchema=new mongoose.Schema({
     password_category : {
         type:String,
         required:true,
     },
    date:{
        type:Date,
        default:Date.now
    }
});

var passCatModel=mongoose.model('password_category',passCatSchema);
module.exports=passCatModel;