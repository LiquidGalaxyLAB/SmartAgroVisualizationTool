var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var image = require('../models/image.js');

var overlaySchema = new Schema({
  markerDL: { type: [Number] },
  markerDR: { type: [Number] },
  markerUR: { type: [Number] },
  markerUL: { type: [Number] },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  images: { type: [Schema.ObjectId],
    ref: 'image', required: true },
});

/* MarkerDL => Marker Down Left (Image corner) */

module.exports = mongoose.model('overlay', overlaySchema);
