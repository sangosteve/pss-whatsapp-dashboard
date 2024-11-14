// Threads.tsx

import React, { useEffect } from "react";
import { Bell, Check, Inbox, Settings, CircleUser } from "lucide-react";
import useContactsStore from "../store/contactsStore";
import { io, Socket } from 'socket.io-client';
import SearchField from "./SearchField";

const SOCKET_SERVER_URL = 'http://localhost:4000';

const Threads: React.FC = () => {
    const { contacts, fetchContacts, selectContact, updateContactLastMessage } = useContactsStore();
    const [socket, setSocket] = React.useState<Socket | null>(null);

    // Fetch contacts on component mount
    useEffect(() => {
        fetchContacts();

        // Connect to the socket server
        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        // Listen for chat message updates
        newSocket.on("chat message", (newMessage) => {
            // Here you might handle adding the new message to a global or local message state if needed
            console.log("New message received:", newMessage); // For debugging
            // Optionally update the contact's last message if needed
            if (newMessage.contactId) {
                updateContactLastMessage(newMessage);
            }
        });

        // Listen for contact updates
        newSocket.on("contact updated", (updatedContact) => {
            // Ensure updatedContact includes the full `lastMessage` object (with `text` and `timestamp`)
            console.log("testing new message:", updatedContact)
            if (updatedContact?.lastMessage?.text && updatedContact?.lastMessage?.timestamp) {
                updateContactLastMessage(updatedContact); // Update the last message for the contact
            }
        });

        // Cleanup on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, [fetchContacts, updateContactLastMessage]);

    return (
        <div className="grow lg:shrink-0 schrollbar-hide overflow-y-auto lg:max-w-xs lg:border-r">
            <div className="flex flex-col gap-3 px-6 py-4 bg-zinc-100 md:bg-white sticky top-0 z-10 ">
                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-xl">Chats</h1>
                    <div className="flex items-center gap-3 text-zinc-400">
                        <a><Bell className="w-5 h-5" /></a>
                        <a><Settings className="w-5 h-5" /></a>
                    </div>
                </div>
                <SearchField />
            </div>

            <div className="py-6">
                {/* Dynamically render contacts */}
                {contacts.map((contact) => (
                    <div
                        key={contact._id}
                        className="flex py-3 px-6 border-b border-zinc-100 hover:bg-zinc-100 transition-all cursor-pointer"
                        onClick={() => selectContact(contact._id)}
                    >
                        <div className="relative w-12 h-12 shrink-0 before:absolute before:w-3 before:h-3 before:rounded-full before:bottom-0 before:right-0 before:bg-green-500 before:border-2 before:border-white">
                            {/* <img src={pImage} className="w-full h-full rounded-full overflow-hidden object-cover" alt="Contact" /> */}
                            <div className="w-full h-full rounded-full flex items-center justify-center bg-zinc-300">
                                <CircleUser className="w-8 h-8 text-zinc-400" />
                            </div>
                        </div>
                        <div className="grow pl-4">
                            <div className="flex items-center justify-between">
                                <span className="text font-bold">{contact.name}</span>
                                <span className="text-xs text-zinc-400 font-medium shrink-0">
                                    {contact.lastMessage && contact.lastMessage?.timestamp
                                        ? new Date(contact.lastMessage?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : 'No messages'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>
                                    {contact.lastMessage?.text || 'No messages yet'}
                                </span>
                                <div className="relative flex items-center justify-center w-4 h-4 shrink-0 text-green-500">
                                    <Check />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6">
                <p className="flex items-center text-zinc-400">
                    <Inbox className="w-5 h-5" />
                    <span className="uppercase text-sm font-medium ml-3">All Messages</span>
                </p>
            </div>
        </div>
    );
};

export default Threads;

