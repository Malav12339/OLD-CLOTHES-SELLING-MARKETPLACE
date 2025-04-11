const User = require("../models/User")
const Product = require("../models/Product")
const jwt = require("jsonwebtoken")

exports.sellerInfo = async(req, res) => {
    
    const sellerId = req.params.id 
    if(!sellerId) return res.status(403).send({message: 'Seller ID is required'})
    
    try {
        const seller = await User.findById(sellerId)
        if(!seller) {
            return res.status(400).send({message: "Invalid credentials"})
        }
        return res.status(200).send(seller)
    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: "Error getting info of Admin" });
    }
}

exports.sellerProducts = async(req, res) => {
    const token = req.headers.authorization.split(' ')[1]

    try {
        const {userId} = jwt.decode(token)
        if(!userId) return res.status(403).send({message: 'Seller ID is required'})

        const userProds = await Product.find({sellerId: userId})
        res.status(200).send(userProds)
    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: "Error getting products of Seller" });
    }
}

exports.getUserData = async (req, res) => {
    try {
        // Check if Authorization header is provided
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const token = req.headers.authorization.split(' ')[1];
       
        // Verify JWT token
        const decoded = jwt.verify(token, "SECRET_KEY");
        const userId = decoded.userId;

        // Fetch user data
        const user = await User.findById(userId) // Exclude password if stored
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user); // Send user data
    } catch (error) {
        return res.status(403).json({
            message: "Unauthorized user",
            error: error.message
        });
    }
};
