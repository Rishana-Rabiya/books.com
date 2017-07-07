var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var index = require('./routes/index');
var users = require('./routes/users');
var bookRouter = require('./routes/bookRouter');
var exUserRouter = require('./routes/exUserRouter');
var orderRouter = require('./routes/orderRouter');
var catRouter = require('./routes/categoryRouter');
var fineRouter = require('./routes/fineRouter');
var multer = require('multer');
var app = express();
var mongoose = require('mongoose');
const flash = require('connect-flash');
var config = require('./config');

//file size limit
//app.use(bodyParser.urlencoded({limit: '50mb'}));
//app.use(bodyParser.json({limit: '50mb'}));


// Secure traffic only
app.all('*', function(req, res, next){
    console.log('req start: ',req.secure, req.hostname, req.url, app.get('port'));
  if (req.secure) {
    return next();
  };

 res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url);
});

//connection to mongodb
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});
/*db.collection('authors').drop(function () {
    db.close();
});*/
app.use(multer({dest: './uploads/'}).single('photo'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
// Passport init
app.use(passport.initialize());
app.use(passport.session());


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// a middleware with no mount path; gets executed for every request to the app
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', '*');
  res.header("Access-Control-Allow-Headers", "content-type,x-access-token");

  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/books',bookRouter);
app.use('/category',catRouter);
app.use('/order',orderRouter);
app.use('/executive',exUserRouter);
app.use('/fine',fineRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
