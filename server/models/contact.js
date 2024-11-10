// models/contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		phoneNumber: { type: String, required: true, unique: true },
		lastMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			// Default to null if no last message
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
