import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  Paperclip,
  Smile,
  Mic,
  Search,
  MoreVertical,
  Check,
  CheckCheck
} from 'lucide-react';

// Mock data for contacts
const contacts = [
  {
    id: 'chat-1',
    name: 'John Doe',
    avatar: '/placeholder.svg',
    lastMessage: 'See you tomorrow!',
    timestamp: '10:30 AM',
    unread: 0,
    online: true
  },
  {
    id: 'chat-2',
    name: 'Marketing Team',
    avatar: '/placeholder.svg',
    lastMessage: 'Meeting at 2 PM',
    timestamp: '9:15 AM',
    unread: 3,
    online: false
  },
  {
    id: 'chat-3',
    name: 'Sarah Johnson',
    avatar: '/placeholder.svg',
    lastMessage: 'Thanks for the update',
    timestamp: 'Yesterday',
    unread: 0,
    online: true
  },
  {
    id: 'chat-4',
    name: 'Tech Support',
    avatar: '/placeholder.svg',
    lastMessage: 'Your ticket has been resolved',
    timestamp: 'Yesterday',
    unread: 0,
    online: false
  }
];

// Mock data for messages
const messages = {
  'chat-1': [
    { id: 'msg-1', sender: 'me', content: 'Hi John, how are you doing?', timestamp: '10:15 AM', status: 'read' },
    { id: 'msg-2', sender: 'John Doe', content: 'I\'m good, thanks! How about you?', timestamp: '10:16 AM', status: 'read' },
    { id: 'msg-3', sender: 'me', content: 'Doing well, just working on the project.', timestamp: '10:17 AM', status: 'read' },
    { id: 'msg-4', sender: 'John Doe', content: 'That sounds great. Need any help?', timestamp: '10:20 AM', status: 'read' },
    { id: 'msg-5', sender: 'me', content: 'Maybe later, I\'ll let you know.', timestamp: '10:25 AM', status: 'read' },
    { id: 'msg-6', sender: 'John Doe', content: 'Sure, no problem.', timestamp: '10:26 AM', status: 'read' },
    { id: 'msg-7', sender: 'me', content: 'See you tomorrow!', timestamp: '10:30 AM', status: 'read' }
  ],
  'chat-2': [
    { id: 'msg-8', sender: 'me', content: 'Reminder: Team meeting tomorrow at 2 PM', timestamp: '9:00 AM', status: 'sent' },
    { id: 'msg-9', sender: 'Marketing Team', content: 'Thanks for the reminder!', timestamp: '9:05 AM', status: 'sent' },
    { id: 'msg-10', sender: 'Marketing Team', content: 'I\'ve added it to my calendar.', timestamp: '9:07 AM', status: 'sent' },
    { id: 'msg-11', sender: 'Marketing Team', content: 'Meeting at 2 PM', timestamp: '9:15 AM', status: 'sent' }
  ]
};

const WhatsAppIntegration = () => {
  const [activeChat, setActiveChat] = useState('chat-1');
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentContact = contacts.find(contact => contact.id === activeChat) || contacts[0];
  const currentMessages = messages[activeChat as keyof typeof messages] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real implementation, this would send the message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">WhatsApp Integration</h1>
            <p className="text-gray-600">Communicate with your team directly from Probus</p>
          </div>
        </div>

        <Card className="h-[calc(100vh-200px)] flex">
          {/* Contacts Sidebar */}
          <div className="w-full md:w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search or start new chat"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 ${activeChat === contact.id ? 'bg-green-50' : ''
                    }`}
                  onClick={() => setActiveChat(contact.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                      <span className="text-xs text-gray-500">{contact.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                      {contact.unread > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col hidden md:flex">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={currentContact.avatar} alt={currentContact.name} />
                  <AvatarFallback>{currentContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">{currentContact.name}</h3>
                  <p className="text-sm text-gray-600">
                    {currentContact.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${msg.sender === 'me'
                          ? 'bg-green-500 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none border'
                        }`}
                    >
                      <p>{msg.content}</p>
                      <div className={`text-xs mt-1 flex items-center justify-end ${msg.sender === 'me' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                        {msg.timestamp}
                        {msg.sender === 'me' && (
                          <>
                            {msg.status === 'sent' ? (
                              <Check className="w-3 h-3 ml-1" />
                            ) : (
                              <CheckCheck className="w-3 h-3 ml-1" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                  <Input
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                {message.trim() ? (
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm">
                    <Mic className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppIntegration;
