const Message = require("../models/message");

const saveMessageToDB = async (
	contactId,
	sender,
	text,
	timestamp = new Date(),
	userId = null
) => {
	return await Message.create({
		contact: contactId,
		sender,
		text,
		timestamp,
		userId: sender === "user" ? userId : null,
	});
};

module.exports = { saveMessageToDB };
