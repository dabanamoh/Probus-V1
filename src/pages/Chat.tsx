
import React from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatInterface from '@/components/chat/ChatInterface';

const Chat = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <ChatSidebar />
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;
