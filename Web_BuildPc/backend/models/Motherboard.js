const mongoose = require('mongoose');
const motherboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  score: { type: Number, required: true },
  socket: { type: String, required: true },
  chipset: { type: String, required: true },
  ramType: { type: String, required: true },
  maxRam: { type: Number, required: true }
});
module.exports = mongoose.model('Motherboard', motherboardSchema);