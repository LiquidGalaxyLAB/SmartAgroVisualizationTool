var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var multer = require("multer");
var crypto = require("crypto");
var ExifImage = require('exif').ExifImage;

var mongoose = require('mongoose');
var image = require('../models/image.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/', function(req, res) {
  image.find(function (err, images) {
    if (err) return next(err);
    res.json(images);
  });
});

router.get('/:id', function(req, res) {

});

/* POST call of a image upload. It saves the image on the public/images/ folder
and gets its exif data to save it in database by the image data model.
The gps exif data extracted by ExifImage method should look like this:
gps:
   { GPSVersionID: [ 2, 3, 0, 0 ],
     GPSLatitudeRef: 'N',
     GPSLatitude: [ 42, 30, 28.56567593480345 ],
     GPSLongitudeRef: 'W',
     GPSLongitude: [ 2, 36, 54.22588235294118 ],
     GPSAltitude: 635.9818731117825,
     GPSTrack: 313.52734375 },
*/
router.post('/', multer({ dest: 'public/images/' }).single('upload'),
  function(req, res) {
    console.log(req.file);
    console.log(req.file.filename);

    try {
      new ExifImage({ image : 'public/images/' + req.file.filename }, function (error, exifData) {
          if (error)
              console.log('Error: '+error.message);
            else
              var imageBody = {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                gpsLatitude: ConvertDMSToDD(
                  exifData.gps.GPSLatitude[0], exifData.gps.GPSLatitude[1],
                  exifData.gps.GPSLatitude[2], exifData.gps.GPSLatitudeRef
                ),
                gpsLongitude: ConvertDMSToDD(
                  exifData.gps.GPSLongitude[0], exifData.gps.GPSLongitude[1],
                  exifData.gps.GPSLongitude[2], exifData.gps.GPSLongitudeRef
                ),
                gpsAltitude: exifData.gps.GPSAltitude,
              }
              console.log(imageBody);
              image.create(imageBody, function (err, post) {
                if (err) console.log(err);
                res.json(post);
              });
          });
    } catch (error) {
    console.log('Error: ' + error.message);
    }
    //res.json(req.file.originalname);
});

router.delete('/:id', function(req, res) {
  image.findById(req.params.id, function (err, image) {
    if (err) {
      return console.log(err);
    } else {
      image.remove(function (err, image) {
        if (err) {
          return console.log(err);
        } else {
          res.json({ message: 'Image ' + image.originalName + ' deleted' });
        }
      });
    }
  });
});

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes/60 + seconds/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

module.exports = router;
