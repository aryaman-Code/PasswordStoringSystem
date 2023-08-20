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




router.get('/', checkLoginUser,function(req, res, next) {
    res.redirect('/dashboard');
  });
  
  
  router.get('/edit/:id', checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var id=req.params.id;
    var getPassDetails=passModel.findById({_id:id});
    getPassDetails.exec(function(err,data){
      if(err) throw err;
      getPassCat.exec (function(err,data1){
        if(err) throw err
        res.render('edit_password_details', { title: 'Password Management System',loginUser:loginUser,records:data1,record:data,success:'' });
      });
    });
  });
  
  router.post('/edit/:id', checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var id=req.params.id;
    var passCat=req.body.pass_category;
    var projectName=req.body.project_name;
    var passDetails=req.body.pass_details;
    var getPassDetails=passModel.findById({_id:id});
    var getPassDetails1=passModel.findByIdAndUpdate({_id:id},
      {
        password_category:passCat,
        project_name:projectName,
        password_detail:passDetails
      });
      getPassDetails1.exec(function(err){
        if(err) throw err;
        getPassDetails.exec(function(err,data){
          if(err) throw err;
          getPassCat.exec (function(err,data1){
            if(err) throw err
            res.render('edit_password_details', { title: 'Password Management System',loginUser:loginUser,records:data1,record:data,success:'Password Updated Successfully' });
          });
        });
      });
  });
  
  router.get('/delete/:id', checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var id=req.params.id;
    var passDetails=passModel.findByIdAndDelete(id);
    passDetails.exec(function(err,data){
      if(err) throw err;
      res.redirect('/viewAllPassword'); 
     });
  });
  

module.exports = router;