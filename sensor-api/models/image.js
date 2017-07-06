var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  originalName: String,
  fileName: String,
  gpsLatitude: Number,
  gpsLongitude: Number,
  gpsAltitude: Number,
});

imageSchema.query.byName = function(originalName) {
  return this.find({ originalName: new RegExp(originalName, 'i') });
}

module.exports = mongoose.model('image', imageSchema);
