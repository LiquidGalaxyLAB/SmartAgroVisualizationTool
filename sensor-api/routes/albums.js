var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var album = require('../models/album.js');
var image = require('../models/image.js');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
GET /albums simple listing.
GET /albums?detailed albums listing with all the images information.
*/
router.get('/', function(req, res) {
    album.find(function(err, albums) {
      if (err) return next(err);
      if (req.query.hasOwnProperty('detailed')) {
        image.populate(albums, {path: "images"}, function(err, albums) {
          if (err) return next(err);
          res.json(albums);
        });
      }
      else {
          res.json(albums);
      }
    });
});

/* GET /albums/albumName */
router.get('/:albumName', function(req, res) {
  album.find().byName(req.params.albumName).exec(function(err, album) {
    if (err) console.log(err);
    res.json(album);
  });
});

/* POST /albums
Example POST call:
{
	"name": "album A",                     <-- Mandatory album
	"description": "album A description."  <-- Optional album
}
*/
router.post('/', function(req, res, next) {
  album.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /albums/albumId */
router.delete('/:id', function(req, res) {
  album.findById(req.params.id, function(err, album) {
    if (err) return console.log(err);
    album.remove(function(err, album) {
      if (err) return console.log(err);
      res.json({ message: 'album ' + album.name + ' deleted.'});
    });
  });
});

module.exports = router;
