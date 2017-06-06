var mongoose = require('mongoose');

var sensorSchema = new mongoose.Schema({
  name: String,
  location: [Number],
  temperatureValue: Number,
  humidityValue: Number,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('sensor', sensorSchema);
