var mongoose = require('mongoose');

var sensorSchema = new mongoose.Schema({
  name: String,
  location: [Number],
  temperatureValue: Number,
  humidityValue: Number,
  updated_at: { type: Date, default: Date.now },
});

sensorSchema.query.byName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
}

module.exports = mongoose.model('sensor', sensorSchema);
