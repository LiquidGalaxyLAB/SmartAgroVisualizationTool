var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var image = require('../models/image.js');

var albumSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: String,
  images: { type: [Schema.ObjectId], unique: true,
    ref: 'image', required: true },
});

albumSchema.query.byName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
}

module.exports = mongoose.model('album', albumSchema);
