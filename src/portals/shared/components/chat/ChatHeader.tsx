import React from 'react';
import {
  Minimize2,
  Maximize2,
  MoreVertical,
  Phone,
  Video,
  Users,
  UserPlus,
  ArrowLeft,
  Search
} from 'lucide-react';
import { Button } from "../../../shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../../../shared/ui/dropdown-menu";
import { ActiveChat } from '@/types/chat';

interface ChatHeaderProps {
  currentView: 'chatList' | 'chat' | 'profile';
  activeChat: ActiveChat | null;
  isFullScreen: boolean;
  onBack: () => void;
  onMinimize: () => void;
  onFullScreen: () => void;
  onClose: () => void;
  onShowProfile: () => void;
  onAddMembers: () => void;
  onScheduleMeeting: () => void;
  onLeaveGroup: () => void;
  onDeleteChat: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentView,
  activeChat,
  isFullScreen,
  onBack,
  onMinimize,
  onFullScreen,
  onClose,
  onShowProfile,
  onAddMembers,
  onScheduleMeeting,
  onLeaveGroup,
  onDeleteChat,
  onMouseDown
}) => {
  const getChatName = () => {
    if (!activeChat) return '';
    if (activeChat.type === 'direct') {
      const chat = activeChat.data as import('@/types/chat').DirectChat;
      return chat.participants[0].name;
    }
    const group = activeChat.data as import('@/types/chat').ChatGroup;
    return group.name;
  };

  const getChatStatus = () => {
    if (!activeChat) return '';
    if (activeChat.type === 'direct') {
      const chat = activeChat.data as import('@/types/chat').DirectChat;
      const participant = chat.participants[0];
      if (participant.isOnline) return 'Online';
      if (participant.lastSeen) {
        return `Last seen ${new Date(participant.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      return 'Offline';
    }
    const group = activeChat.data as import('@/types/chat').ChatGroup;
    return `${group.members.length} members`;
  };

  const getAvatarFallback = () => {
    if (!activeChat) return '';
    if (activeChat.type === 'direct') {
      const chat = activeChat.data as import('@/types/chat').DirectChat;
      return chat.participants[0].name.substring(0, 2).toUpperCase();
    }
    const group = activeChat.data as import('@/types/chat').ChatGroup;
    return group.name.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className={`p-3 border-b flex items-center justify-between bg-[#0095FF] text-white ${!isFullScreen && onMouseDown ? 'cursor-move select-none' : ''}`}
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center gap-3">
        {currentView === 'chat' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}

        {currentView === 'chat' && activeChat ? (
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-1 rounded-lg transition-colors"
            onClick={onShowProfile}
          >
            <div className="relative">
              <Avatar className="h-9 w-9 border-2 border-white/30">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.id}`} />
                <AvatarFallback className="bg-blue-700 text-white text-xs">
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>
              {activeChat.type === 'direct' && (activeChat.data as import('@/types/chat').DirectChat).participants[0].isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#0095FF] rounded-full"></span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">{getChatName()}</h3>
              <p className="text-xs text-blue-100 opacity-90">{getChatStatus()}</p>
            </div>
          </div>
        ) : (
          <h3 className="font-semibold text-lg">Messages</h3>
        )}
      </div>

      <div className="flex items-center gap-1">
        {currentView === 'chat' && (
          <>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 rounded-full">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 rounded-full">
              <Video className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 rounded-full">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onShowProfile}>
                  <Users className="w-4 h-4 mr-2" />
                  View Info
                </DropdownMenuItem>
                {activeChat?.type === 'group' && (
                  <DropdownMenuItem onClick={onAddMembers}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Members
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onScheduleMeeting}>
                  <Search className="w-4 h-4 mr-2" />
                  Search in Conversation
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={activeChat?.type === 'group' ? onLeaveGroup : onDeleteChat}>
                  {activeChat?.type === 'group' ? 'Leave Group' : 'Delete Chat'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/20 rounded-full ml-1"
          onClick={onMinimize}
        >
          <Minimize2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
          onClick={onFullScreen}
        >
          {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
