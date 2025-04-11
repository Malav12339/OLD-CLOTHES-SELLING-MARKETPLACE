const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "SECRET_KEY";
const JWT_SECRET_ADMIN = "ADMIN_SECRET_KEY"

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(403).json({ message: "All fields required" });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error signing up" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = (password == user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign({ userId: user._id, userName: user.name }, JWT_SECRET);
        res.status(200).json({ token, user: user.name });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error logging in" });
    }
};

exports.getName = (req, res) => {
    return res.send(req.userName);
};

exports.adminSignup = async(req, res) => {
    try {
        const {name, email, password, role} = req.body;
        if(!name || !email || !password) {
            return res.status(403).json({ message: "All fields required" });
        }
        const existingAdmin = await User.findOne({ type: "admin", email: email });
        if(existingAdmin) 
            return res.status(400).json({message: "Email already registered for admin" });
        
        if(role != "admin") 
            return res.status(403).json({ message: "Only admin role is allowed" });
        
        const newAdmin = new User({ name, email, password, role: "admin" })
        await newAdmin.save()
        return res.status(201).json({message: "Admin registered successfully"})
    } catch(error) {
        res.status(500).json({ message: "Error signing up Admin" });
    }
}

exports.adminLogin = async(req, res) => {
    try {
        const { email, password, role } = req.body;
        if(!email || !password || role != "admin") 
            return res.status(403).json({ message: "All fields required and only admin role is allowed"})
        
        const admin = await User.findOne({ email, role: "admin" });
        if(!admin) {
            return res.status(400).json({msg: "Invalid credentials"})
        }
        const isMatched = (admin.password == password)
        if(!isMatched)
            return res.status(400).json({msg: "Invalid credentials"})
        const token = jwt.sign({ userId: admin._id, userName: admin.name }, JWT_SECRET_ADMIN )
        return res.status(200).json({token, user: admin.name})
    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: "Error logging in Admin" });
    }
}