
import React, { useState } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatInterface from '@/components/chat/ChatInterface';

const Chat = () => {
  const [activeConversationId, setActiveConversationId] = useState<string>('1');

  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <ChatSidebar 
        activeConversationId={activeConversationId}
        onConversationSelect={handleConversationSelect}
      />
      <ChatInterface conversationId={activeConversationId} />
    </div>
  );
};

export default Chat;
