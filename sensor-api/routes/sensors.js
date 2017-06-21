var express = require('express');
var router = express.Router();

var http = require('http').createServer(express);
var io = require('socket.io').listen(http);

var mongoose = require('mongoose');
var sensor = require('../models/sensor.js');

var spawn = require('child_process').spawn;
var PythonShell = require('python-shell');
var fs = require('fs');

var xml = require('xml');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

http.listen(4000);
io.set("origins", "*:*");

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

router.get('/kml/getKml/:kmlName', function(req, res) {
  res.set('Content-Type', 'text/xml');
  res.sendfile('public/kmls/' + req.params.kmlName + '.kml');
});

/* POST /sensors */
router.post('/', function(req, res, next) {
  sensor.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* POST to call kml generator with parameters by call request bodt */
router.post('/kml/generateKml', function(req, res) {
  /* EXAMPLE POST call Body (raw - JSON (application/json as header))
  {
   "name": "kml_test",
   "sensors": [
     {"name": "sensor1", "data": {"temperature": 30.5},
       "coords": {"lat": 0.6, "lng": 41.1}
     },
     {"name": "sensor2", "data": {"temperature": 30.5},
       "coords": {"lat": 0.62, "lng": 41.2}
     }
   ]
 }
 */
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    console.log('ERROR: Generate KML call without object');
    res.json('ERROR');
  }
  aux_string = JSON.stringify(req.body);
  fs.writeFile("public/generators/generator.json", aux_string, function(err) {
    if (err) return console.log(err);
    console.log("Json generator file saved correctly!");
    PythonShell.run('public/pythonscripts/kml_generator.py', function (err) {
      if (err) console.log(err);
      console.log("KML generated correctly!");

      var options = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'],
        scriptPath: 'public/pythonscripts/',
        args: [req.body.name]
      };

      PythonShell.run('send_kml.py', options, function (err) {
        if (err) console.log(err);
        console.log("KML sent correctly!");
        res.json('OK');
      });
    });
  });
});

/* PUT /sensors/sensorName */
router.put('/:sensorName', function(req, res) {
  sensor.findOne({ name: req.params.sensorName }).exec(function(err, sensor) {
    if (err) console.log(req.params.sensorName);
    console.log(sensor);
    sensor.temperatureValue = req.body.temperatureValue;
    sensor.humidityValue = req.body.humidityValue;

    sensor.save(function(err) {
      if (err) console.log(req.params.sensorName);
      io.sockets.emit('updated', sensor.name);
      res.json({ message: 'Sensor updated' });
    });
  })
});

module.exports = router;
