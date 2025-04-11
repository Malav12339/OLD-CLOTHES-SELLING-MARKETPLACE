const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reportedSellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reportedProductId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Optional
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "reviewed", "resolved"], default: "pending" },
    adminNote: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
