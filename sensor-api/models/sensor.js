var mongoose = require('mongoose');

/* Sensor attribute types found on Libelium's Waspmote smart agriculture device
datasheet (page 26):
http://www.libelium.com/downloads/documentation/waspmote_datasheet.pdf */

var sensorSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  locationLatitude: { type: Number, required: true },
  locationLongitude: { type: Number, required: true },
  valueAirTemperature: Number,
  valueAirHumidity: Number,
  valueAirPressure: Number,
  valueSoilTemperature: Number,
  valueLeafWetness: Number,
  valueAtmosphericPressure: Number,
  valueSolarRadiation: Number,
  valueUltravioletRadiation: Number,
  valueTrunkDiameter: Number,
  valueStemDiameter: Number,
  valueFruitDiameter: Number,
  valueAnemometer: Number,
  valueWindVane: Number,
  valuePluviometer: Number,
  valueLuminosity: Number,
  valueUltrasound: Number,
  updated_at: { type: Date, default: Date.now },
});

sensorSchema.query.byName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
}

module.exports = mongoose.model('sensor', sensorSchema);
