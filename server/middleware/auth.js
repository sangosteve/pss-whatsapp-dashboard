// middleware/auth.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	// Get the token from the Authorization header (formatted as "Bearer <token>")
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ msg: "Access Denied: No Token Provided" });
	}

	try {
		// Verify the token using the secret
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.user.id; // Attach the user ID to the request object
		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		res.status(403).json({ msg: "Invalid Token" });
	}
};

module.exports = verifyToken;
