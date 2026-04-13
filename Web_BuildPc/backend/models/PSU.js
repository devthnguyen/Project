const mongoose = require('mongoose');
const psuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  score: { type: Number, required: true },
  wattage: { type: Number, required: true },
  efficiency: { type: String, required: true },
  modular: { type: Boolean, required: true }
});
module.exports = mongoose.model('PSU', psuSchema);