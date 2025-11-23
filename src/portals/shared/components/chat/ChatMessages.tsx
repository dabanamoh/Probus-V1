import React from 'react';
import { ScrollArea } from "../../shared/ui/scroll-area";
import { ChatMessage } from '@/types/chat';
import MessageBubble from './MessageBubble';
import CallMessage from './CallMessage';
import MeetingMessage from './MeetingMessage';
import { Skeleton } from "../../shared/ui/skeleton";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  currentUserId: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  currentUserId,
  messagesEndRef
}) => {
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
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
