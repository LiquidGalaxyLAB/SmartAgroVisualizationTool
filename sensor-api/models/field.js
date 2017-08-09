var mongoose = require('mongoose');

var fieldSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: String,
});

fieldSchema.query.byName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
}

module.exports = mongoose.model('field', fieldSchema);
