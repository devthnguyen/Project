const mongoose = require('mongoose');
const cpuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  score: { type: Number, required: true },
  socket: { type: String, required: true },
  cores: { type: Number, required: true },
  threads: { type: Number, required: true },
  baseClock: { type: Number, required: true },
  boostClock: { type: Number, required: true },
  tdp: { type: Number, required: true }
});
module.exports = mongoose.model('CPU', cpuSchema);