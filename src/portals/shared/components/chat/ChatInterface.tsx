import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import { Card, CardContent } from "../../shared/ui/card";
import { localDb } from '@/integrations/local-db';
import { useToast } from "@/hooks/use-toast";
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import { ScrollArea } from "../../shared/ui/scroll-area";
import { Avatar, AvatarFallback } from "../../shared/ui/avatar";
import { Skeleton } from "../../shared/ui/skeleton";

interface ChatInterfaceProps {
  groupId?: string;
  isGroupChat?: boolean;
  userId: string;
  userName: string;
}

interface DbChatMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  group_id: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  groupId,
  isGroupChat = false,
  userId,
  userName
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!groupId) return;

      setIsLoading(true);
      try {
        const { data, error } = await localDb
          .from('chat_messages')
          .select('*')
          .eq('group_id', groupId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Fetch user details for each message
        const messagesWithUsers = await Promise.all(
          (data || []).map(async (message: DbChatMessage) => {
            const { data: userData } = await localDb
              .from('employees')
              .select('name')
              .eq('id', message.user_id)
              .limit(1);

            return {
              id: message.id,
              senderId: message.user_id,
              senderName: userData?.[0]?.name || 'Unknown User',
              content: message.content,
              type: 'text',
              timestamp: new Date(message.created_at),
              isRead: true
            } as ChatMessage;
          })
        );

        setMessages(messagesWithUsers);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [groupId, toast]);

  // Send a new message
  const sendMessage = async (content: string) => {
    if (!content.trim() || !groupId) return;

    try {
      const newMessage = {
        group_id: groupId,
        user_id: userId,
        content: content,
        created_at: new Date().toISOString()
      };

      const { data, error } = await localDb
        .from('chat_messages')
        .insert(newMessage);

      if (error) throw error;

      // Add to local state
      const messageWithUser: ChatMessage = {
        id: data?.[0]?.id || Date.now().toString(),
        senderId: userId,
        senderName: userName,
        content: content,
        type: 'text',
        timestamp: new Date(),
        isRead: true
      };

      setMessages(prev => [...prev, messageWithUser]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  // Handle voice call
  const handleVoiceCall = async () => {
    // In a real implementation, this would initiate a call with another user
    toast({
      title: "Voice Call",
      description: "Initiating voice call..."
    });
  };

  // Handle video call
  const handleVideoCall = async () => {
    // In a real implementation, this would initiate a video call with another user
    toast({
      title: "Video Call",
      description: "Initiating video call..."
    });
  };

  // Handle schedule meeting
  const handleScheduleMeeting = async () => {
    // In a real implementation, this would open a meeting scheduler
    toast({
      title: "Schedule Meeting",
      description: "Opening meeting scheduler..."
    });
  };

  // Render messages
  const renderMessages = () => {
    if (isLoading) {
      return (
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-64" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      );
    }

    return (
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start gap-3 ${message.senderId === userId ? 'flex-row-reverse' : ''}`}>
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {message.senderName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className={`flex-1 max-w-[80%] ${message.senderId === userId ? 'text-right' : ''}`}>
                {message.senderId !== userId && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-600">
                      {message.senderName || 'Unknown User'}
                    </span>
                  </div>
                )}

                <div className={`p-3 rounded-lg ${message.senderId === userId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                <span className="text-xs text-gray-400 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <ChatHeader
        groupId={groupId}
        isGroupChat={isGroupChat}
        userId={userId}
        onCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
        onScheduleMeeting={handleScheduleMeeting}
      />
      <CardContent className="flex-1 flex flex-col p-0">
        {renderMessages()}
        <ChatInput
          onSend={sendMessage}
          groupId={groupId}
          userId={userId}
        />
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
