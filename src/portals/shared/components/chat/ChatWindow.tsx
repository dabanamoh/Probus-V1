import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { FileText } from 'lucide-react';

interface ChatWindowProps {
    messages: ChatMessage[];
    currentUserId?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessageContent = (msg: ChatMessage) => {
        if (msg.type === 'file') {
            return (
                <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg border border-white/20">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-sm truncate max-w-[150px]">{msg.fileName || 'File'}</p>
                        <p className="text-xs opacity-70">Click to download</p>
                    </div>
                </div>
            );
        }
        return <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>;
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs mt-1">Send a message to start the conversation</p>
                </div>
            ) : (
                messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUserId;
                    const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId);

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}
                        >
                            {!isMe && (
                                <div className="w-8 mr-2 flex-shrink-0 flex flex-col justify-end">
                                    {showAvatar ? (
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`} />
                                            <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                                                {msg.senderName.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : <div className="w-8" />}
                                </div>
                            )}

                            <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                {!isMe && showAvatar && (
                                    <span className="text-[10px] text-gray-500 ml-1 mb-1">{msg.senderName}</span>
                                )}
                                <div
                                    className={`p-3 rounded-2xl shadow-sm ${isMe
                                            ? 'bg-[#0095FF] text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                        }`}
                                >
                                    {renderMessageContent(msg)}
                                </div>
                                <span className={`text-[10px] text-gray-400 mt-1 ${isMe ? 'mr-1' : 'ml-1'}`}>
                                    {formatTime(msg.timestamp)}
                                </span>
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatWindow;
