// models/Subcategory.js
const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },  // 't-shirts', 'jeans', etc.
  displayName: { type: String, required: true },  // 'T-Shirts', 'Jeans', etc.
  categoryName: { 
    type: String, 
    required: true,
    ref: 'Category'
  }
});

// This index makes sure we have unique subcategories per category
subcategorySchema.index({ name: 1, categoryName: 1 }, { unique: true });

module.exports = mongoose.model('Subcategory', subcategorySchema);