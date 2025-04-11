// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    size: { 
        type: String, 
        required: true,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] 
    },
    categoryName: { 
        type: String, 
        required: true,
        ref: 'Category'
    },
    subcategoryName: { 
        type: String, 
        required: true,
        ref: 'Subcategory'
    },
    condition: { 
        type: String, 
        required: true,
        enum: ['New with tags', 'Like new', 'Good', 'Fair', 'Poor'] 
    },
    images: [String],
    status: { 
        type: String, 
        default: "Available",
        enum: ["Available", "Sold", "Reserved"] 
    },
    createdAt: { type: Date, default: Date.now }
});

// Validation to ensure subcategory belongs to the selected category
productSchema.pre('save', async function(next) {
    try {
        const Subcategory = mongoose.model('Subcategory');
        const subcategory = await Subcategory.findOne({ 
            name: this.subcategoryName,
            categoryName: this.categoryName
        });
        
        if (!subcategory) {
            throw new Error(`Subcategory ${this.subcategoryName} does not belong to category ${this.categoryName}`);
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Product', productSchema);