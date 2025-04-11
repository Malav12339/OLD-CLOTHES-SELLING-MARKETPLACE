const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./src/config/db')

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const wishlistRoutes = require('./src/routes/wishlistRoutes');
const sellerRoutes = require('./src/routes/sellerRoutes')
const adminRoutes = require('./src/routes/adminRoutes')

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/seller', sellerRoutes)
app.use('/admin', adminRoutes)

// Serve images statically
app.use("/uploads", express.static("public/uploads"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});