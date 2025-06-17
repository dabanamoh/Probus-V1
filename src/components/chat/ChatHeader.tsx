
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Video, 
  Info,
  Search,
  MoreVertical 
} from 'lucide-react';

interface ChatHeaderProps {
  contactName: string;
  contactInitials: string;
  status: string;
  lastSeen?: string;
}

const ChatHeader = ({ contactName, contactInitials, status, lastSeen }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="bg-blue-500 text-white font-semibold">
            {contactInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-gray-900">{contactName}</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {status === 'online' ? 'Active now' : lastSeen}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
          <Phone className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
          <Video className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
          <Search className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
          <Info className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
