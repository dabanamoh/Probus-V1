import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import { Card, CardContent } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { localDb } from '@/integrations/local-db';
import { useToast } from "@/hooks/use-toast";
import { Phone, Video, PhoneOff, Mic, MicOff, VideoIcon, VideoOff } from 'lucide-react';
import ChatInput from './ChatInput';
import { ScrollArea } from "../../../shared/ui/scroll-area";
import { Avatar, AvatarFallback } from "../../../shared/ui/avatar";
import { Skeleton } from "../../../shared/ui/skeleton";

interface ChatInterfaceProps {
  groupId?: string;
  isGroupChat?: boolean;
  userId: string;
  userName: string;
  selectedEmployee?: { id: string; name: string; callType?: 'voice' | 'video' } | null;
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
  userName,
  selectedEmployee
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-initiate call if callType is specified
  useEffect(() => {
    if (selectedEmployee?.callType && !isInCall) {
      setCallType(selectedEmployee.callType);
      setIsInCall(true);
      const callTypeName = selectedEmployee.callType === 'voice' ? 'Voice Call' : 'Video Call';
      toast({
        title: callTypeName,
        description: `Starting ${callTypeName.toLowerCase()} with ${selectedEmployee.name}...`,
      });
    }
  }, [selectedEmployee, isInCall, toast]);

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
    setCallType('voice');
    setIsInCall(true);
    toast({
      title: "Voice Call",
      description: selectedEmployee ? `Starting voice call with ${selectedEmployee.name}...` : "Initiating voice call..."
    });
  };

  // Handle video call
  const handleVideoCall = async () => {
    setCallType('video');
    setIsInCall(true);
    toast({
      title: "Video Call",
      description: selectedEmployee ? `Starting video call with ${selectedEmployee.name}...` : "Initiating video call..."
    });
  };

  // Handle end call
  const handleEndCall = () => {
    setIsInCall(false);
    setCallType(null);
    toast({
      title: "Call Ended",
      description: "The call has been disconnected."
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
    <Card className="h-full flex flex-col relative">
      {/* Call Overlay */}
      {isInCall && (
        <div className="absolute inset-0 z-50 bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center text-white">
          <div className="text-center space-y-6">
            {/* Call Icon */}
            <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              {callType === 'voice' ? (
                <Phone className="w-12 h-12" />
              ) : (
                <Video className="w-12 h-12" />
              )}
            </div>
            
            {/* Call Info */}
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                {selectedEmployee?.name || 'Unknown'}
              </h3>
              <p className="text-blue-100">
                {callType === 'voice' ? 'Voice Call' : 'Video Call'} in progress...
              </p>
            </div>

            {/* Call Duration Timer */}
            <div className="text-3xl font-mono">
              00:00
            </div>

            {/* Call Controls */}
            <div className="flex gap-4 mt-8">
              <Button
                variant="ghost"
                size="icon"
                className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 text-white"
                title="Mute/Unmute"
              >
                <Mic className="w-6 h-6" />
              </Button>
              
              {callType === 'video' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 text-white"
                  title="Turn off camera"
                >
                  <VideoIcon className="w-6 h-6" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleEndCall}
                title="End call"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 border-b flex items-center justify-between bg-[#0095FF] text-white">
        <h3 className="font-semibold text-lg">
          {selectedEmployee ? `Chat with ${selectedEmployee.name}` : 'Messages'}
        </h3>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
            onClick={handleVoiceCall}
            disabled={isInCall}
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
            onClick={handleVideoCall}
            disabled={isInCall}
          >
            <Video className="w-4 h-4" />
          </Button>
        </div>
      </div>
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
