const mongoose = require('mongoose');
const ssdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  score: { type: Number, required: true },
  capacity: { type: Number, required: true },
  type: { type: String, required: true },
  readSpeed: { type: Number, required: true },
  writeSpeed: { type: Number, required: true }
});
module.exports = mongoose.model('SSD', ssdSchema);