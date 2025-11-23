import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Textarea } from "../../shared/ui/textarea";
import { Badge } from "../../shared/ui/badge";
import { Label } from "../../shared/ui/label";
import { Switch } from "../../shared/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../../shared/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import EmailSetup from '../../shared/forms/EmailSetup';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
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
  Plus,
  Settings,
  Inbox,
  FileText,
  Users,
  AlertCircle,
  RefreshCw,
  MoreVertical,
  Filter,
  SortAsc,
  Flag,
  CheckSquare,
  MailOpen,
  Download,
  Printer,
  Edit3,
  UserCircle,
  LogOut,
  LogIn,
  Key,
  Shield,
  Bell,
  Globe,
  Folder,
  Tag,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Email {
  id: string;
  sender: string;
  senderName: string;
  recipients: string[];
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  flagged: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'archive';
  labels?: string[];
  attachments?: Array<{
    name: string;
    size: string;
  }>;
}

interface EmailAccount {
  id: string;
  email: string;
  name: string;
  provider: string;
  isActive: boolean;
  unreadCount: number;
}

interface EmailSettings {
  signature: string;
  autoReply: boolean;
  autoReplyMessage: string;
  readReceipts: boolean;
  notificationsEnabled: boolean;
  defaultFontSize: string;
  conversationView: boolean;
}

