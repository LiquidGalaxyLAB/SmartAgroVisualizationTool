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
	"name": "author A",                         <-- Mandatory
	"description": "author A description.",     <-- Optional
  "logoUrl": "http://logo.com/author.png",    <-- Optional
  "albums": ["album-1-id", album-2-id", ... ] <-- Mandatory
}
*/
router.post('/', function(req, res, next) {
  // Check if POST call has logoUrl. If it does not, add a default one.
  if (req.body.logoUrl === undefined || req.body.logoUrl === '') req.body.logoUrl = 'https://png.icons8.com/old-time-camera/ios7/100'
  author.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /authors/all ALL authors */
router.delete('/all', function(req, res) {
  author.find(function (err, authors) {
    if (err) return next(err);
    authors.forEach( function (authorElement) {
      authorElement.remove(function (err, author) {
        if (err) {
          return console.log(err);
        } else {
          res.json({ message: 'All authors DELETED' });
        }
      });
    });
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
