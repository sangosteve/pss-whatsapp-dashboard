// ChatInput.tsx
import React, { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (messageText: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage(''); // Clear input after sending
        }
    };

    return (
        <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 px-4 py-3 z-10">
            <div className="flex items-center space-x-3">
                <button className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition">
                    <Paperclip className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                </button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-grow px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                    onClick={handleSend}
                    className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition"
                >
                    <Send className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
