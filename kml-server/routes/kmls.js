var www = require('../bin/www');
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");

var PythonShell = require('python-shell');
var fs = require('fs');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
Sensors generate KML call
*/
router.post('/sensors', function(req, res) {
  var lgIp = www['lgIp'];
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
        args: [req.body.name, lgIp]
      };

      PythonShell.run('send_kml.py', options, function (err) {
        if (err) console.log(err);
        console.log("KML sent correctly!");
        res.json('OK');
      });
    });
  });
});


/*
Overlays generate KML call
*/
router.post('/overlays', function(req, res) {
  var lgIp = www['lgIp'];
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    console.log('ERROR: Generate KML call without object');
    res.json('ERROR');
  }
  aux_string = JSON.stringify(req.body);
  fs.writeFile('public/generators/generator.json', aux_string, function(err) {
    if (err) return console.log(err);
    console.log('Json generator file saved correctly!');
    PythonShell.run('public/pythonscripts/overlay_generator.py', function (err) {
      if (err) console.log(err);
      console.log('KML generated correctly!');

      var options = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'],
        scriptPath: 'public/pythonscripts/',
        args: [req.body.name, lgIp]
      };
      PythonShell.run('send_kml.py', options, function (err) {
        if (err) return console.log(err);
        console.log('KML sent correctly!');
        res.json('OK');
      });
    });
  });
});

router.post('/demos/sensors', function(req, res) {
  var lgIp = www['lgIp'];
  var options = {
    mode: 'text',
    pythonPath: 'python',
    pythonOptions: ['-u'],
    scriptPath: 'public/pythonscripts/',
    args: ['demoSensors', lgIp]
  };

  PythonShell.run('send_kml.py', options, function (err) {
    if (err) return console.log(err);
    console.log('KML sent correctly!');
    res.json('OK');
  });
});

router.post('/demos/overlays', function(req, res) {
  var lgIp = www['lgIp'];
  var options = {
    mode: 'text',
    pythonPath: 'python',
    pythonOptions: ['-u'],
    scriptPath: 'public/pythonscripts/',
    args: ['demoOverlays', lgIp]
  };

  PythonShell.run('send_kml.py', options, function (err) {
    if (err) return console.log(err);
    console.log('KML sent correctly!');
    res.json('OK');
  });
});

router.post('/demos/stop', function(req, res) {
  var lgIp = www['lgIp'];
  var options = {
    mode: 'text',
    pythonPath: 'python',
    pythonOptions: ['-u'],
    scriptPath: 'public/pythonscripts/',
    args: ['stop', lgIp]
  };

  PythonShell.run('send_kml.py', options, function (err) {
    if (err) return console.log(err);
    console.log('KML sent correctly!');
    res.json('OK');
  });
});

module.exports = router;
