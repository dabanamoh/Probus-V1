import React, { useState } from 'react';
import { Input } from "../../../shared/ui/input";
import { Button } from "../../../shared/ui/button";
import { Send, Paperclip, Mic } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  groupId?: string;
  userId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, groupId, userId }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 border-t">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon">
          <Paperclip className="w-4 h-4" />
        </Button>
        
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        
        <Button type="button" variant="outline" size="icon">
          <Mic className="w-4 h-4" />
        </Button>
        
        <Button 
          type="submit" 
          size="icon"
          disabled={!message.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
