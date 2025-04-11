const Report = require("../models/Report"); // Import Report model
const User = require("../models/User"); // Import User model
const Product = require("../models/Product"); // Import Product model

async function addReport(req, res) {
    try {
        const { reportedSellerId, reportedProductId, reason } = req.body;
        const reporterId = req.userId; // Assuming authentication middleware sets `req.user.id`

        if (!reportedSellerId || !reason) {
            return res.status(400).json({ message: "Seller ID and reason are required" });
        }

        // Check if the seller exists
        const sellerExists = await User.findById(reportedSellerId);
        if (!sellerExists) {
            return res.status(404).json({ message: "Reported seller does not exist" });
        }

        // If product is reported, check if it exists
        if (reportedProductId) {
            const productExists = await Product.findById(reportedProductId);
            if (!productExists) {
                return res.status(404).json({ message: "Reported product does not exist" });
            }
        }

        // Create and save the report
        const newReport = new Report({
            reporterId,
            reportedSellerId,
            reportedProductId: reportedProductId || null, // Optional
            reason
        });

        await newReport.save();

        return res.status(201).json({ message: "Report submitted successfully" });
    } catch (error) {
        console.error("Error reporting user/product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getReports(req, res) {
    try {
        const reports = await Report.find()
            .populate("reporterId", "name email") // Get reporter details
            .populate("reportedSellerId", "name email") // Get reported seller details
            .populate("reportedProductId", "title price"); // Get product details if available

        if (reports.length === 0) {
            return res.status(404).json({ message: "No reports found" });
        }

        return res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function updateReportStatus(req, res) {
    try {
        const { id } = req.params; // Report ID
        const { status } = req.body; // New status (e.g., "resolved" or "dismissed")

        // Validate status
        const validStatuses = ["resolved", "dismissed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Find the report and update its status
        const report = await Report.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        return res.status(200).json({ message: "Report status updated", report });
    } catch (error) {
        console.error("Error updating report status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = { addReport, getReports, updateReportStatus };