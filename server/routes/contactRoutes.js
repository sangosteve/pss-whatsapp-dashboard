// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");
const verifyToken = require("../middleware/auth");
// Create a new contact
router.post("/", verifyToken, async (req, res) => {
	console.log(req);
	const { name, phoneNumber } = req.body;
	try {
		const contact = new Contact({ name, phoneNumber });
		await contact.save();
		res.status(201).json(contact);
	} catch (error) {
		console.error("Error creating contact:", error);
		res
			.status(500)
			.json({ message: "Error creating contact", error: error.message });
	}
});

// Get all contacts
router.get("/", verifyToken, async (req, res) => {
	try {
		const contacts = await Contact.find().populate("lastMessage");
		res.status(200).json(contacts);
	} catch (error) {
		console.error("Error fetching contacts:", error);
		res
			.status(500)
			.json({ message: "Error fetching contacts", error: error.message });
	}
});

// Update a contact by ID
router.put("/:id", verifyToken, async (req, res) => {
	const { id } = req.params;
	const { name, phoneNumber } = req.body;
	try {
		const updatedContact = await Contact.findByIdAndUpdate(
			id,
			{ name, phoneNumber },
			{ new: true }
		);
		res.status(200).json(updatedContact);
	} catch (error) {
		console.error("Error updating contact:", error);
		res
			.status(500)
			.json({ message: "Error updating contact", error: error.message });
	}
});

// Delete a contact by ID
router.delete("/:id", verifyToken, async (req, res) => {
	const { id } = req.params;
	try {
		await Contact.findByIdAndDelete(id);
		res.status(200).json({ message: "Contact deleted successfully" });
	} catch (error) {
		console.error("Error deleting contact:", error);
		res
			.status(500)
			.json({ message: "Error deleting contact", error: error.message });
	}
});

module.exports = router;
