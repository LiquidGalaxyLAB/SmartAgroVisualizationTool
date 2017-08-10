var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var author = require('../models/author.js');
var album = require('../models/album.js');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
GET /authors simple listing.
GET /authors?detailed authors listing with all the albums information.
*/
router.get('/', function(req, res) {
    author.find(function(err, authors) {
      if (err) return next(err);
      if (req.query.hasOwnProperty('detailed')) {
        album.populate(authors, {path: "albums"}, function(err, authors) {
          if (err) return next(err);
          res.json(authors);
        });
      }
      else {
          res.json(authors);
      }
    });
});

/* GET /authors/authorId */
router.get('/:id', function(req, res) {
  author.findById(req.params.id, function (err, author) {
    if (err) console.log(err);
    res.json(author);
  });
});

/* GET /authors/name/authorName */
router.get('/name/:authorName', function(req, res) {
  author.find().byName(req.params.authorName).exec(function(err, author) {
    if (err) console.log(err);
    res.json(author);
  });
});

/* POST /authors
Example POST call:
{
	"name": "author A",                     <-- Mandatory author
	"description": "author A description."  <-- Optional author
}
*/
router.post('/', function(req, res, next) {
  author.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /authors/authorId */
router.delete('/:id', function(req, res) {
  author.findById(req.params.id, function(err, author) {
    if (err) return console.log(err);
    author.remove(function(err, author) {
      if (err) return console.log(err);
      res.json({ message: 'author ' + author.name + ' deleted.'});
    });
  });
});

module.exports = router;
