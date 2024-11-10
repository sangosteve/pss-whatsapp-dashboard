// src/store/messagesStore.ts
import { create } from "zustand";
import { Message } from "../types/Message";
import { fetchMessagesFromAPI, sendMessageToAPI } from "../api/messagesAPI";

interface MessagesStore {
	messages: Message[];
	fetchMessages: (contactId: string) => Promise<void>;
	addMessage: (message: Message) => void;
	sendMessage: (message: Omit<Message, "_id">) => Promise<void>;
}

const useMessagesStore = create<MessagesStore>((set) => ({
	messages: [],

	fetchMessages: async (contactId: string) => {
		const fetchedMessages = await fetchMessagesFromAPI(contactId);
		set({ messages: fetchedMessages });
	},

	addMessage: (message) => {
		// Directly add message to local messages
		set((state) => ({ messages: [...state.messages, message] }));
	},

	sendMessage: async (message) => {
		// Send the message to the backend API but do not wait for the response
		await sendMessageToAPI(message);
	},
}));

export default useMessagesStore;
