const jwt = require("jsonwebtoken");
const logger = require("../config/logger.js"); 

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const secret = process.env.SECRET_KEY;

    if (!authHeader) {
        logger.warn("Missing Authorization header");
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        logger.warn("Token missing from Authorization header");
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // Attach decoded token payload to req.user
        logger.info("Token verified successfully");
        next(); // Proceed to the next middleware or route
    } catch (err) {
        logger.warn(`Token verification failed: ${err.message}`);
        return res.status(403).json({ message: "Forbidden" });
    }
};

module.exports = { verifyToken };
