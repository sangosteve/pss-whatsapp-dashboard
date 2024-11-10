const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// Register route
router.post(
	"/register",
	[
		body("email").isEmail().withMessage("Enter a valid email"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters"),
	],
	registerUser
);

// Login route
router.post("/login", loginUser);

module.exports = router;
