// src/api/contactsAPI.ts
import { Contact } from "../types/Contacts";

const API_BASE_URL = "http://localhost:4000/api/contacts"; // Replace with your backend API base URL

// Helper to get the token, this can be from localStorage, Zustand, or a prop passed to the functions
const getToken = (): string | null => {
	return localStorage.getItem("token"); // Assuming token is stored in localStorage
};

// Fetch contacts
export const fetchContactsFromAPI = async (): Promise<Contact[]> => {
	const token = getToken();

	try {
		const response = await fetch(`${API_BASE_URL}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) throw new Error("Failed to fetch contacts");
		const data = await response.json();
		console.log("contacts data", data);
		return data as Contact[];
	} catch (error) {
		console.error("Error fetching contacts:", error);
		return [];
	}
};

// Add a new contact
export const addContactToAPI = async (
	contact: Omit<Contact, "_id">
): Promise<Contact | null> => {
	const token = getToken();

	try {
		const response = await fetch(`${API_BASE_URL}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(contact),
		});
		if (!response.ok) throw new Error("Failed to add contact");
		const data = await response.json();
		return data as Contact;
	} catch (error) {
		console.error("Error adding contact:", error);
		return null;
	}
};
