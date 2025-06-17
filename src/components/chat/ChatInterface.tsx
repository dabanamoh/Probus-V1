
import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

interface ChatInterfaceProps {
  conversationId?: string;
}

const ChatInterface = ({ conversationId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      message: 'Hey! How are you doing today?',
      time: '2:30 PM',
      isOwn: false,
      senderName: 'Sarah Johnson',
      senderInitials: 'SJ'
    },
    {
      id: '2',
      message: 'I\'m doing great, thanks for asking! How about you?',
      time: '2:32 PM',
      isOwn: true
    },
    {
      id: '3',
      message: 'Spark 40 OOH kv Extension SAMPLE.cdr',
      time: '2:35 PM',
      isOwn: false,
      senderName: 'Sarah Johnson',
      senderInitials: 'SJ',
      type: 'file' as const,
      fileName: 'Spark 40 OOH kv Extension SAMPLE.cdr',
      fileSize: '585.0 MB'
    },
    {
      id: '4',
      message: 'Thanks for sharing that file! I\'ll review it shortly.',
      time: '2:36 PM',
      isOwn: true
    }
  ]);

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    setMessages(prev => [...prev, newMessage]);
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Chats</h3>
          <p className="text-gray-600 max-w-sm">
            Select a conversation from the sidebar to start chatting with your colleagues.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <ChatHeader 
        contactName="Sarah Johnson"
        contactInitials="SJ"
        status="online"
      />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
              Today
            </span>
          </div>
          
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.message}
              time={message.time}
              isOwn={message.isOwn}
              senderName={message.senderName}
              senderInitials={message.senderInitials}
              type={message.type}
              fileName={message.fileName}
              fileSize={message.fileSize}
            />
          ))}
        </div>
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        placeholder="Type a message to Sarah..."
      />
    </div>
  );
};

export default ChatInterface;
