
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ConversationItemProps {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  initials: string;
  unreadCount?: number;
  isActive?: boolean;
  isOnline?: boolean;
  onClick: (id: string) => void;
}

const ConversationItem = ({ 
  id, 
  name, 
  lastMessage, 
  time, 
  initials, 
  unreadCount, 
  isActive, 
  isOnline,
  onClick 
}: ConversationItemProps) => {
  return (
    <div 
      onClick={() => onClick(id)}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
        isActive ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
    >
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="bg-gray-500 text-white font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-gray-900 truncate">{name}</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{time}</span>
            {unreadCount && unreadCount > 0 && (
              <Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
      </div>
    </div>
  );
};

export default ConversationItem;
