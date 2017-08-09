var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sensor = require('../models/sensor.js');

/*
If your application frequently retrieves the sensors data with the field
name information, then your application needs to issue multiple queries to
resolve the references. A more optimal schema would be to embed the sensors
data entities in the field data, as in the following:
*/

var fieldSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: String,
  sensors: { type: [Schema.ObjectId], unique: true,
    ref: 'sensor', required: true },
});

fieldSchema.query.byName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
}

module.exports = mongoose.model('field', fieldSchema);
