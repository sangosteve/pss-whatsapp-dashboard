// routes/user.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const User = require("../models/user"); // Assuming you have a User model

// GET /api/user - Protected route to get user details
router.get("/api/user", verifyToken, async (req, res) => {
	try {
		console.log("user id:", req.userId);
		const user = await User.findById(req.userId).select("-password"); // Exclude password field
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		res.json({
			name: user.name,
			email: user.email,
			avatar: user.avatar, // Ensure avatar URL is available
		});
	} catch (error) {
		console.error("Error fetching user details:", error);
		res.status(500).json({ msg: "Server error" });
	}
});

module.exports = router;
