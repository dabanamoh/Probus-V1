
import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useMessages } from '@/hooks/useMessages';
import { useConversations } from '@/hooks/useConversations';

interface ChatInterfaceProps {
  conversationId?: string;
}

const ChatInterface = ({ conversationId }: ChatInterfaceProps) => {
  const { messages, loading, sendMessage } = useMessages(conversationId);
  const { conversations } = useConversations();
  
  const currentConversation = conversations.find(conv => conv.id === conversationId);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  const conversationName = currentConversation?.name || 'Unknown';
  const contactInitials = getInitials(conversationName);

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <ChatHeader 
        contactName={conversationName}
        contactInitials={contactInitials}
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
              time={new Date(message.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              isOwn={message.is_own}
              senderName={message.is_own ? undefined : message.sender_name}
              senderInitials={message.is_own ? undefined : message.sender_initials}
              type={message.message_type as 'text' | 'file' | 'image'}
              fileName={message.file_name || undefined}
              fileSize={message.file_size || undefined}
            />
          ))}
        </div>
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        placeholder={`Type a message to ${conversationName}...`}
      />
    </div>
  );
};

export default ChatInterface;
