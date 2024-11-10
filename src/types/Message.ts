// src/types/Message.ts
export interface Message {
	_id: string;
	contact: string; // Contact ID reference
	sender: "user" | "contact";
	userId?: string; // Only populated if the sender is a user (agent)
	text: string;
	timestamp: Date;
}
