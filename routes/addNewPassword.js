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
      res.render('addNewPassword', { title: 'Password Management System',loginUser:loginUser,records:data ,success:''});
    })
  });
  
  router.post('/', checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var pass_category=req.body.pass_category;
    var pass_details=req.body.pass_details;
    var project_name=req.body.project_name;
    var passwordDetails=new passModel({
      password_category:pass_category,
      password_detail:pass_details,
      project_name:project_name
    });
      passwordDetails.save(function(err,doc){
        if(err) throw err;
        getPassCat.exec(function(err,data){
          if(err) throw err;
        res.render('addNewPassword', { title: 'Password Management System',loginUser:loginUser,records:data, success:'Password Details Inserted Successfully' });
      });
    });
  });


module.exports = router;