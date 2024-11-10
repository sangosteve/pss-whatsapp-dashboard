import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import ChatHeader from '../components/ChatHeader';
import ChatInput from '../components/ChatInput';
import ChatBubble from '../components/ChatBubble';
import useContactsStore from '../store/contactsStore';
import useMessagesStore from '../store/messagesStore';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Message } from "../types/Message";

const SOCKET_SERVER_URL = 'http://localhost:4000';

const Chat: React.FC = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { selectedContact } = useContactsStore();
    const selectedContactId = selectedContact?._id;

    const { messages, fetchMessages, addMessage } = useMessagesStore();



    useEffect(() => {
        if (!selectedContactId) return;

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const decodedToken: any = jwtDecode(token);
        setUserId(decodedToken.user.id);

        const newSocket = io(SOCKET_SERVER_URL, { auth: { token } });
        setSocket(newSocket);

        fetchMessages(selectedContactId);

        newSocket.on('initial messages', (initialMessages: Message[]) => {
            initialMessages
                .filter((msg) => msg.contact === selectedContactId)
                .forEach((msg) => addMessage(msg));
        });

        newSocket.on('chat message', (msg: Message) => {
            if (msg.contact === selectedContactId) {
                addMessage(msg);
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [navigate, selectedContactId, fetchMessages, addMessage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (messageText: string) => {
        if (!selectedContactId || !userId) return;

        const messageObject = {
            contactId: selectedContactId,
            message: messageText,
            userId: userId,
        };

        try {
            const response = await fetch("http://localhost:4000/api/whatsapp/send-message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(messageObject),
            });

            if (response.ok) {
                const data = await response.json();
                const { savedMessage } = data;

                // Update the UI with the newly saved message
                addMessage(savedMessage);
            } else {
                console.error("Failed to send message:", await response.json());
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };


    return (
        <div className="flex flex-col flex-grow h-screen">
            <ChatHeader />
            <div className="flex-grow overflow-y-auto bg-white dark:bg-zinc-900 p-4">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <ChatBubble
                            key={msg._id}
                            text={msg.text}
                            timestamp={new Date(msg.timestamp)}
                            sender={msg.sender}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default Chat;
