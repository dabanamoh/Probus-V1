
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Plus, 
  Search, 
  Hash, 
  MessageCircle, 
  Building2,
  Bot
} from 'lucide-react';
import AIChat from '../ai/AIChat';

interface ChatGroup {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'department';
  member_count?: number;
  department_name?: string;
  last_message?: string;
  updated_at: string;
}

const ChatInterface: React.FC = () => {
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChatGroups();
  }, []);

  const loadChatGroups = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockGroups: ChatGroup[] = [
        {
          id: '1',
          name: 'Engineering Team',
          type: 'department',
          member_count: 12,
          department_name: 'Engineering',
          last_message: 'Let\'s discuss the new project requirements',
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Project Alpha',
          type: 'group',
          member_count: 5,
          last_message: 'Meeting scheduled for tomorrow',
          updated_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          name: 'HR Announcements',
          type: 'department',
          member_count: 107,
          department_name: 'HR',
          last_message: 'New policy updates available',
          updated_at: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      setChatGroups(mockGroups);
    } catch (error) {
      console.error('Error loading chat groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGroups = chatGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'department': return <Building2 className="w-4 h-4" />;
      case 'group': return <Users className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case 'department': return 'bg-blue-100 text-blue-800';
      case 'group': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Chat Groups Sidebar */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chat Groups
          </CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button size="icon" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="space-y-2 p-4">
              {/* AI Assistant Option */}
              <div
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedGroup === 'ai-assistant'
                    ? 'bg-blue-100 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedGroup('ai-assistant')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">AI Assistant</p>
                      <Badge className="bg-purple-100 text-purple-800 text-xs">AI</Badge>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      Get help with HR, compliance, and workplace issues
                    </p>
                  </div>
                </div>
              </div>

              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedGroup === group.id
                      ? 'bg-blue-100 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getGroupIcon(group.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{group.name}</p>
                        <Badge className={`${getGroupTypeColor(group.type)} text-xs`}>
                          {group.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {group.last_message || 'No messages yet'}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {group.member_count} members
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(group.updated_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedGroup ? (
          selectedGroup === 'ai-assistant' ? (
            <AIChat isAIAssistant={true} context="general" />
          ) : (
            <AIChat groupId={selectedGroup} />
          )
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a chat group
              </h3>
              <p className="text-gray-600">
                Choose a group from the sidebar to start chatting
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
