var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var field = require('../models/field.js');
var sensor = require('../models/sensor.js');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
GET /fields simple listing.
GET /fields?detailed fields listing with all the sensors information.
*/
router.get('/', function(req, res) {
    field.find(function(err, fields) {
      if (err) return next(err);
      if (req.query.hasOwnProperty('detailed')) {
        sensor.populate(fields, {path: "sensors"}, function(err, fields) {
          if (err) return next(err);
          res.json(fields);
        });
      }
      else {
          res.json(fields);
      }
    });
});

/* GET /fields/fieldId */
router.get('/:id', function(req, res) {
  field.findById(req.params.id, function (err, field) {
    if (err) console.log(err);
    res.json(field);
  });
});

/* GET /fields/name/fieldName */
router.get('/name/:fieldName', function(req, res) {
  field.find().byName(req.params.fieldName).exec(function(err, field) {
    if (err) console.log(err);
    res.json(field);
  });
});

/* POST /fields
Example POST call:
{
	"name": "Field A",                     <-- Mandatory field
	"description": "Field A description."  <-- Optional field
}
*/
router.post('/', function(req, res, next) {
  field.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /fields/all ALL fields */
router.delete('/all', function(req, res) {
  field.find(function (err, fields) {
    if (err) return next(err);
    fields.forEach( function (fieldElement) {
      fieldElement.remove(function (err, field) {
        if (err) {
          return console.log(err);
        } else {
          res.json({ message: 'All fields DELETED' });
        }
      });
    });
  });
});

/* DELETE /fields/fieldId */
router.delete('/:id', function(req, res) {
  field.findById(req.params.id, function(err, field) {
    if (err) return console.log(err);
    field.remove(function(err, field) {
      if (err) return console.log(err);
      res.json({ message: 'Field ' + field.name + ' deleted.'});
    });
  });
});

module.exports = router;
