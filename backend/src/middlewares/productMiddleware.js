const Product = require('../models/Product');

async function isProductOwner(req, res, next) {
    // To check user is the product owner
    try {
        const productId = req.params.id;
        const userId = req.userId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (req.role === "admin" || product.sellerId.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this product" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Error verifying product ownership", error: error.message });
    }
}

module.exports = isProductOwner;