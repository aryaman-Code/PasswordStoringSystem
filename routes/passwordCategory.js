var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var passCatModule=require('../modules/password_category');
// Bcrypt For hidden the password in Database..
var bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');
const {check , validationResult}=require('express-validator');
const passCatModel = require('../modules/password_category');
const passModel = require('../modules/add_password');
var getPassCat=passCatModel.find({});
var getAllPass=passModel.find({});
//Local Storage reuired for storing the generated token during Login..
if(typeof localStorage === "undefined" || localStorage === null){
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try{
    var decoded=jwt.verify(userToken,'loginToken');
  } catch (err) {
    res.redirect('/');
  }
  next();
}

function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexistemail=userModule.findOne({email:email});
  checkexistemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password Management System',msg:'Email Already Exist' });
    }
    next();
  });
}

function checkUserName(req,res,next){
  var uname=req.body.uname;
  var checkexistuname=userModule.findOne({username:uname});
  checkexistuname.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password Management System',msg:'UserName Already Exist' });
    }
    next();
  });
}

router.get('/', checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    getPassCat.exec(function(err,data){
      if(err) throw err;
      console.log(data)
      res.render('password_category', { title: 'Password Management System', loginUser:loginUser, records:data });
    });
});
  
  router.get('/delete/:id', checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passCatID=req.params.id;
    var passDelete=passCatModel.findByIdAndDelete(passCatID);
    passDelete.exec(function(err,data){
      if(err) throw err;
      res.redirect('/passwordCategory'); 
     });
  });

  router.get('/edit/:id', checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passCatID=req.params.id;
    var getPassCat=passCatModel.findById(passCatID);
    getPassCat.exec(function(err,data){
      if(err) throw err;
      res.render('edit_pass_category', { title: 'Password Management System', loginUser:loginUser,error:'',success:'' ,records:data,id:passCatID });
     });
  });

  router.post('/edit', checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passCatID=req.body.id;
    var passCatName=req.body.passwordCategory;
    var updatePassCat=passCatModel.findByIdAndUpdate(passCatID,{password_category : passCatName});
    updatePassCat.exec(function(err,data){
      if(err) throw err;
      res.redirect('/passwordCategory');
    });
  });

module.exports = router;