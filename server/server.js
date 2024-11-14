// server.js
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const FormData = require("form-data"); // Import form-data library
const fs = require("fs");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const mongoose = require("mongoose");
const Message = require("./models/message"); // Import the Message model
const Contact = require("./models/contact"); // Import the Contact model
const messageRoutes = require("./routes/messageRoutes"); // Import message routes
//const whatsappRoutes = require("./routes/whatsappRoutes");
const upload = multer();
// WHATSAPP ROUTES IMPORTS
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
// app.use("/api/whatsapp", whatsappRoutes);

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
// WHATSAPP ROUTES

// Send a message through WhatsApp and save it to DB
app.post(
	"/api/whatsapp/send-message",
	upload.single("file"), // Multer handles the file upload
	async (req, res, next) => {
		const { contactId, message, userId } = req.body;
		const file = req.file; // This is the file uploaded

		try {
			// Find contact in MongoDB
			const contact = await Contact.findById(contactId);
			if (!contact) {
				return res.status(400).json({ error: "Contact not found" });
			}
			const phoneNumber = contact.phoneNumber;

			// Check if there is a file to send
			if (file) {
				const fileFormData = new FormData();
				const fileBuffer = Buffer.from(file.buffer);
				fileFormData.append("file", fileBuffer, {
					filename: file.originalname,
					contentType: file.mimetype,
				});

				// Determine the media type dynamically based on the file's MIME type
				let mediaType;
				if (file.mimetype.startsWith("image/")) {
					mediaType = "image";
				} else if (file.mimetype.startsWith("video/")) {
					mediaType = "video";
				} else if (file.mimetype.startsWith("audio/")) {
					mediaType = "audio";
				} else if (file.mimetype === "application/pdf") {
					mediaType = "document";
				} else {
					mediaType = "document"; // Default to document for unsupported file types
				}

				// Add the 'type' and 'messaging_product' parameters
				fileFormData.append("type", mediaType); // Set dynamic media type
				fileFormData.append("messaging_product", "whatsapp"); // Add this to specify it's for WhatsApp

				try {
					// Make the media upload request
					const mediaResponse = await axios.post(
						`${WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/media`,
						fileFormData,
						{
							headers: {
								Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
								// Do not set the Content-Type header manually when using FormData
							},
						}
					);

					const mediaId = mediaResponse.data.id;

					// Ensure messaging_product is included in the message body
					const messageBody = {
						messaging_product: "whatsapp", // Required parameter
						to: phoneNumber, // Replace with the recipient's phone number
						type: mediaType, // Use dynamic media type
						[mediaType]: {
							id: mediaId, // The ID of the uploaded media
						},
					};

					// Send the media message to WhatsApp
					const whatsappResponse = await axios.post(
						`${WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
						messageBody,
						{
							headers: {
								Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
							},
						}
					);

					console.log("WhatsApp message sent:", whatsappResponse.data);

					// Save the sent message to the database
					const savedMessage = await saveMessageToDB(
						contactId,
						"user",
						message || "File sent",
						new Date(),
						userId,
						file ? mediaId : null
					);

					// Update the contact's lastMessage field
					const updatedContact = await Contact.findByIdAndUpdate(
						contactId,
						{ lastMessage: savedMessage._id },
						{ new: true }
					).populate("lastMessage");

					// Emit updated contact over Socket.IO for real-time updates
					io.emit("contact updated", updatedContact);

					// Send response with saved message and WhatsApp response
					res.status(200).json({
						message: "Message sent",
						savedMessage,
						whatsappResponse: whatsappResponse.data,
					});
				} catch (error) {
					console.error(
						"Error while sending message:",
						error.response ? error.response.data : error.message
					);
					next(error);
				}
			} else {
				// If no file, send a text message
				const whatsappResponse = await axios.post(
					`${WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
					{
						messaging_product: "whatsapp", // Ensure messaging_product is included here
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

				// Update the contact's lastMessage field
				const updatedContact = await Contact.findByIdAndUpdate(
					contactId,
					{ lastMessage: savedMessage._id },
					{ new: true }
				).populate("lastMessage");

				// Emit updated contact over Socket.IO
				io.emit("contact updated", updatedContact);

				// Send response with saved message and WhatsApp response
				res.status(200).json({
					message: "Message sent",
					savedMessage,
					whatsappResponse: whatsappResponse.data,
				});
			}
		} catch (error) {
			next(error); // Pass to error handler middleware
		}
	}
);

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
	const entry = req.body.entry[0];
	const changes = entry.changes[0];
	const value = changes.value;
	const messageData = value.messages ? value.messages[0] : null;

	if (messageData) {
		const { from, id, timestamp, text } = messageData;

		const contact = await Contact.findOne({ phoneNumber: "+" + from });

		if (contact) {
			// Save the incoming message in MongoDB
			const savedMessage = new Message({
				contact: contact._id,
				sender: "contact",
				text: text.body,
				timestamp: new Date(timestamp * 1000),
			});
			await savedMessage.save();

			// Update the contact's last message reference
			// Update the contact's last message reference
			contact.lastMessage = savedMessage._id;
			await contact.save();

			// Retrieve and populate the updated contact with lastMessage details
			const updatedContact = await Contact.findById(contact._id).populate({
				path: "lastMessage",
				select: "text timestamp", // Only retrieve text and timestamp fields
			});

			// Emit the new message and updated contact with populated lastMessage to all clients
			io.emit("chat message", savedMessage);
			io.emit("contact updated", updatedContact);
		}
	}

	res.status(200).send("EVENT_RECEIVED");
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
