var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var multer = require("multer");
var crypto = require("crypto");

var http = require('http').createServer(express);

var mongoose = require('mongoose');
var sensor = require('../models/sensor.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/', function(req, res) {

});

router.get('/:id', function(req, res) {

});

router.post('/', multer({ dest: 'public/images/' }).single('upload'),
  function(req, res) {
    console.log(req.file);
    console.log(req.file.filename);
    res.json(req.file.originalname);
});

router.delete('/:id', function(req, res) {

});


module.exports = router;
