var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var sensor = require('../models/sensor.js');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET /sensors listing. */
router.get('/', function(req, res) {
  sensor.find(function (err, sensors) {
    if (err) return next(err);
    res.json(sensors);
  });
});


/* GET /sensors/sensorId */
/*
router.get('/:sensorId', function(req, res) {
  sensor.findById(req.params.sensorId, function (err, sensor) {
    if (err) console.log(req.params.sensorName);
    res.json(sensor);
  });
});
*/

/* GET /sensors/sensorName */
router.get('/:sensorName', function(req, res) {
  sensor.find().byName(req.params.sensorName).exec(function(err, sensor) {
    if (err) console.log(req.params.sensorName);
    res.json(sensor);
  })
});

/* POST /sensors */
router.post('/', function(req, res, next) {
  sensor.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
