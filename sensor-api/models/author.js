var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var album = require('../models/album.js');

var authorSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: String,
  albums: { type: [Schema.ObjectId], unique: true,
    ref: 'album', required: true },
});

authorSchema.query.byName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
}

module.exports = mongoose.model('author', authorSchema);
