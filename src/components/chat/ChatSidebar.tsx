
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MessageSquare, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Users, 
  Globe, 
  Star, 
  Book,
  Download,
  Settings,
  Bot,
  Building2,
  UserCheck
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface NavigationItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: number;
}

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  initials: string;
  type: 'individual' | 'group' | 'bot';
  badge?: string;
  unread?: boolean;
}

const ChatSidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const navigationItems: NavigationItem[] = [
    { icon: MessageSquare, label: "Chats", active: true },
    { icon: Calendar, label: "Meetings", badge: 3 },
    { icon: Calendar, label: "Calendar" },
    { icon: FileText, label: "Docs" },
    { icon: CheckSquare, label: "Approval center", badge: 5 },
    { icon: Users, label: "Workplace", badge: 3 },
    { icon: Bot, label: "TranAI" },
    { icon: Globe, label: "TransWorld" },
    { icon: Building2, label: "Base" },
    { icon: Users, label: "Contacts" },
    { icon: CheckSquare, label: "Tasks" },
    { icon: Star, label: "Favorites" },
    { icon: Book, label: "Wiki" }
  ];

  const chatItems: ChatItem[] = [
    {
      id: '1',
      name: 'ALL STAFF KE COMMUNI...',
      lastMessage: 'Jontae Muraya: Covered',
      time: '15:19',
      avatar: '',
      initials: 'ALL',
      type: 'group'
    },
    {
      id: '2',
      name: 'Olatunde Adeyemi Tuga',
      lastMessage: '[File]Spark 40 OOH kv Extension SA...',
      time: '15:08',
      avatar: '',
      initials: 'OA',
      type: 'individual'
    },
    {
      id: '3',
      name: 'Adebayo Isaac Arejigbe',
      lastMessage: '[Image]',
      time: '15:08',
      avatar: '',
      initials: 'AA',
      type: 'individual'
    },
    {
      id: '4',
      name: 'Approval center',
      lastMessage: 'Application for Advertising & Promoti...',
      time: '14:59',
      avatar: '',
      initials: 'AC',
      type: 'bot',
      badge: 'BOT'
    },
    {
      id: '5',
      name: 'HENRY AMUSAH',
      lastMessage: 'ok',
      time: '14:40',
      avatar: '',
      initials: 'HA',
      type: 'individual'
    },
    {
      id: '6',
      name: 'PC Ghana IT TREND PR...',
      lastMessage: 'HENRY AMUSAH: [File]Metal World E...',
      time: '14:28',
      avatar: '',
      initials: 'PC',
      type: 'group'
    },
    {
      id: '7',
      name: 'SRM',
      lastMessage: 'Metal World Engineering-市场物料/修...',
      time: '14:06',
      avatar: '',
      initials: 'SRM',
      type: 'bot',
      badge: 'BOT'
    }
  ];

  const getAvatarColor = (type: string, index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-red-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-semibold">Chats</h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search (Ctrl + K)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-0"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-2 border-b border-gray-200">
        <div className="space-y-1">
          {navigationItems.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
                item.active 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm flex-1 truncate">{item.label}</span>
              {item.badge && (
                <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 rounded-full flex items-center justify-center">
                  {item.badge}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-auto">
        <div className="p-2">
          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2 mb-4 p-2">
            {[
              { icon: Users, label: 'Huang Shu', bg: 'bg-green-100', color: 'text-green-600' },
              { icon: Building2, label: 'Infinix-HO', bg: 'bg-blue-100', color: 'text-blue-600' },
              { icon: UserCheck, label: 'ssa工业部', bg: 'bg-orange-100', color: 'text-orange-600' },
              { icon: Settings, label: 'SSA制造部', bg: 'bg-purple-100', color: 'text-purple-600' }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", item.bg)}>
                  <item.icon className={cn("w-5 h-5", item.color)} />
                </div>
                <span className="text-xs text-gray-600 text-center">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Recent Downloads */}
          <div className="mb-4">
            <div className="flex items-center gap-2 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer">
              <Download className="w-4 h-4" />
              <span className="text-sm">Recent downloads</span>
            </div>
          </div>

          {/* Chat Items */}
          <div className="space-y-1">
            {chatItems.map((chat, index) => (
              <div
                key={chat.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className={cn("text-white font-medium text-sm", getAvatarColor(chat.type, index))}>
                    {chat.initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{chat.name}</span>
                    {chat.badge && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5">
                        {chat.badge}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500 ml-auto">{chat.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
