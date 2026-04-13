// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  imageUrl: { type: String, required: true },
  isBestSeller: { type: Boolean, default: false }
});

module.exports = mongoose.model('Product', productSchema);