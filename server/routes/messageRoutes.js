// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const Contact = require("../models/contact"); // We might need to populate the contact details
const verifyToken = require("../middleware/auth"); // Optional, if you need authentication

// Fetch all messages for a specific contact
router.get("/:contactId", verifyToken, async (req, res) => {
	const { contactId } = req.params;

	try {
		const messages = await Message.find({ contact: contactId })
			.populate("contact") // Populate contact details
			.populate("userId", "name email") // Populate user details if present
			.sort({ timestamp: 1 }); // Sorting messages by timestamp in ascending order

		res.status(200).json(messages);
	} catch (error) {
		console.error("Error fetching messages:", error);
		res
			.status(500)
			.json({ message: "Error fetching messages", error: error.message });
	}
});

// Send a message to a contact (Create message)
router.post("/", verifyToken, async (req, res) => {
	const { contactId, sender, userId, text } = req.body;

	if (!contactId || !sender || !text) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	try {
		const message = new Message({
			contact: contactId,
			sender,
			userId: sender === "user" ? userId : null,
			text,
			timestamp: new Date(),
		});

		await message.save();

		// Update the contact's lastMessage field
		const updatedContact = await Contact.findByIdAndUpdate(
			contactId,
			{ lastMessage: message._id },
			{ new: true }
		).populate("lastMessage");

		// Emit the new message and updated contact to all connected clients
		io.emit("chat message", message); // Emit new message
		console.log("Emitting contact updated:", updatedContact);
		io.emit("contact updated", updatedContact); // Emit updated contact with last message

		res.status(201).json(message);
	} catch (error) {
		console.error("Error sending message:", error);
		res
			.status(500)
			.json({ message: "Error sending message", error: error.message });
	}
});

// Delete a message by ID (Optional)
router.delete("/:id", verifyToken, async (req, res) => {
	const { id } = req.params;

	try {
		const message = await Message.findByIdAndDelete(id);
		if (!message) {
			return res.status(404).json({ message: "Message not found" });
		}

		res.status(200).json({ message: "Message deleted successfully" });
	} catch (error) {
		console.error("Error deleting message:", error);
		res
			.status(500)
			.json({ message: "Error deleting message", error: error.message });
	}
});

module.exports = router;
