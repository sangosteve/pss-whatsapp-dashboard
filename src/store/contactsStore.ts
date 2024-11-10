// src/store/contactsStore.ts

import { create } from "zustand";
import { Contact } from "../types/Contacts";
import { fetchContactsFromAPI, addContactToAPI } from "../api/contactsAPI";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");
interface ContactsStore {
	contacts: Contact[];
	selectedContact: Contact | null;
	fetchContacts: () => Promise<void>;
	selectContact: (id: string) => void;
	addContact: (contact: Omit<Contact, "_id">) => Promise<void>;
	updateContactLastMessage: (updatedContact: Contact) => void; // Action to update lastMessage
}

const useContactsStore = create<ContactsStore>((set) => ({
	contacts: [],
	selectedContact: null,

	fetchContacts: async () => {
		const fetchedContacts = await fetchContactsFromAPI();
		set({ contacts: fetchedContacts });
	},

	selectContact: (id: string) => {
		set((state) => ({
			selectedContact:
				state.contacts.find((contact) => contact._id === id) || null,
		}));
	},

	addContact: async (contact) => {
		const newContact = await addContactToAPI(contact);
		if (newContact) {
			set((state) => ({ contacts: [...state.contacts, newContact] }));
		}
	},

	// Updated function to ensure lastMessage is correctly updated
	updateContactLastMessage: (updatedContact: Contact) => {
		set(
			(state) => ({
				contacts: state.contacts.map((contact) =>
					contact._id === updatedContact._id
						? {
								...contact,
								lastMessage: updatedContact.lastMessage, // Ensure that the full lastMessage is included
						  }
						: contact
				),
			}),
			false
		); // Optionally force re-render
	},
}));

export default useContactsStore;
