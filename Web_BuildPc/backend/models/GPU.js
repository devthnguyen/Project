const mongoose = require('mongoose');
const gpuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  score: { type: Number, required: true },
  vram: { type: Number, required: true },
  baseClock: { type: Number, required: true },
  boostClock: { type: Number, required: true },
  tdp: { type: Number, required: true }
});
module.exports = mongoose.model('GPU', gpuSchema);