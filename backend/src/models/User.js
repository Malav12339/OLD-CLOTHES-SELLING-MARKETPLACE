const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    address: { type: String, default: "NOT PROVIDED" },
    phone: { type: String, default: "NOT PROVIDED" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

module.exports = mongoose.model('User', userSchema);