import React from 'react';
import { Avatar, AvatarFallback } from "../../shared/ui/avatar";
import { ChatMessage } from '@/types/chat';
import CallMessage from './CallMessage';
import MeetingMessage from './MeetingMessage';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  // Render call message
  if (message.type === 'call' && message.callData) {
    const callProps = {
      id: message.callData.id,
      type: message.callData.type,
      status: message.callData.status,
      duration: message.callData.duration,
      participants: message.callData.participants,
      created_at: new Date(message.timestamp).toISOString()
    };

    return (
      <CallMessage
        call={callProps}
        isOwn={isOwn}
        onCallBack={() => console.log('Call back initiated')}
      />
    );
  }

  // Render meeting message
  if (message.type === 'meeting_invite' && message.meetingData) {
    const startTime = new Date(message.meetingData.scheduledTime);
    const endTime = new Date(startTime.getTime() + message.meetingData.duration * 60000);

    // Map status 'ongoing' to 'in_progress' which MeetingMessage expects
    let status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' = 'scheduled';
    if (message.meetingData.status === 'ongoing') {
      status = 'in_progress';
    } else {
      status = message.meetingData.status as 'scheduled' | 'completed' | 'cancelled';
    }

    const meetingProps = {
      id: message.meetingData.id,
      title: message.meetingData.title,
      status: status,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      participants: [] // MeetingData doesn't have participants in types/chat.ts
    };

    return (
      <MeetingMessage
        meeting={meetingProps}
        isOwn={isOwn}
        onJoin={() => console.log('Join meeting')}
      />
    );
  }

  // Render regular text message
  return (
    <div className={`flex items-start gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <Avatar className="w-8 h-8">
        <AvatarFallback>
          {message.senderName?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>

      <div className={`flex-1 max-w-[80%] ${isOwn ? 'text-right' : ''}`}>
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-600">
              {message.senderName || 'Unknown User'}
            </span>
          </div>
        )}

        <div className={`p-3 rounded-lg ${isOwn
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
  );
};

export default MessageBubble;
