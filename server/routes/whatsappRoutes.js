const express = require("express");
const axios = require("axios");
const { saveMessageToDB } = require("../utils/messageUtils"); // Saving utility
const Contact = require("../models/contact"); // Contact model
const router = express.Router();
const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Send a message through WhatsApp and save it to DB
router.post("/send-message", async (req, res, next) => {
	const { contactId, message, userId } = req.body;

	console.log(req.body);

	try {
		// Find contact in MongoDB
		const contact = await Contact.findById(contactId);
		if (!contact) {
			return res.status(400).json({ error: "Contact not found" });
		}
		const phoneNumber = contact.phoneNumber;

		// Send message to WhatsApp API
		const whatsappResponse = await axios.post(
			`${WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
			{
				messaging_product: "whatsapp",
				to: phoneNumber,
				text: { body: message },
			},
			{ headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` } }
		);

		// Save sent message to MongoDB
		const savedMessage = await saveMessageToDB(
			contactId,
			"user",
			message,
			new Date(),
			userId
		);

		// Update the contact's lastMessage field with the new message
		const updatedContact = await Contact.findByIdAndUpdate(
			contactId,
			{ lastMessage: savedMessage._id },
			{ new: true }
		).populate("lastMessage");

		// Emit the updated contact over Socket.IO for real-time UI updates
		io.emit("contact updated", updatedContact);

		// Send response with both saved message and WhatsApp response
		res.status(200).json({
			message: "Message sent",
			savedMessage,
			whatsappResponse: whatsappResponse.data,
		});
	} catch (error) {
		next(error); // Pass to error handler middleware
	}
});

module.exports = router;
