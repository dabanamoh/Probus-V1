
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatInterface from '@/components/chat/ChatInterface';

const Chat = () => {
  const [activeConversationId, setActiveConversationId] = useState<string>('1');

  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex flex-1">
        <ChatSidebar 
          activeConversationId={activeConversationId}
          onConversationSelect={handleConversationSelect}
        />
        <ChatInterface conversationId={activeConversationId} />
      </div>
    </div>
  );
};

export default Chat;
