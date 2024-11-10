import React from 'react';
import { VideoIcon, PhoneIcon, SearchIcon } from 'lucide-react';
import useContactsStore from '../store/contactsStore';

const ChatHeader: React.FC = () => {
    const { selectedContact } = useContactsStore();

    return (
        <div className="w-full sticky top-0 bg-white dark:bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 z-10">
            {/* Left side - Contact name and profile icon */}
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                {/* Display the selected contact's name */}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {selectedContact ? selectedContact.name : "Select a contact"}
                </span>
            </div>

            {/* Right side - Icons */}
            <div className="flex space-x-3">
                <button className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition">
                    <VideoIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                </button>
                <button className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition">
                    <PhoneIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                </button>
                <button className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition">
                    <SearchIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
