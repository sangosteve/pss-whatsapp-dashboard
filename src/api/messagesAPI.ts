// src/api/messagesAPI.ts
import { Message } from "../types/Message";

const API_BASE_URL = "http://localhost:4000/api/messages"; // Update to your actual backend API URL

// Helper to get the token, assuming it's stored in localStorage
const getToken = (): string | null => {
	return localStorage.getItem("token");
};

// Fetch messages for a specific contact
export const fetchMessagesFromAPI = async (
	contactId: string
): Promise<Message[]> => {
	const token = getToken();

	try {
		const response = await fetch(`${API_BASE_URL}/${contactId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) throw new Error("Failed to fetch messages");
		const data = await response.json();
		return data as Message[];
	} catch (error) {
		console.error("Error fetching messages:", error);
		return [];
	}
};

// Send a new message
export const sendMessageToAPI = async (
	message: Omit<Message, "_id">
): Promise<Message | null> => {
	const token = getToken();

	try {
		const response = await fetch(`${API_BASE_URL}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(message),
		});
		if (!response.ok) throw new Error("Failed to send message");
		const data = await response.json();
		return data as Message;
	} catch (error) {
		console.error("Error sending message:", error);
		return null;
	}
};
