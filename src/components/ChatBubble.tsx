import React from 'react';

interface ChatBubbleProps {
    text: string;
    timestamp: Date;
    sender: 'user' | 'contact'; // "user" for own message, "contact" for incoming
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, timestamp, sender }) => {
    const isUser = sender === 'user';

    return (
        <div className={`flex items-start flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div
                className={`max-w-xs py-1.5 px-4 rounded-md shadow space-y-1 ${isUser
                    ? 'bg-primary text-buttonText'  // User message, background from primary, text color buttonText
                    : 'bg-secondary text-textDark'  // Contact message, background from secondary, text color textDark
                    }`}
            >
                <p className={`${isUser ? 'text-textDark' : 'text-textLight'}`}>{text}</p>
            </div>
            <span
                className={`text-xs text-textLight mt-1 ${isUser ? 'self-end' : 'self-start '}`}
            >
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
};

export default ChatBubble;



