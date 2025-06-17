
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MessageSquare, 
  Edit3,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import ConversationItem from './ConversationItem';

interface ChatSidebarProps {
  activeConversationId?: string;
  onConversationSelect: (id: string) => void;
}

const ChatSidebar = ({ activeConversationId, onConversationSelect }: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Sarah Johnson',
      lastMessage: 'Hey! How are you doing today?',
      time: '2m',
      initials: 'SJ',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Olatunde Adeyemi Tuga',
      lastMessage: '[File] Spark 40 OOH kv Extension SA...',
      time: '15m',
      initials: 'OA',
      isOnline: false
    },
    {
      id: '3',
      name: 'Team Design',
      lastMessage: 'Mike: Great work on the new designs!',
      time: '1h',
      initials: 'TD',
      unreadCount: 5,
      isOnline: true
    },
    {
      id: '4',
      name: 'Adebayo Isaac',
      lastMessage: '[Image]',
      time: '2h',
      initials: 'AI',
      isOnline: true
    },
    {
      id: '5',
      name: 'Henry Amusah',
      lastMessage: 'Ok, sounds good to me',
      time: '1d',
      initials: 'HA',
      isOnline: false
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            Chats
          </h1>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Edit3 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
        
        {/* Filter Options */}
        <div className="flex items-center gap-2 mt-3">
          <Button variant="ghost" size="sm" className="text-blue-600 bg-blue-50">
            All
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            Unread
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            Groups
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 ml-auto">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-auto">
        <div className="p-2">
          {filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              id={conversation.id}
              name={conversation.name}
              lastMessage={conversation.lastMessage}
              time={conversation.time}
              initials={conversation.initials}
              unreadCount={conversation.unreadCount}
              isActive={activeConversationId === conversation.id}
              isOnline={conversation.isOnline}
              onClick={onConversationSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
