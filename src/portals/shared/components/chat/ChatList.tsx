import React, { useState } from 'react';
import {
    Search,
    UserPlus,
    Users,
    Filter
} from 'lucide-react';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Employee, ChatGroup, DirectChat } from '@/types/chat';

interface ChatListProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    showAdvancedSearch: boolean;
    onToggleAdvancedSearch: () => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
    directChats: DirectChat[];
    groups: ChatGroup[];
    employees: Employee[];
    onSelectChat: (chat: DirectChat | ChatGroup, type: 'direct' | 'group') => void;
    onCreateGroup: () => void;
    onStartDirectChat: (employee: Employee) => void;
}

const ChatList: React.FC<ChatListProps> = ({
    searchTerm,
    onSearchChange,
    showAdvancedSearch,
    onToggleAdvancedSearch,
    activeTab,
    onTabChange,
    directChats,
    groups,
    employees,
    onSelectChat,
    onCreateGroup,
    onStartDirectChat
}) => {
    const [newChatSearch, setNewChatSearch] = useState('');

    const formatTime = (date?: Date) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getAvatarFallback = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(newChatSearch.toLowerCase()) ||
        employee.department.toLowerCase().includes(newChatSearch.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full">
            {/* Search Bar */}
            <div className="p-3 border-b bg-gray-50">
                <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 h-9 bg-white text-sm"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <Button
                        variant={showAdvancedSearch ? "secondary" : "ghost"}
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        onClick={onToggleAdvancedSearch}
                    >
                        <Filter className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                                <UserPlus className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                            <DropdownMenuItem onClick={onCreateGroup} className="cursor-pointer">
                                <Users className="w-4 h-4 mr-2" />
                                Create New Group
                            </DropdownMenuItem>
                            <div className="p-2 border-t mt-1">
                                <div className="text-xs font-semibold text-gray-500 mb-2">New Direct Message</div>
                                <div className="relative mb-2">
                                    <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                                    <Input
                                        placeholder="Search employees..."
                                        className="pl-7 h-8 text-xs"
                                        value={newChatSearch}
                                        onChange={(e) => setNewChatSearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <div className="max-h-40 overflow-y-auto space-y-1">
                                    {filteredEmployees.map(employee => (
                                        <div
                                            key={employee.id}
                                            className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded cursor-pointer"
                                            onClick={() => onStartDirectChat(employee)}
                                        >
                                            <Avatar className="w-6 h-6">
                                                <AvatarFallback className="bg-blue-100 text-blue-700 text-[10px]">
                                                    {getAvatarFallback(employee.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{employee.name}</p>
                                                <p className="text-[10px] text-gray-500 truncate">{employee.department}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="w-full flex-1 flex flex-col">
                <div className="px-3 pt-2">
                    <TabsList className="w-full grid grid-cols-3 h-8">
                        <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                        <TabsTrigger value="direct" className="text-xs">Direct</TabsTrigger>
                        <TabsTrigger value="groups" className="text-xs">Groups</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {/* Groups Section */}
                    {(activeTab === 'all' || activeTab === 'groups') && groups.length > 0 && (
                        <>
                            {activeTab === 'all' && <div className="px-2 py-1 text-xs font-semibold text-gray-500 mt-2 mb-1">Groups</div>}
                            {groups.map(group => (
                                <div
                                    key={group.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                    onClick={() => onSelectChat(group, 'group')}
                                >
                                    <div className="relative">
                                        <Avatar className="h-10 w-10 border border-gray-200">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${group.id}`} />
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                                {getAvatarFallback(group.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-medium text-sm truncate text-gray-900">{group.name}</h4>
                                            {group.lastMessage && (
                                                <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                                                    {formatTime(group.lastMessage.timestamp)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center mt-0.5">
                                            <p className="text-xs text-gray-500 truncate pr-2">
                                                {group.lastMessage ? (
                                                    <>
                                                        <span className="font-medium text-gray-700">{group.lastMessage.senderName.split(' ')[0]}: </span>
                                                        {group.lastMessage.content}
                                                    </>
                                                ) : (
                                                    <span className="italic">No messages yet</span>
                                                )}
                                            </p>
                                            {group.unreadCount > 0 && (
                                                <Badge className="h-5 min-w-[20px] flex items-center justify-center px-1 bg-[#0095FF] hover:bg-[#0095FF] text-[10px]">
                                                    {group.unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Direct Chats Section */}
                    {(activeTab === 'all' || activeTab === 'direct') && directChats.length > 0 && (
                        <>
                            {activeTab === 'all' && <div className="px-2 py-1 text-xs font-semibold text-gray-500 mt-2 mb-1">Direct Messages</div>}
                            {directChats.map(chat => {
                                const participant = chat.participants[0];
                                return (
                                    <div
                                        key={chat.id}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                        onClick={() => onSelectChat(chat, 'direct')}
                                    >
                                        <div className="relative">
                                            <Avatar className="h-10 w-10 border border-gray-200">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.id}`} />
                                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                                    {getAvatarFallback(participant.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {participant.isOnline && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="font-medium text-sm truncate text-gray-900">{participant.name}</h4>
                                                {chat.lastMessage && (
                                                    <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                                                        {formatTime(chat.lastMessage.timestamp)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center mt-0.5">
                                                <p className="text-xs text-gray-500 truncate pr-2">
                                                    {chat.lastMessage ? chat.lastMessage.content : <span className="italic">Start a conversation</span>}
                                                </p>
                                                {chat.unreadCount > 0 && (
                                                    <Badge className="h-5 min-w-[20px] flex items-center justify-center px-1 bg-[#0095FF] hover:bg-[#0095FF] text-[10px]">
                                                        {chat.unreadCount}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {/* Empty State */}
                    {directChats.length === 0 && groups.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <Search className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 font-medium">No chats found</p>
                            <p className="text-xs text-gray-400 mt-1">Try searching or start a new conversation</p>
                        </div>
                    )}
                </div>
            </Tabs>
        </div>
    );
};

export default ChatList;
