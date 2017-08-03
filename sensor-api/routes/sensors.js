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

    var jsonResponse = {
      summary: {},
      sensors: []
    };

    jsonResponse.summary = getSummary(sensors);
    jsonResponse.sensors = sensors;

    res.json(jsonResponse);
  });
});

/*
Summary JSON response has this content:
"summary": {
       "sensors": {
      // Available sensors are those who have some attribute value.
           "available": [
               "SensorApi1",
               ...
           ],
      // Unavailable sensors are those who don't have any attribute value.
           "unavailable": [
               "SensorApi8",
               ...
           ]
       },
       "attributes": {
      // Available attributes are those who have a value in some sensor.
      // The structure of available attributes is:
      // "Name_of_attribute": Number_of_appearances_in_sensors
           "available": {
               "valueAirTemperature": 7,
               ...
           },
      // Unavailable attributes are those who don't have any value in any sensor.
           "unavailable": [
                "valueUltrasound",
                ...
         ]
       }
   }
*/

function getSummary(sensors) {
  var returnJson = {
    sensors: {
      available: [],
      unavailable: []
    },
    attributes: {
      available: {},
      unavailable: []
    }
  };
  var attributesCount = {};
  var requiredKeys = [
    '_id', 'name', 'locationLatitude', 'locationLongitude',
    '__v', 'updated_at'
  ];
  sensors.forEach(function(sensor) {
    var sensorKeys = Object.keys(sensor.toJSON());
    if (isAvailable(sensorKeys, requiredKeys)) {
      returnJson.sensors.available.push(sensor.name);
    } else {
      returnJson.sensors.unavailable.push(sensor.name);
    }
    countAttributes(sensorKeys, requiredKeys, attributesCount);
  });
  returnJson.attributes.available = attributesCount;
  returnJson.attributes.unavailable = getUnavailableAttributes(attributesCount);
  return returnJson;
}

function countAttributes(sensorKeys, requiredKeys, attributesCount) {
  sensorKeys.forEach(function(sensorKey) {
    if (!(requiredKeys.indexOf(sensorKey) > -1 )) {
      if (sensorKey in attributesCount) {
        attributesCount[sensorKey] = attributesCount[sensorKey] + 1;
      }
      else {
        attributesCount[sensorKey] = 1;
      }
    }
  });
}

function getUnavailableAttributes(availableAttributes) {
  var unavailableAttributes = []
  var valuesKeys = getValuesKeys();
  valuesKeys.forEach(function(valuesKey) {
    if (!(valuesKey in availableAttributes)) {
      unavailableAttributes.push(valuesKey);
    }
  });
  return unavailableAttributes;
}

function getValuesKeys() {
  return [
    'valueAirTemperature', 'valueAirHumidity', 'valueAirPressure',
    'valueSoilTemperature', 'valueLeafWetness', 'valueAtmosphericPressure',
    'valueSolarRadiation', 'valueUltravioletRadiation', 'valueTrunkDiameter',
    'valueStemDiameter', 'valueFruitDiameter', 'valueAnemometer',
    'valueWindVane', 'valuePluviometer', 'valueLuminosity', 'valueUltrasound'
  ];
}

function isAvailable(sensorKeys) {
  /*
  Look for sensor's keys corresponding to a value.
  If none is found, return false, which means this sensor is unavailable
  */
  var returnBoolean = false;
  for (i = 0; i < sensorKeys.length; i++) {
    if (sensorKeys[i].indexOf('value') == 0) {
      returnBoolean = true;
      break;
    }
  }
  return returnBoolean;
}

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

/*
GET /sensors/attribute/attributeName has this context:
{
    "name": "valueAirTemperature",
    "values": [
        {
            "sensorName": "SensorApi1",
            "sensorvalue": 1
        },
        ...
    ]
}
*/

router.get('/attribute/:attributeName', function(req, res) {
  var attributeName = req.params.attributeName;
  if (isValid(getValuesKeys(), attributeName)) {
    sensor.find(function (err, sensors) {
      var jsonResponse = {
        name: '',
        values: []
      };
      jsonResponse.name = attributeName;
      sensors.forEach(function(sensor) {
        if (isValid(Object.keys(sensor.toJSON()), attributeName)){
          var attributeValue = {};
          attributeValue.sensorName = sensor.name;
          attributeValue.sensorvalue = sensor[attributeName];
          jsonResponse.values.push(attributeValue);
        }
      });
      res.json(jsonResponse);
    });
  }
  else {
    res.json('ERROR: ' + attributeName + 'is not a valid attribute \
     name');
  }
});

function isValid(keys, attributeName) {
  var returnBoolean = false;
  for (i = 0; i < keys.length; i++) {
    if (keys[i].indexOf(attributeName) == 0) {
      returnBoolean = true;
      break;
    }
  }
  return returnBoolean;
}

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

/* POST to call kml generator with parameters by call request body */
router.post('/kml/generateKml', function(req, res) {
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

router.delete('/:id', function (req, res) {
  sensor.findById(req.params.id, function (err, sensor) {
    if (err) {
      return console.log(err);
    } else {
      sensor.remove(function (err, sensor) {
        if (err) {
          return console.log(err);
        } else {
          res.json({ message: 'Sensor ' + sensor.name + 'deleted' });
        }
      });
    }
  });
});

module.exports = router;
