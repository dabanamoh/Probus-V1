import React from 'react';
import { Phone, Video, User, Clock } from 'lucide-react';
import { Button } from "../../shared/ui/button";
import { Avatar, AvatarFallback } from "../../shared/ui/avatar";

interface CallMessageProps {
  call: {
    id: string;
    type: 'voice' | 'video';
    status: 'missed' | 'completed' | 'incoming' | 'outgoing';
    duration?: string;
    participants: { id: string; name: string; avatar?: string }[];
    created_at: string;
  };
  isOwn: boolean;
  onCallBack?: () => void;
}

const CallMessage: React.FC<CallMessageProps> = ({ call, isOwn, onCallBack }) => {
  const getCallStatusIcon = () => {
    switch (call.status) {
      case 'missed':
        return <Phone className="w-4 h-4 text-red-500" />;
      case 'completed':
        return call.type === 'video' ? 
          <Video className="w-4 h-4 text-green-500" /> : 
          <Phone className="w-4 h-4 text-green-500" />;
      default:
        return call.type === 'video' ? 
          <Video className="w-4 h-4 text-blue-500" /> : 
          <Phone className="w-4 h-4 text-blue-500" />;
    }
  };

  const getCallStatusText = () => {
    switch (call.status) {
      case 'missed':
        return `Missed ${call.type} call`;
      case 'completed':
        return `${call.type === 'video' ? 'Video' : 'Voice'} call (${call.duration})`;
      case 'incoming':
        return `Incoming ${call.type} call`;
      case 'outgoing':
        return `Outgoing ${call.type} call`;
      default:
        return `${call.type} call`;
    }
  };

  return (
    <div className="flex items-center justify-center my-2">
      <div className="bg-gray-100 rounded-lg p-3 max-w-md w-full flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full">
            {getCallStatusIcon()}
          </div>
          <div>
            <p className="text-sm font-medium">
              {getCallStatusText()}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(call.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        
        {call.status === 'missed' && onCallBack && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCallBack}
            className="text-xs"
          >
            Call Back
          </Button>
        )}
      </div>
    </div>
  );
};

export default CallMessage;
