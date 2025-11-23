import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { ScrollArea } from "../../shared/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";
import { Badge } from "../../shared/ui/badge";
import { localDb } from "@/integrations/local-db/client";
import { Bot, Send, Paperclip, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name?: string;
  is_ai?: boolean;
  created_at: string;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
}

interface AIChatProps {
  groupId?: string;
  isAIAssistant?: boolean;
  context?: 'hr' | 'admin' | 'employee' | 'general';
}

const AIChat: React.FC<AIChatProps> = ({ groupId, isAIAssistant = false, context = 'general' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeMessageRisk = async (content: string, senderId: string) => {
    try {
      const response = await fetch('/api/analyze-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, senderId, context })
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.riskLevel;
      }
    } catch (error) {
      console.error('Risk analysis failed:', error);
    }
    return 'low';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    const messageContent = inputMessage;
    setInputMessage('');

    try {
      // Analyze message for risk
      const riskLevel = await analyzeMessageRisk(messageContent, 'current-user');

      const newMessage: Message = {
        id: Date.now().toString(),
        content: messageContent,
        sender_id: 'current-user',
        sender_name: 'You',
        created_at: new Date().toISOString(),
        risk_level: riskLevel
      };

      setMessages(prev => [...prev, newMessage]);

      // If this is AI assistant mode, get AI response
      if (isAIAssistant) {
        const aiResponse = await getAIResponse(messageContent, context);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender_id: 'ai-assistant',
          sender_name: 'AI Assistant',
          is_ai: true,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
      }

      // Log interaction for compliance
      await logDataProcessing('communication', 'Chat interaction');

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAIResponse = async (userMessage: string, context: string) => {
    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          context,
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.response;
      }
    } catch (error) {
      console.error('AI response failed:', error);
    }
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  };

  const logDataProcessing = async (category: string, purpose: string) => {
    try {
      // Get current user (in a real app, this would come from auth context)
      const currentUser = { id: 'current-user' };
      
      await localDb.from('data_processing_logs').insert({
        user_id: currentUser.id,
        action_type: 'access',
        data_category: category,
        purpose,
        legal_basis: 'legitimate_interest'
      });
    } catch (error) {
      console.error('Failed to log data processing:', error);
    }
  };

  const getRiskBadge = (riskLevel?: string) => {
    if (!riskLevel || riskLevel === 'low') return null;
    
    const colors = {
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={`ml-2 ${colors[riskLevel as keyof typeof colors]}`}>
        <AlertTriangle className="w-3 h-3 mr-1" />
        {riskLevel.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          {isAIAssistant ? (
            <>
              <Bot className="w-5 h-5 text-blue-600" />
              AI Assistant
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 text-green-600" />
              Secure Chat
            </>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender_id === 'current-user' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8">
                  {message.is_ai ? (
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback>{message.sender_name?.[0] || 'U'}</AvatarFallback>
                  )}
                </Avatar>
                
                <div className={`flex-1 max-w-[80%] ${
                  message.sender_id === 'current-user' ? 'text-right' : ''
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-600">
                      {message.sender_name}
                    </span>
                    {getRiskBadge(message.risk_level)}
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    message.sender_id === 'current-user'
                      ? 'bg-blue-600 text-white'
                      : message.is_ai
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-white border border-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  <span className="text-xs text-gray-400 mt-1 block">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isAIAssistant ? "Ask AI assistant..." : "Type your message..."}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              disabled={isLoading}
            />
            <Button size="icon" variant="outline">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
