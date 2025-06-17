
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Phone, 
  Video, 
  MoreHorizontal, 
  Paperclip,
  Smile,
  Send,
  RefreshCw,
  FileText,
  Download
} from 'lucide-react';

const ChatInterface = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-500 text-white">
              OT
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">Olatunde Adeyemi Tuga</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Laker</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat Tabs */}
      <div className="flex border-b border-gray-200">
        <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50">
          Chat
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          File
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          +
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="text-center text-sm text-gray-500 mb-6">
          15:08
        </div>
        
        {/* File Message */}
        <div className="flex justify-end mb-6">
          <div className="max-w-xs">
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Spark 40 OOH kv Extension SAMPLE.cdr</p>
                  <p className="text-xs opacity-90">585.0 MB</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="w-8 h-8 text-white hover:bg-blue-500">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="w-8 h-8 text-white hover:bg-blue-500">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Message Olatunde Adeyemi Tuga"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button variant="ghost" size="icon">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Smile className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          <Button size="icon" className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
