var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  url: { type: String, unique: true, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  altitude: Number,
});

/* MarkerDL => Marker Down Left (Image corner) */

imageSchema.query.byName = function(originalName) {
  return this.find({ originalName: new RegExp(originalName, 'i') });
}

module.exports = mongoose.model('image', imageSchema);
