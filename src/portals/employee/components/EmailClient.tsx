import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button, buttonVariants } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Textarea } from "../../shared/ui/textarea";
import EmailSetup from '../../shared/forms/EmailSetup';
import { 
  Search, 
  Mail, 
  Send, 
  Paperclip, 
  Archive, 
  Trash2, 
  Reply, 
  Forward,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings
} from 'lucide-react';
// TODO: Re-enable when emailService is available
// import { logEmailSend, logEmailReceive, logEmailDelete } from '@/employee-app/services/emailService';

interface Email {
  id: string;
  sender: string;
  senderName: string;
  recipients: string[];
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
  attachments?: Array<{
    name: string;
    size: string;
  }>;
}

const EmailClient = () => {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      sender: 'manager@company.com',
      senderName: 'Sarah Johnson',
      recipients: ['john.doe@company.com'],
      subject: 'Q3 Project Update',
      body: 'Hi John,\n\nI wanted to check in on the progress of the Q3 project. Please send me an update by Friday.\n\nBest regards,\nSarah',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false,
      folder: 'inbox'
    },
    {
      id: '2',
      sender: 'hr@company.com',
      senderName: 'HR Department',
      recipients: ['all@company.com'],
      subject: 'Upcoming Company Event',
      body: 'Dear Team,\n\nWe\'re excited to announce our annual company retreat scheduled for next month. More details to follow.\n\nHR Team',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      folder: 'inbox'
    },
    {
      id: '3',
      sender: 'john.doe@company.com',
      senderName: 'John Doe',
      recipients: ['client@external.com'],
      subject: 'Proposal Review',
      body: 'Hi Client,\n\nAttached is the proposal for your review. Please let me know if you have any questions.\n\nBest,\nJohn',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      folder: 'sent'
    }
  ]);
  
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  const filteredEmails = emails
    .filter(email => email.folder === activeFolder)
    .filter(email => 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.body.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
    setComposeData({ to: '', subject: '', body: '' });
  };

  const handleSendEmail = async () => {
    if (!composeData.to || !composeData.subject) return;

    const newEmail: Email = {
      id: Date.now().toString(),
      sender: 'john.doe@company.com',
      senderName: 'John Doe',
      recipients: [composeData.to],
      subject: composeData.subject,
      body: composeData.body,
      timestamp: new Date(),
      read: true,
      folder: 'sent'
    };

    setEmails([newEmail, ...emails]);
    setIsComposing(false);

    // Log email send event
    // TODO: Re-enable when emailService is available
    // try {
    //   await logEmailSend(
    //     composeData.subject,
    //     'john.doe@company.com',
    //     [composeData.to],
    //     newEmail.id
    //   );
    // } catch (error) {
    //   console.error('Error logging email send:', error);
    // }
  };

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    
    // Mark as read
    if (!email.read) {
      setEmails(emails.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      ));
    }
  };

  const handleDeleteEmail = async (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, folder: 'trash' } : email
    ));

    // Log email delete event
    // TODO: Re-enable when emailService is available
    // try {
    //   await logEmailDelete(id, 'employee-123');
    // } catch (error) {
    //   console.error('Error logging email delete:', error);
    // }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Show email setup if requested
  if (showEmailSetup) {
    return <EmailSetup onClose={() => setShowEmailSetup(false)} />;
  }

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Email Client</h1>
            <p className="text-gray-600 text-sm md:text-base">Send, receive, and manage your corporate emails</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowEmailSetup(true)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Email Setup
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 md:gap-6 flex-col md:flex-row">
        {/* Sidebar - hidden on mobile when viewing email or composing */}
        <div className={`md:block ${(!isComposing && !selectedEmail) || selectedEmail ? 'block' : 'hidden'} md:w-64 flex-shrink-0`}>
          <Card className="md:w-64 w-full">
            <CardContent className="p-3 md:p-4">
              <Button 
                onClick={handleCompose}
                className="w-full mb-4 md:mb-6 bg-blue-500 hover:bg-blue-600 text-sm md:text-base"
              >
                <Plus className="w-4 h-4 mr-2" />
                Compose
              </Button>
              
              <nav className="space-y-1">
                {([
                  { id: 'inbox', label: 'Inbox', count: emails.filter(e => e.folder === 'inbox' && !e.read).length },
                  { id: 'sent', label: 'Sent', count: emails.filter(e => e.folder === 'sent').length },
                  { id: 'drafts', label: 'Drafts', count: emails.filter(e => e.folder === 'drafts').length },
                  { id: 'trash', label: 'Trash', count: emails.filter(e => e.folder === 'trash').length }
                ] as const).map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setActiveFolder(folder.id);
                      setSelectedEmail(null);
                      setIsComposing(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 md:px-3 md:py-2 rounded-lg text-left text-sm md:text-base ${
                      activeFolder === folder.id 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 md:mr-3" />
                      {folder.label}
                    </span>
                    {folder.count > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {folder.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <Card className="mb-3 md:mb-4">
            <CardContent className="p-3 md:p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm md:text-base"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-1 gap-3 md:gap-4 flex-col">
            {/* Email List - hidden on mobile when viewing email or composing */}
            {(!isComposing && !selectedEmail) && (
              <Card className="flex-1">
                <CardHeader className="p-3 md:p-6">
                  <CardTitle className="text-base md:text-lg capitalize">{activeFolder}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredEmails.map(email => (
                      <div 
                        key={email.id}
                        className={`p-3 md:p-4 cursor-pointer hover:bg-gray-50 ${
                          email.read ? 'bg-white' : 'bg-blue-50'
                        }`}
                        onClick={() => handleEmailSelect(email)}
                      >
                        <div className="flex items-center">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <h3 className={`font-medium truncate text-sm md:text-base ${
                                email.read ? 'text-gray-900' : 'text-gray-900 font-semibold'
                              }`}>
                                {email.senderName}
                              </h3>
                              {!email.read && (
                                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-xs md:text-sm text-gray-600 truncate mt-1">
                              {email.subject}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-1 hidden md:block">
                              {email.body.substring(0, 100)}...
                            </p>
                          </div>
                          <div className="ml-2 md:ml-4 text-xs text-gray-500 whitespace-nowrap">
                            {formatTime(email.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Email Composition */}
            {isComposing && (
              <Card className="flex-1 flex flex-col">
                <CardHeader className="p-3 md:p-6">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base md:text-lg">New Message</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsComposing(false)}
                      className="text-xs md:text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-3 md:p-6">
                  <div className="space-y-3 md:space-y-4 flex-1">
                    <div>
                      <Input
                        placeholder="To"
                        value={composeData.to}
                        onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Subject"
                        value={composeData.subject}
                        onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                        className="text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Compose your message..."
                        value={composeData.body}
                        onChange={(e) => setComposeData({...composeData, body: e.target.value})}
                        className="h-full min-h-[200px] md:min-h-[300px] text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Paperclip className="w-3 h-3 mr-1" />
                        Attach
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSendEmail}
                        className="bg-blue-500 hover:bg-blue-600 text-xs"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Email View */}
            {selectedEmail && !isComposing && (
              <Card className="flex-1 flex flex-col">
                <CardHeader className="p-3 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div>
                      <CardTitle className="text-base md:text-lg">{selectedEmail.subject}</CardTitle>
                      <p className="text-gray-600 text-xs md:text-sm mt-1">
                        From: {selectedEmail.senderName} &lt;{selectedEmail.sender}&gt;
                      </p>
                      <p className="text-gray-600 text-xs md:text-sm">
                        To: {selectedEmail.recipients.join(', ')}
                      </p>
                    </div>
                    <div className="flex space-x-1 md:space-x-2">
                      <Button variant="outline" size="sm" className="text-xs p-2 md:p-3">
                        <Reply className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs p-2 md:p-3">
                        <Forward className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteEmail(selectedEmail.id)}
                        className="text-xs p-2 md:p-3"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedEmail(null)}
                        className="text-xs p-2 md:p-3 md:hidden"
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-3 md:p-6">
                  <div className="mb-3 md:mb-4 text-xs md:text-sm text-gray-500">
                    {formatTime(selectedEmail.timestamp)}
                  </div>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-sm md:text-base">{selectedEmail.body}</p>
                  </div>
                  
                  {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                    <div className="mt-4 md:mt-6">
                      <h4 className="font-medium mb-2 text-sm md:text-base">Attachments</h4>
                      <div className="space-y-2">
                        {selectedEmail.attachments.map((attachment, index) => (
                          <div key={index} className="flex flex-col sm:flex-row sm:items-center p-2 border rounded gap-2">
                            <div className="flex items-center">
                              <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium">{attachment.name}</p>
                                <p className="text-xs text-gray-500">{attachment.size}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="text-xs whitespace-nowrap w-full sm:w-auto">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailClient;
