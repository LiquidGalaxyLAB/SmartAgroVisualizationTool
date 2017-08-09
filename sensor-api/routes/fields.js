var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var field = require('../models/field.js');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET /fields listing. */
router.get('/', function(req, res) {
  field.find(function(err, fields) {
    if (err) return next(err);
    res.json(fields);
  });
});

/* GET /fields/fieldName */
router.get('/:fieldName', function(req, res) {
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
