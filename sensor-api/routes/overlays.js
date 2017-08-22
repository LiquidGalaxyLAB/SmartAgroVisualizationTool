var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");

var mongoose = require('mongoose');
var overlay = require('../models/overlay.js');
var image = require('../models/image.js');

var PythonShell = require('python-shell');
var fs = require('fs');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/', function(req, res) {
  overlay.find(function (err, overlays) {
    if (err) return next(err);
    if (req.query.hasOwnProperty('detailed')) {
      image.populate(overlays, {path: "images"}, function(err, overlays) {
        if (err) return next(err);
        res.json(overlays);
      });
    }
    else {
        res.json(overlays);
    }
  });
});

router.get('/:id', function(req, res) {
  overlay.findById(req.params.id, function (err, overlay) {
    if (err) return next(err);
    res.json(overlay);
  });
});

router.get('/image/:imageId', function(req, res) {
  var query = {
    images: req.params.imageId
  };
  overlay.find(query, function(err, overlay) {
    if (err) return console.log(err);
    image.populate(overlay, {path: "images"}, function(err, overlay) {
      if (err) return next(err);
      res.json(overlay);
    });
  });
});

router.post('/', function(req, res, next) {
  overlay.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/*
This method is called when user SAVES THE POSITION MARKERS of the ground overlay
Example req.body:
{
  "markerDL": [], "markerDR": [], "markerUR": [], "markerUL": []
}
*/
router.post('/saveMarkers/image/:imageId', function(req, res) {
  var query = {
    images: req.params.imageId
  };
  var update = {
    markerDL: req.body.markerDL,
    markerDR: req.body.markerDR,
    markerUR: req.body.markerUR,
    markerUL: req.body.markerUL
  };
  overlay.findOneAndUpdate(query, update, function(err, result) {
    if (err) return console.log(err);
    res.json(result);
  });
});

/*
This method is callen when user UPLOADS NEW IMAGE
Example req.body:
{
	"latitude": 42.50728814995593,
	"longitude": -2.615544718971247
}
*/
router.post('/uploadImage/image/:imageId', function(req, res) {
  var query = {
    latitude: req.body.latitude,
    longitude: req.body.longitude
  };
  var update = {
    $push: { images: req.params.imageId }
  };
  var options = { upsert: true, new: true };
  overlay.findOneAndUpdate(query, update, options, function(err, result) {
    if (err) return console.log(err);
    res.json(result);
  });
});

/* DELETE /overlays/all ALL overlays */
router.delete('/all', function(req, res) {
  overlay.find(function (err, overlays) {
    if (err) return next(err);
    overlays.forEach( function (overlayElement) {
      overlayElement.remove(function (err, overlay) {
        if (err) {
          return console.log(err);
        } else {
          res.json({ message: 'All overlays DELETED' });
        }
      });
    });
  });
});

/* DELETE /overlays/overlayId */
router.delete('/:id', function(req, res) {
  overlay.findById(req.params.id, function(err, overlay) {
    if (err) return console.log(err);
    overlay.remove(function(err, overlay) {
      if (err) return console.log(err);
      res.json({ message: 'overlay ' + overlay + ' deleted.'});
    });
  });
});

module.exports = router;
