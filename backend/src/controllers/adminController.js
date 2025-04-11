const Product = require("../models/Product");
const User = require("../models/User");
const Report = require("../models/Report");

async function removeReportedProduct(req, res) {
    try {
        const { id } = req.params; // Reported product ID

        // Check if the product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Remove the product from the database
        await Product.findByIdAndDelete(id);

        // Optionally, remove related reports
        await Report.deleteOne({ reportedProductId: id });

        return res.status(200).json({ message: "Reported product removed successfully" });
    } catch (error) {
        console.error("Error removing reported product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function removeReportedSeller(req, res) {
    try {
        const { id } = req.params; // Reported seller ID

        // Check if the seller exists
        const seller = await User.findById(id);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        // Remove the seller from the database
        await User.findByIdAndDelete(id);

        // Optionally, remove related reports
        await Report.deleteMany({ reportedSellerId: id });

        return res.status(200).json({ message: "Reported seller removed successfully" });
    } catch (error) {
        console.error("Error removing reported seller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {removeReportedProduct, removeReportedSeller};