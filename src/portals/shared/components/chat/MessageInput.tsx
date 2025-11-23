import React, { useState, useRef } from 'react';
import {
    Smile,
    Paperclip,
    Send,
    Mic
} from 'lucide-react';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

interface MessageInputProps {
    onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [messageInput, setMessageInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        if (!messageInput.trim()) return;
        onSendMessage(messageInput);
        setMessageInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // In a real app, we would upload the file here
            console.log('File selected:', file.name);
            // For now, just send a message with the filename
            onSendMessage(`Sent a file: ${file.name}`);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="p-3 bg-white border-t flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full h-9 w-9 shrink-0">
                        <Smile className="w-5 h-5" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start" side="top">
                    <div className="grid grid-cols-5 gap-2">
                        {['😀', '😂', '😍', '👍', '🎉', '🔥', '❤️', '🤔', '👀', '🙌'].map(emoji => (
                            <button
                                key={emoji}
                                className="text-xl hover:bg-gray-100 p-1 rounded"
                                onClick={() => setMessageInput(prev => prev + emoji)}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full h-9 w-9 shrink-0"
                onClick={handleFileClick}
            >
                <Paperclip className="w-5 h-5" />
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="flex-1 relative">
                <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="pr-10 rounded-full bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-blue-400"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-gray-600 rounded-full"
                >
                    <Mic className="w-4 h-4" />
                </Button>
            </div>

            <Button
                onClick={handleSend}
                disabled={!messageInput.trim()}
                className={`rounded-full h-10 w-10 p-0 shrink-0 transition-all duration-200 ${messageInput.trim()
                        ? 'bg-[#0095FF] hover:bg-[#0080E6] text-white shadow-md transform hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
            >
                <Send className="w-5 h-5 ml-0.5" />
            </Button>
        </div>
    );
};

export default MessageInput;
