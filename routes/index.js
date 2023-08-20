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

/* GET home page. */
router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/dashboard');
  }
  else{
    res.render('index', { title: 'Password Management System',msg:'' });
  }
});

router.post('/', function(req, res, next) {
  var uname=req.body.uname;
  var password=req.body.password;

  var checkUser=userModule.findOne({username:uname});
//   console.log(checkUser)
  checkUser.exec((err,data)=>{
    if(err) throw err;
    if(data==null)
    {
      res.render('index', { title: 'Password Management System',msg:'Invalid Username' });
    }
    else
    {
    var getUserID=data._id;
    var getPassword=data.password;
    console.log("password1",password);
    console.log("getPassword",getPassword);
    if(bcrypt.compareSync(password,getPassword)){
      var token=jwt.sign({userID: getUserID},'loginToken');
      localStorage.setItem('userToken',token);
      localStorage.setItem('loginUser',uname);
      res.redirect('/dashboard');
    }
    else{
res.render('index', { title: 'Password Management System',msg:'Invalid Password' });
    }
  }
  })

});

router.get('/signup', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/dashboard');
  }
  else{
  res.render('signup', { title: 'Password Management System' ,msg:''});
  }
});

router.post('/signup',checkEmail,checkUserName, function(req, res, next) {
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var confpassword=req.body.confpassword;

  if(password != confpassword){
    res.render('signup', { title: 'Password Management System',msg:'Password Does not Match'});
  }      
  else{
    password=bcrypt.hashSync(password,10);
    var userDetail=new userModule({
      username:username,
      email:email,
      password:password
    });
  
    userDetail.save((err,doc)=>{
      if(err) throw err;
      res.render('signup', { title: 'Password Management System',msg:'User Registered Successfully' });
    })
  }
});

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});

module.exports = router;

/*
 
jwt
localstorage
req.body.uname
*/