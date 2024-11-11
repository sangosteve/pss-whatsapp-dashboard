// ChatInput.tsx
import React, { useState } from 'react';
import { Paperclip, Send, File, SendHorizonal } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button"

interface ChatInputProps {
    onSendMessage: (messageText: string, file?: File) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        if (file) setIsSheetOpen(true); // Open sheet on file select
    };

    const handleSend = () => {
        if (message.trim() || selectedFile) {
            onSendMessage(message, selectedFile || undefined);
            setMessage(''); // Clear input after sending
            setSelectedFile(null); // Clear selected file
            setIsSheetOpen(false); // Close the sheet

            console.log(message)

        }
    };

    const getFileType = (file: File) => {
        if (file.type) {
            return file.type; // MIME type (e.g., 'application/pdf' or 'text/plain')
        }
        // Fall back to extension if MIME type is unavailable
        const extension = file.name.split('.').pop();
        return extension ? `.${extension}` : 'Unknown type';
    };

    return (
        <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 px-4 py-3 z-10">
            <div className="flex items-center space-x-3">
                <input
                    type="file"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="file-input"
                />
                <label htmlFor="file-input" className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition cursor-pointer">
                    <Paperclip className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                </label>

                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-grow px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

                <button onClick={handleSend} className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition">
                    <Send className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                </button>
            </div>

            {/* Sheet for File Details and Caption */}
            {selectedFile && (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent side={"bottom"} className="absolute bottom-4 w-full max-w-lg mx-auto rounded-t-lg">
                        {/* <SheetHeader>
                            <SheetTitle>File Details</SheetTitle>
                            <SheetDescription>
                                You can add a caption below and then send the file.
                            </SheetDescription>
                        </SheetHeader> */}
                        <div className="flex flex-col items-center justify-center py-4 gap-2">
                            {/* <p><strong>File Name:</strong> {selectedFile.name}</p>
                            <p><strong>File Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Add a caption"
                                className="w-full px-4 py-2 mt-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none"
                            /> */}

                            <File size={60} className='text-zinc-500' />

                            <p className='text-xs text-zinc-500'>{selectedFile.name}</p>
                            <p className='text-xs text-zinc-700'>{(selectedFile.size / 1024).toFixed(2)} KB, {getFileType(selectedFile)}</p>


                        </div>
                        <SheetFooter className='flex items-center'>
                            {/* <button
                                onClick={handleSend}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Send
                            </button>
                            <button
                                onClick={() => {
                                    setIsSheetOpen(false);
                                    setSelectedFile(null);
                                    setMessage(''); // Clear caption
                                }}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button> */}
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Add a caption"
                                className="w-full px-4 py-2 mt-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none"
                            />
                            <Button
                                onClick={handleSend}
                                size={"icon"}
                            >
                                <SendHorizonal size={40} className='w-8 h-8' />
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
};

export default ChatInput;
