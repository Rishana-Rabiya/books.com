var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bookRouter = express.Router();
var Books = require('../models/books_info');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })


bookRouter.route('/upload')
.post(function (req, res, next) {
  console.log(req.body);
	res.json({success: true});

});






















module.exports = bookRouter;
