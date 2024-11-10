// models/message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		contact: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Contact", // Reference to the Contact model
			required: true,
		},
		sender: {
			type: String,
			enum: ["user", "contact"], // Either the user (agent) or the contact
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Reference to the User model (only populated if sender is user)
		},
		text: {
			type: String,
			required: true,
		},
		timestamp: {
			type: Date,
			default: Date.now, // Default timestamp
		},
	},
	{ timestamps: true }
);

// Static method to populate messages with user and contact details
messageSchema.statics.populateMessageDetails = async function (messageId) {
	return await this.findById(messageId)
		.populate("contact") // Populate contact details
		.populate("userId", "name email") // Populate user details (if sender is user)
		.exec();
};

module.exports = mongoose.model("Message", messageSchema);
