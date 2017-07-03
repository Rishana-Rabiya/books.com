var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var mail = require('./mail');
var Verify = require('./verify');
var emailExistence = require('email-existence');

router.get('/login/:id', function (req, res, next) {
  console.log("inside the get");
    User.findOne({email:req.params.id},{type:1,_id: 0} ,function (err, type) {
        if (err) throw err;
        console.log(type);
        res.json(type);
    });
});


router.get('/register/:id', function (req, res, next) {
  //emailExistence.check(req.params.id, function(err,response){
   //if(response){
      User.findOne({email:req.params.id},function(err,user){
        if (err) throw err;
        if(!user){
          var code = Math.floor((Math.random() * 1000000) + 1);
          var sub = "Activation for completing registration";
          mail.mailSend(req.params.id,code,sub);
          code = code +'';
          res.status(200).json({
            status:code
          });
       }
       else {
         res.status(200).json({
           status:"exist"
         });
       }
     });
/*  else {
    res.status(200).json({
      status:"invalid"
    });
  }
});*/
});

router.post('/register', function (req, res, next) {
   var newUser = new User();
   var temp = req.body;
   newUser.email = temp.email;
   newUser.password = newUser.encryptPassword(temp.password);
   newUser.firstName =temp.fname;
   newUser.lastName=temp.lname;
   newUser.type = "pending_user";
   newUser.save(function(err, result) {
     if (err) {
       throw err;
     }
     res.json({message:"Registration Successful"});
   });
 });


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req,username, password, done) {
    console.log("inside authen");
//get the email id from the database as that of the username(email) posted
    User.findOne({ email:username}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Invalid email id' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      if(user.type=="pending_user"){
        return done(null, false, { message: 'you are not approved yet' });
      }
      console.log(user);
      req.logIn(user, function(err) {
        if (err) {
          return res.status(500).json({
            err: 'Could not log in user'
          });
        }
      });
      return done(null, user);
    });
  }));


//serializer and deserializer
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
        done(err, user);
  });
});

//logout
router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
      status: 'Bye!'
    });
});



router.post('/login',function(req, res, next){
  passport.authenticate('local',
  function(err, user, info) {
    console.log(info);
    if (err) { return next(err); }
    if (!user) { res.status(401).json({
      status: 'Login unsuccessful!',
      success: false,
      err: info
    });
  }
  req.logIn(user, function(err) {
    if (err) { return next(err); }
    var token = Verify.getToken(user);
    console.log(token);
    console.log("sucess");
    res.status(200).json({
      status: 'Login successful!',
      success: true,
      token: token
    });
  });
})(req, res, next);
});

module.exports = router;