const AdminEmail = () => {
  const { toast } = useToast();
  const [currentAccount, setCurrentAccount] = useState<string>('admin@company.com');
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([
    {
      id: '1',
      email: 'admin@company.com',
      name: 'Admin Account',
      provider: 'Company Mail',
      isActive: true,
      unreadCount: 2
    }
  ]);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    signature: 'Best regards,\nAdmin Team\nProbus Inc.',
    autoReply: false,
    autoReplyMessage: 'Thank you for your email. I will respond as soon as possible.',
    readReceipts: true,
    notificationsEnabled: true,
    defaultFontSize: 'medium',
    conversationView: true
  });
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'conversation'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'sender' | 'subject'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'unread' | 'starred' | 'flagged'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('general');
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      sender: 'hr@company.com',
      senderName: 'HR Department',
      recipients: ['admin@company.com'],
      subject: 'Monthly HR Report - November 2024',
      body: 'Dear Admin,\n\nPlease find attached the monthly HR report for November 2024. This report includes comprehensive data on employee attendance, new hires, resignations, and training programs.\n\nKey Highlights:\n- 5 new employees joined\n- 2 employees resigned\n- 95% average attendance\n- 3 training sessions conducted\n\nBest regards,\nHR Team',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      starred: true,
      flagged: false,
      folder: 'inbox',
      labels: ['Important', 'Reports'],
      attachments: [
        { name: 'HR_Report_Nov2024.pdf', size: '2.3 MB' }
      ]
    },
    {
      id: '2',
      sender: 'finance@company.com',
      senderName: 'Finance Department',
      recipients: ['admin@company.com'],
      subject: 'Budget Approval Request for Q1 2025',
      body: 'Hello Admin,\n\nWe need your approval for the Q1 2025 budget allocation. The total budget request is $500,000 distributed across all departments.\n\nPlease review and approve at your earliest convenience.\n\nThank you,\nFinance Team',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false,
      starred: false,
      flagged: true,
      folder: 'inbox',
      labels: ['Urgent']
    },
    {
      id: '3',
      sender: 'it@company.com',
      senderName: 'IT Support',
      recipients: ['admin@company.com'],
      subject: 'System Maintenance Scheduled - December 15',
      body: 'Dear Admin,\n\nThis is to inform you that we have scheduled system maintenance for December 15, 2024, from 2:00 AM to 6:00 AM.\n\nDuring this time, all systems will be unavailable. Please plan accordingly.\n\nBest regards,\nIT Support Team',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      starred: false,
      flagged: false,
      folder: 'inbox'
    },
    {
      id: '4',
      sender: 'manager@company.com',
      senderName: 'Department Manager',
      recipients: ['hr@company.com'],
      subject: 'Re: Employee Performance Review',
      body: 'Thank you for the update. I have completed the performance reviews for my team.\n\nBest regards,\nAdmin',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      starred: false,
      flagged: false,
      folder: 'sent'
    }
  ]);

  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash' | 'archive'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmailSetup, setShowEmailSetup] = useState(false);

  const filteredEmails = emails
    .filter(email => email.folder === activeFolder)
    .filter(email => {
      if (filterBy === 'unread') return !email.read;
      if (filterBy === 'starred') return email.starred;
      if (filterBy === 'flagged') return email.flagged;
      return true;
    })
    .filter(email => 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.body.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return b.timestamp.getTime() - a.timestamp.getTime();
      if (sortBy === 'sender') return a.senderName.localeCompare(b.senderName);
      if (sortBy === 'subject') return a.subject.localeCompare(b.subject);
      return 0;
    });

  const unreadCount = emails.filter(e => e.folder === 'inbox' && !e.read).length;
  const starredCount = emails.filter(e => e.starred).length;
  const flaggedCount = emails.filter(e => e.flagged).length;
  const draftsCount = emails.filter(e => e.folder === 'drafts').length;

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
    setComposeData({ 
      to: '', 
      subject: '', 
      body: emailSettings.signature ? `\n\n${emailSettings.signature}` : '' 
    });
  };

  const handleSendEmail = () => {
    if (!composeData.to || !composeData.subject) {
      toast({
        title: "Error",
        description: "Please fill in recipient and subject",
        variant: "destructive"
      });
      return;
    }

    const newEmail: Email = {
      id: Date.now().toString(),
      sender: 'admin@company.com',
      senderName: 'Admin',
      recipients: [composeData.to],
      subject: composeData.subject,
      body: composeData.body,
      timestamp: new Date(),
      read: true,
      starred: false,
      flagged: false,
      folder: 'sent',
      labels: []
    };

    setEmails([newEmail, ...emails]);
    setIsComposing(false);
    setComposeData({ to: '', subject: '', body: '' });

    toast({
      title: "Success",
      description: "Email sent successfully"
    });
  };

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    setIsComposing(false);
    
    if (!email.read) {
      setEmails(emails.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      ));
    }
  };

  const handleDeleteEmail = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, folder: 'trash' } : email
    ));
    setSelectedEmail(null);
    toast({
      title: "Success",
      description: "Email moved to trash"
    });
  };

  const handleStarEmail = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
  };

  const handleFlagEmail = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, flagged: !email.flagged } : email
    ));
  };

  const handleArchiveEmail = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, folder: 'archive' } : email
    ));
    setSelectedEmail(null);
    toast({
      title: "Success",
      description: "Email archived"
    });
  };

  const handleMarkAsRead = (id: string, read: boolean) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, read } : email
    ));
  };

  const handleSelectEmail = (id: string) => {
    const newSelection = new Set(selectedEmails);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedEmails(newSelection);
  };

  const handleBulkDelete = () => {
    setEmails(emails.map(email => 
      selectedEmails.has(email.id) ? { ...email, folder: 'trash' } : email
    ));
    setSelectedEmails(new Set());
    toast({
      title: "Success",
      description: `${selectedEmails.size} email(s) moved to trash`
    });
  };

  const handleBulkMarkRead = () => {
    setEmails(emails.map(email => 
      selectedEmails.has(email.id) ? { ...email, read: true } : email
    ));
    setSelectedEmails(new Set());
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshing",
      description: "Checking for new emails..."
    });
    setTimeout(() => {
      toast({
        title: "Updated",
        description: "Inbox is up to date"
      });
    }, 1000);
  };

  const handleAddAccount = () => {
    setShowEmailSetup(true);
  };

  const handleSignOut = (accountId: string) => {
    setEmailAccounts(emailAccounts.map(acc => 
      acc.id === accountId ? { ...acc, isActive: false } : acc
    ));
    toast({
      title: "Signed Out",
      description: "Account signed out successfully"
    });
  };

  const handleSignIn = (accountId: string) => {
    setEmailAccounts(emailAccounts.map(acc => 
      acc.id === accountId ? { ...acc, isActive: true } : acc
    ));
    toast({
      title: "Signed In",
      description: "Account signed in successfully"
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your email settings have been updated"
    });
    setShowSettings(false);
  };

  const handleReply = () => {
    if (selectedEmail) {
      setIsComposing(true);
      setComposeData({
        to: selectedEmail.sender,
        subject: `Re: ${selectedEmail.subject}`,
        body: `

---
On ${selectedEmail.timestamp.toLocaleString()}, ${selectedEmail.senderName} wrote:
${selectedEmail.body}`
      });
      setSelectedEmail(null);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (showEmailSetup) {
    return (
      <DashboardLayout>
        <EmailSetup onClose={() => setShowEmailSetup(false)} />
      </DashboardLayout>
    );
  }

  // Settings Dialog
  const renderSettingsDialog = () => (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto dark:bg-slate-800 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="dark:text-slate-100">Email Settings</DialogTitle>
          <DialogDescription className="dark:text-slate-400">
            Manage your email preferences and accounts
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={settingsTab} onValueChange={setSettingsTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4 dark:bg-slate-700">
            <TabsTrigger value="general" className="dark:data-[state=active]:bg-slate-600 dark:text-slate-300">General</TabsTrigger>
            <TabsTrigger value="accounts" className="dark:data-[state=active]:bg-slate-600 dark:text-slate-300">Accounts</TabsTrigger>
            <TabsTrigger value="signature" className="dark:data-[state=active]:bg-slate-600 dark:text-slate-300">Signature</TabsTrigger>
            <TabsTrigger value="rules" className="dark:data-[state=active]:bg-slate-600 dark:text-slate-300">Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-lg">
                <div>
                  <Label className="dark:text-slate-200">Auto Reply</Label>
                  <p className="text-sm text-blue-600 dark:text-slate-400">Send automatic replies when you're away</p>
                </div>
                <Switch 
                  checked={emailSettings.autoReply}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, autoReply: checked})}
                />
              </div>
              {emailSettings.autoReply && (
                <div className="ml-4 p-4 border dark:border-slate-700 rounded-lg">
                  <Label className="dark:text-slate-200">Auto Reply Message</Label>
                  <Textarea
                    value={emailSettings.autoReplyMessage}
                    onChange={(e) => setEmailSettings({...emailSettings, autoReplyMessage: e.target.value})}
                    rows={4}
                    className="mt-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  />
                </div>
              )}
              <div className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-lg">
                <div>
                  <Label className="dark:text-slate-200">Read Receipts</Label>
                  <p className="text-sm text-blue-600 dark:text-slate-400">Send read receipts when you open emails</p>
                </div>
                <Switch 
                  checked={emailSettings.readReceipts}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, readReceipts: checked})}
                />
              </div>
              <div className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-lg">
                <div>
                  <Label className="dark:text-slate-200">Notifications</Label>
                  <p className="text-sm text-blue-600 dark:text-slate-400">Get notified for new emails</p>
                </div>
                <Switch 
                  checked={emailSettings.notificationsEnabled}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, notificationsEnabled: checked})}
                />
              </div>
              <div className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-lg">
                <div>
                  <Label className="dark:text-slate-200">Conversation View</Label>
                  <p className="text-sm text-blue-600 dark:text-slate-400">Group related emails together</p>
                </div>
                <Switch 
                  checked={emailSettings.conversationView}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, conversationView: checked})}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4 mt-4">
            <div className="space-y-3">
              {emailAccounts.map((account) => (
                <div key={account.id} className="p-4 border dark:border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold dark:text-slate-100">{account.name}</div>
                        <div className="text-sm text-blue-600 dark:text-slate-400">{account.email}</div>
                        <div className="text-xs text-blue-500 dark:text-slate-500">{account.provider}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={account.isActive ? 'default' : 'outline'} className="dark:bg-slate-700">
                        {account.isActive ? 'Active' : 'Signed Out'}
                      </Badge>
                      {account.isActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSignOut(account.id)}
                          className="dark:border-slate-600 dark:text-slate-200"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSignIn(account.id)}
                          className="dark:border-slate-600 dark:text-slate-200"
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button
                onClick={handleAddAccount}
                variant="outline"
                className="w-full dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Email Account
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signature" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label className="dark:text-slate-200">Email Signature</Label>
                <p className="text-sm text-blue-600 dark:text-slate-400 mb-2">
                  This signature will be automatically added to your outgoing emails
                </p>
                <Textarea
                  value={emailSettings.signature}
                  onChange={(e) => setEmailSettings({...emailSettings, signature: e.target.value})}
                  rows={8}
                  placeholder="Best regards,\nYour Name\nYour Title"
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 font-mono"
                />
              </div>
              <div className="p-4 bg-blue-50 dark:bg-slate-700/50 rounded-lg">
                <Label className="dark:text-slate-200">Preview</Label>
                <div className="mt-2 whitespace-pre-wrap text-sm text-blue-700 dark:text-slate-300">
                  {emailSettings.signature || 'No signature set'}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4 mt-4">
            <div className="text-center py-8 text-blue-500 dark:text-slate-400">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Email rules and filters</p>
              <p className="text-sm">Coming soon: Auto-organize emails based on sender, subject, or content</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-slate-700">
          <Button variant="outline" onClick={() => setShowSettings(false)} className="dark:border-slate-600 dark:text-slate-200">
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout>
      {renderSettingsDialog()}
      <div className="bg-white dark:bg-slate-900 h-[calc(100vh-4rem)]">
        {/* Top Bar */}
        <div className="border-b dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-blue-900 dark:text-slate-100">Mail</h1>
              <Select value={currentAccount} onValueChange={setCurrentAccount}>
                <SelectTrigger className="w-64 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                  {emailAccounts.filter(acc => acc.isActive).map((account) => (
                    <SelectItem key={account.id} value={account.email} className="dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {account.email}
                        {account.unreadCount > 0 && (
                          <Badge className="ml-2 bg-blue-600 dark:bg-blue-500">{account.unreadCount}</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-8rem)]">
          {/* Left Sidebar */}
          <div className="w-64 border-r dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
            <div className="p-4 border-b dark:border-slate-800">
              <Button 
                onClick={handleCompose}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 h-11"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                New Email
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveFolder('inbox'); setSelectedEmail(null); setIsComposing(false); setSelectedEmails(new Set()); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                    activeFolder === 'inbox'
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Inbox className="w-5 h-5" />
                  <span className="flex-1 text-left">Inbox</span>
                  {unreadCount > 0 && (
                    <Badge className="bg-blue-600 dark:bg-blue-500 text-white text-xs">{unreadCount}</Badge>
                  )}
                </button>

                <button
                  onClick={() => { setActiveFolder('sent'); setSelectedEmail(null); setIsComposing(false); setSelectedEmails(new Set()); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                    activeFolder === 'sent'
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span>Sent</span>
                </button>

                <button
                  onClick={() => { setActiveFolder('drafts'); setSelectedEmail(null); setIsComposing(false); setSelectedEmails(new Set()); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                    activeFolder === 'drafts'
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="flex-1 text-left">Drafts</span>
                  {draftsCount > 0 && (
                    <Badge variant="outline" className="text-xs dark:border-slate-600">{draftsCount}</Badge>
                  )}
                </button>

                <button
                  onClick={() => { setActiveFolder('archive'); setSelectedEmail(null); setIsComposing(false); setSelectedEmails(new Set()); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                    activeFolder === 'archive'
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Archive className="w-5 h-5" />
                  <span>Archive</span>
                </button>
                
                <button
                  onClick={() => { setActiveFolder('trash'); setSelectedEmail(null); setIsComposing(false); setSelectedEmails(new Set()); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                    activeFolder === 'trash'
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Trash</span>
                </button>
              </nav>
              
              <div className="mt-4 pt-4 border-t dark:border-slate-800 space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                  Labels
                </div>
                {starredCount > 0 && (
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="flex-1 text-left">Starred</span>
                    <Badge variant="outline" className="text-xs dark:border-slate-600">{starredCount}</Badge>
                  </button>
                )}
                {flaggedCount > 0 && (
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800">
                    <Flag className="w-4 h-4 text-red-500" />
                    <span className="flex-1 text-left">Flagged</span>
                    <Badge variant="outline" className="text-xs dark:border-slate-600">{flaggedCount}</Badge>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Email List/Detail Area */}
          <div className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-900">
            {/* Action Bar */}
            {!isComposing && !selectedEmail && (
              <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedEmails.size > 0 ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBulkDelete}
                          className="dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete ({selectedEmails.size})
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBulkMarkRead}
                          className="dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <MailOpen className="w-4 h-4 mr-2" />
                          Mark Read
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEmails(new Set())}
                          className="dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                          <SelectTrigger className="w-32 h-8 text-sm dark:bg-slate-800 dark:border-slate-700">
                            <Filter className="w-3 h-3 mr-2" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-slate-800">
                            <SelectItem value="all" className="dark:text-slate-100">All</SelectItem>
                            <SelectItem value="unread" className="dark:text-slate-100">Unread</SelectItem>
                            <SelectItem value="starred" className="dark:text-slate-100">Starred</SelectItem>
                            <SelectItem value="flagged" className="dark:text-slate-100">Flagged</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                          <SelectTrigger className="w-32 h-8 text-sm dark:bg-slate-800 dark:border-slate-700">
                            <SortAsc className="w-3 h-3 mr-2" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-slate-800">
                            <SelectItem value="date" className="dark:text-slate-100">Date</SelectItem>
                            <SelectItem value="sender" className="dark:text-slate-100">Sender</SelectItem>
                            <SelectItem value="subject" className="dark:text-slate-100">Subject</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </div>
                  
                  <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                    <Input
                      placeholder="Search emails..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-8 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {isComposing ? (
              <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
                <div className="max-w-4xl mx-auto p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold dark:text-slate-100">New Message</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsComposing(false)}
                      className="dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </div>
                  <div className="space-y-4 border dark:border-slate-700 rounded-lg p-6">
                    <div className="flex items-center border-b dark:border-slate-700 pb-2">
                      <span className="w-20 text-sm font-medium dark:text-slate-300">To:</span>
                      <Input
                        placeholder="recipient@company.com"
                        value={composeData.to}
                        onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                        className="border-0 focus-visible:ring-0 dark:bg-transparent dark:text-slate-100"
                      />
                    </div>
                    <div className="flex items-center border-b dark:border-slate-700 pb-2">
                      <span className="w-20 text-sm font-medium dark:text-slate-300">Subject:</span>
                      <Input
                        placeholder="Email subject"
                        value={composeData.subject}
                        onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                        className="border-0 focus-visible:ring-0 dark:bg-transparent dark:text-slate-100"
                      />
                    </div>
                    <div className="mt-4">
                      <Textarea
                        placeholder="Write your message..."
                        value={composeData.body}
                        onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                        rows={16}
                        className="border-0 focus-visible:ring-0 resize-none dark:bg-transparent dark:text-slate-100"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t dark:border-slate-700">
                      <div className="flex gap-2">
                        <Button onClick={handleSendEmail} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                        <Button variant="outline" className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
                          <Paperclip className="w-4 h-4 mr-2" />
                          Attach
                        </Button>
                        <Button variant="ghost" className="dark:text-slate-300 dark:hover:bg-slate-800">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="dark:text-slate-400">
                        <Clock className="w-4 h-4 mr-2" />
                        Schedule Send
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedEmail ? (
              <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
                <div className="max-w-4xl mx-auto">
                  {/* Email Header */}
                  <div className="border-b dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <div className="p-4 flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEmail(null)}
                        className="dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleReply}
                          className="dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Reply className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStarEmail(selectedEmail.id)}
                          className="dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Star className={`w-4 h-4 ${selectedEmail.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagEmail(selectedEmail.id)}
                          className="dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Flag className={`w-4 h-4 ${selectedEmail.flagged ? 'fill-red-400 text-red-400' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchiveEmail(selectedEmail.id)}
                          className="dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEmail(selectedEmail.id)}
                          className="dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Email Content */}
                  <div className="p-6">
                    <h1 className="text-2xl font-semibold dark:text-slate-100 mb-6">{selectedEmail.subject}</h1>

                    <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-slate-700">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">
                          {selectedEmail.senderName.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-gray-900 dark:text-slate-100 text-lg">{selectedEmail.senderName}</div>
                          <div className="text-sm text-gray-500 dark:text-slate-500">
                            {selectedEmail.timestamp.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                          <span className="font-medium">From:</span> {selectedEmail.sender}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-slate-400">
                          <span className="font-medium">To:</span> {selectedEmail.recipients.join(', ')}
                        </div>
                        {selectedEmail.labels && selectedEmail.labels.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {selectedEmail.labels.map((label, index) => (
                              <Badge key={index} variant="outline" className="text-xs dark:border-slate-600">
                                <Tag className="w-3 h-3 mr-1" />
                                {label}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 dark:text-slate-300 text-base leading-relaxed">
                        {selectedEmail.body}
                      </div>
                    </div>

                    {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                        <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                          <Paperclip className="w-5 h-5" />
                          Attachments ({selectedEmail.attachments.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedEmail.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-sm transition-shadow"
                            >
                              <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-slate-100 truncate">{attachment.name}</div>
                                <div className="text-sm text-gray-600 dark:text-slate-400">{attachment.size}</div>
                              </div>
                              <Button variant="outline" size="sm" className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {filteredEmails.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                    <div className="text-center">
                      <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No emails in {activeFolder}</p>
                      <p className="text-sm mt-1">Your {activeFolder} is empty</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y dark:divide-slate-800">
                    {filteredEmails.map((email) => (
                      <div
                        key={email.id}
                        onClick={() => handleEmailSelect(email)}
                        className={`flex items-start gap-4 p-4 cursor-pointer transition-colors bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 ${
                          !email.read ? 'bg-blue-50/30 dark:bg-blue-500/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedEmails.has(email.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectEmail(email.id);
                            }}
                            className="w-4 h-4 rounded border-gray-300 dark:border-slate-600"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStarEmail(email.id);
                            }}
                            className="hover:scale-110 transition-transform"
                          >
                            <Star className={`w-4 h-4 ${email.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 dark:text-slate-600'}`} />
                          </button>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {email.senderName.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-semibold truncate ${
                              !email.read ? 'text-gray-900 dark:text-slate-100' : 'text-gray-700 dark:text-slate-300'
                            }`}>
                              {email.senderName}
                            </span>
                            {email.flagged && <Flag className="w-4 h-4 fill-red-400 text-red-400 flex-shrink-0" />}
                            {email.attachments && email.attachments.length > 0 && (
                              <Paperclip className="w-4 h-4 text-gray-400 dark:text-slate-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className={`text-sm mb-1 truncate ${
                            !email.read ? 'font-semibold text-gray-900 dark:text-slate-100' : 'text-gray-700 dark:text-slate-200'
                          }`}>
                            {email.subject}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-slate-400 truncate">
                            {email.body.substring(0, 120)}...
                          </div>
                          {email.labels && email.labels.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {email.labels.map((label, index) => (
                                <Badge key={index} variant="outline" className="text-xs dark:border-slate-600">
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="text-xs text-gray-500 dark:text-slate-500 whitespace-nowrap">
                            {formatTime(email.timestamp)}
                          </div>
                          {!email.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminEmail;
