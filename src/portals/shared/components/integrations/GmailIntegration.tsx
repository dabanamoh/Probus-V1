import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Textarea } from "../../shared/ui/textarea";
import { Mail, Send, Inbox, Archive, Trash2, Star, Paperclip } from 'lucide-react';

const GmailIntegration = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [composeOpen, setComposeOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    body: ''
  });

  // Mock email data
  const emails = [
    {
      id: '1',
      from: 'john.doe@company.com',
      subject: 'Project Update - Q2 Roadmap',
      preview: 'Here\'s the latest update on our Q2 roadmap...',
      timestamp: '2 hours ago',
      read: false,
      starred: true
    },
    {
      id: '2',
      from: 'marketing@company.com',
      subject: 'Marketing Campaign Results',
      preview: 'The results from our latest marketing campaign are in...',
      timestamp: '4 hours ago',
      read: true,
      starred: false
    },
    {
      id: '3',
      from: 'notifications@system.com',
      subject: 'System Maintenance Notice',
      preview: 'Scheduled maintenance will occur this weekend...',
      timestamp: '1 day ago',
      read: true,
      starred: false
    }
  ];

  const handleComposeEmail = () => {
    setComposeOpen(true);
  };

  const handleSendEmail = () => {
    // In a real implementation, this would send the email
    console.log('Sending email:', emailForm);
    setEmailForm({ to: '', subject: '', body: '' });
    setComposeOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <Mail className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gmail Integration</h1>
            <p className="text-gray-600">Manage your emails directly from Probus</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <Button 
                  className="w-full mb-4 bg-red-500 hover:bg-red-600"
                  onClick={handleComposeEmail}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Compose
                </Button>
                
                <nav className="space-y-1">
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                      activeTab === 'inbox' 
                        ? 'bg-red-50 text-red-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('inbox')}
                  >
                    <Inbox className="w-4 h-4" />
                    Inbox
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>
                  </button>
                  
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                      activeTab === 'starred' 
                        ? 'bg-red-50 text-red-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('starred')}
                  >
                    <Star className="w-4 h-4" />
                    Starred
                  </button>
                  
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                      activeTab === 'archive' 
                        ? 'bg-red-50 text-red-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('archive')}
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                  
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                      activeTab === 'trash' 
                        ? 'bg-red-50 text-red-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('trash')}
                  >
                    <Trash2 className="w-4 h-4" />
                    Trash
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {composeOpen ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Compose Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="to">To</Label>
                      <Input
                        id="to"
                        name="to"
                        value={emailForm.to}
                        onChange={handleInputChange}
                        placeholder="recipient@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={emailForm.subject}
                        onChange={handleInputChange}
                        placeholder="Email subject"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="body">Message</Label>
                      <Textarea
                        id="body"
                        name="body"
                        value={emailForm.body}
                        onChange={handleInputChange}
                        placeholder="Write your message here..."
                        rows={10}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button onClick={handleSendEmail}>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setComposeOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="ghost">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Inbox className="w-5 h-5" />
                    Inbox
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {emails.map((email) => (
                      <div 
                        key={email.id} 
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          email.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Star 
                            className={`w-4 h-4 mt-1 flex-shrink-0 ${
                              email.starred ? 'text-yellow-500 fill-current' : 'text-gray-400'
                            }`} 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`font-medium truncate ${email.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                {email.from}
                              </p>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {email.timestamp}
                              </span>
                            </div>
                            <p className={`font-medium ${email.read ? 'text-gray-800' : 'text-gray-900'}`}>
                              {email.subject}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {email.preview}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GmailIntegration;
