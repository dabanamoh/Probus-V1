
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Plus, 
  Smile, 
  Paperclip,
  Mic
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

const ChatInput = ({ onSendMessage, placeholder = "Type a message..." }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
          <Plus className="w-5 h-5" />
        </Button>
        
        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
          <Input
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-0 bg-transparent focus-visible:ring-0 px-0"
          />
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
            <Smile className="w-4 h-4" />
          </Button>
        </div>
        
        {message.trim() ? (
          <Button onClick={handleSend} size="icon" className="bg-blue-500 hover:bg-blue-600">
            <Send className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
            <Mic className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
