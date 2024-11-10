const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { validationResult } = require("express-validator");

// Register a new user
exports.registerUser = async (req, res) => {
	const { name, email, password } = req.body;

	// Check if any validation errors occurred
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		// Check if the user already exists
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ msg: "User already exists" });
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create a new user
		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		});

		// Save the user to the database
		await newUser.save();

		// Generate JWT
		const payload = {
			user: {
				id: newUser._id,
			},
		};
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.status(201).json({ token }); // Send back the token
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// Login a user
exports.loginUser = async (req, res) => {
	const { email, password } = req.body;

	// Check if the user exists
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(400).json({ msg: "Invalid credentials" });
	}

	// Check if password matches
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return res.status(400).json({ msg: "Invalid credentials" });
	}

	// Generate JWT
	const payload = {
		user: {
			id: user._id,
		},
	};
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});

	res.json({ token });
};
