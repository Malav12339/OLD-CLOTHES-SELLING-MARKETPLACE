// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // 'male', 'female', 'kids'
  displayName: { type: String, required: true }  // 'Men', 'Women', 'Kids'
});

module.exports = mongoose.model('Category', categorySchema);