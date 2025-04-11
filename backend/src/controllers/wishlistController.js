const User = require('../models/User');
const Product = require('../models/Product');

exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const productId = req.params.productId;

        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        if (user.wishlist.includes(productId)) {
            return res.status(409).json({
                message: "Product already in wishlist",
            });
        }

        user.wishlist.push(productId);
        await user.save();

        res.status(200).json({
            message: "Product added to wishlist",
        });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({
            message: "Error adding to wishlist",
            error: error.message,
        });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const productId = req.params.productId;

        const user = await User.findById(userId);
        if(!user.wishlist.includes(productId)) {
            return res.status(411).json({
                message: "product is not in the wishlist"
            });
        }
        
        const product = await Product.findById(productId);
        if(!product) {
            return res.status(404).json({
                message: "NO product found"
            });
        }

        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        res.json({ message: "Product removed from wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing from wishlist" });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('wishlist');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: "Error fetching wishlist" });
    }
};