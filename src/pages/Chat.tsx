
import React from 'react';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/chat/ChatInterface';

const Chat = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 p-6">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;
