const mongoose = require('mongoose');
const ramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  score: { type: Number, required: true },
  capacity: { type: Number, required: true },
  speed: { type: Number, required: true },
  type: { type: String, required: true }
});
module.exports = mongoose.model('RAM', ramSchema);