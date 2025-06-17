
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image, MoreHorizontal } from 'lucide-react';

interface MessageBubbleProps {
  message: string;
  time: string;
  isOwn: boolean;
  senderName?: string;
  senderInitials?: string;
  type?: 'text' | 'file' | 'image';
  fileName?: string;
  fileSize?: string;
}

const MessageBubble = ({ 
  message, 
  time, 
  isOwn, 
  senderName, 
  senderInitials,
  type = 'text',
  fileName,
  fileSize 
}: MessageBubbleProps) => {
  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarFallback className="bg-gray-500 text-white text-xs">
            {senderInitials}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-last' : ''}`}>
        {!isOwn && senderName && (
          <p className="text-xs text-gray-600 mb-1 font-medium">{senderName}</p>
        )}
        
        <div className={`rounded-2xl px-4 py-2 ${
          isOwn 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          {type === 'file' && fileName ? (
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isOwn ? 'bg-blue-400' : 'bg-gray-200'
              }`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
                {fileSize && <p className="text-xs opacity-75">{fileSize}</p>}
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className={`w-8 h-8 ${isOwn ? 'text-white hover:bg-blue-400' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <p className="text-sm">{message}</p>
          )}
        </div>
        
        <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
          {time}
        </p>
      </div>
      
      {isOwn && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            You
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
