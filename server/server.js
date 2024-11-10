// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const mongoose = require("mongoose");
const Message = require("./models/message"); // Import the Message model
const Contact = require("./models/contact"); // Import the Contact model
const messageRoutes = require("./routes/messageRoutes"); // Import message routes
//const whatsappRoutes = require("./routes/whatsappRoutes");

//WHATSAPP ROUTES IMPORTS
const { saveMessageToDB } = require("./utils/messageUtils");
const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(
	cors({
		origin: "http://localhost:5173", // Allow requests from your frontend's origin
	})
);

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use("/api/contacts", contactRoutes);
app.use("/api/auth", authRoutes);
app.use(userRoutes);
app.use("/api/messages", messageRoutes); // Register the message routes here
//app.use("/api/whatsapp", whatsappRoutes);

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*", // React app URL
		methods: ["GET", "POST"],
	},
});

// Move the export before server starts
module.exports = { io };

const mongoURI =
	"mongodb+srv://blackjack:blackjack@cluster0.aor3g.mongodb.net/leadhub?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB URI
mongoose
	.connect(mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((error) => console.error("MongoDB connection error:", error));

io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);

	// Send initial chat history
	Message.find()
		.populate("contact")
		.populate("userId", "name email")
		.sort({ timestamp: 1 })
		.then((messages) => {
			socket.emit("initial messages", messages);
		})
		.catch((err) => console.error("Error fetching messages:", err));

	// Handle sending of new messages
	socket.on("chat message", async (msg) => {
		const message = new Message({
			contact: msg.contact,
			sender: msg.sender,
			userId: msg.sender === "user" ? msg.userId : null,
			text: msg.text,
			timestamp: new Date(),
		});

		try {
			await message.save();

			// Update the contact's lastMessage field
			const updatedContact = await Contact.findByIdAndUpdate(
				msg.contact,
				{ lastMessage: message._id },
				{ new: true }
			).populate("lastMessage");

			// Emit the new message and updated contact to all clients
			io.emit("chat message", message); // Emit the new message

			io.emit("contact updated", updatedContact); // Emit updated contact with last message
		} catch (error) {
			console.error("Error saving message:", error);
		}
	});

	socket.on("disconnect", () => {
		console.log("A user disconnected:", socket.id);
	});
});

// WHATSAPP ROUTES

// Send a message through WhatsApp and save it to DB
app.post("/api/whatsapp/send-message", async (req, res, next) => {
	const { contactId, message, userId } = req.body;

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

// Webhook Route for WhatsApp
app.get("/api/whatsapp/webhook", (req, res) => {
	const mode = req.query["hub.mode"];
	const verifyToken = req.query["hub.verify_token"];
	const challenge = req.query["hub.challenge"];

	if (
		mode &&
		verifyToken &&
		mode === "subscribe" &&
		verifyToken === process.env.WHATSAPP_VERIFY_TOKEN
	) {
		console.log("Verification passed");
		return res.status(200).send(challenge); // Send back the challenge value
	}

	console.log("Verification failed. Token mismatch");
	return res.status(403).send("Forbidden");
});

// Webhook Endpoint to Receive Messages from WhatsApp

app.post("/api/whatsapp/webhook", async (req, res) => {
	const messageEvent = req.body;

	try {
		// Extract message details from the webhook
		const messageData = messageEvent.entry[0].changes[0].value.messages[0];

		// Check if there is text in the message
		if (messageData && messageData.text) {
			const { from, text, timestamp } = messageData;

			// Ensure the 'from' number starts with '+' for consistency
			let senderPhone = from;
			if (senderPhone && !senderPhone.startsWith("+")) {
				senderPhone = "+" + senderPhone; // Prepend '+' if missing
			}

			// Extract the actual text from the text object
			const messageText = text.body;

			// Convert the Unix timestamp to milliseconds
			const messageTimestamp = new Date(timestamp * 1000); // Convert to milliseconds

			// Check if the timestamp is valid
			if (isNaN(messageTimestamp.getTime())) {
				throw new Error("Invalid timestamp: " + timestamp);
			}

			// Check if a contact with this phone number already exists
			let contact = await Contact.findOne({ phoneNumber: senderPhone });

			if (!contact) {
				// If contact does not exist, create a new contact
				contact = await Contact.create({
					phoneNumber: senderPhone, // Use the phone number from the message
					name: senderPhone, // Default name, you can improve this logic as needed
				});
			}

			// Save the incoming message to MongoDB
			const savedMessage = new Message({
				contact: contact._id, // The contact who sent the message
				sender: "contact", // Sender type (contact)
				text: messageText, // Message text
				timestamp: messageTimestamp, // Use the parsed timestamp
			});

			// Save the message in the database
			await savedMessage.save();

			// Update the contact's lastMessage field to point to this newly saved message
			const updatedContact = await Contact.findByIdAndUpdate(
				contact._id,
				{ lastMessage: savedMessage._id },
				{ new: true }
			).populate("lastMessage"); // Populate the lastMessage to include its details

			// Emit the incoming message via Socket.IO for real-time updates
			io.emit("chat message", savedMessage);
			io.emit("contact updated", updatedContact);

			// Respond with status 200 (success) to WhatsApp's request
			return res.sendStatus(200);
		} else {
			// If the message does not contain text, just acknowledge the webhook
			return res.sendStatus(200);
		}
	} catch (error) {
		console.error("Error handling incoming message:", error);
		return res.status(500).send("Internal Server Error");
	}
});

const PORT = 4000;
server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
