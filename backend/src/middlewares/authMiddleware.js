const jwt = require('jsonwebtoken');
const JWT_SECRET = "SECRET_KEY";
const JWT_SECRET_ADMIN = "ADMIN_SECRET_KEY";

function validateUser(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    const userToken = authHeader.split(' ')[1];

    try {
        // Try verifying with user secret
        const decoded = jwt.verify(userToken, JWT_SECRET);
        req.userName = decoded.userName;
        req.userId = decoded.userId;
        req.role = "user"; // Assign role
        return next();
    } catch (userTokenErr) {
        try {
            // If user verification fails, try with admin secret
            const decoded = jwt.verify(userToken, JWT_SECRET_ADMIN);
            req.userName = decoded.userName;
            req.userId = decoded.userId;
            req.role = "admin"; // Assign role
            return next();
        } catch (adminTokenErr) {
            return res.status(403).json({ message: "Unauthorized user" });
        }
    }
}

module.exports = validateUser;
