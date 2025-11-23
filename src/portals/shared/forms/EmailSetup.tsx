import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../../shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { 
  Mail, 
  Plus, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Server,
  Lock,
  Globe,
  Trash2,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';

interface EmailAccount {
  id: string;
  name: string;
  email: string;
  provider: string;
  isDefault: boolean;
  status: 'connected' | 'error' | 'testing';
  lastSync: string;
}

interface EmailSetupProps {
  onClose?: () => void;
}

const EmailSetup = ({ onClose }: EmailSetupProps) => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<EmailAccount[]>([
    {
      id: '1',
      name: 'Work Email',
      email: 'john.doe@company.com',
      provider: 'Microsoft Exchange',
      isDefault: true,
      status: 'connected',
      lastSync: '2 minutes ago'
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    accountName: '',
    email: '',
    password: '',
    provider: '',
    incomingServer: '',
    incomingPort: '993',
    incomingEncryption: 'SSL',
    outgoingServer: '',
    outgoingPort: '587',
    outgoingEncryption: 'STARTTLS',
    username: ''
  });

  const emailProviders = [
    { value: 'outlook', label: 'Outlook.com / Hotmail', incoming: 'outlook.office365.com', outgoing: 'smtp.office365.com' },
    { value: 'gmail', label: 'Gmail', incoming: 'imap.gmail.com', outgoing: 'smtp.gmail.com' },
    { value: 'yahoo', label: 'Yahoo Mail', incoming: 'imap.mail.yahoo.com', outgoing: 'smtp.mail.yahoo.com' },
    { value: 'exchange', label: 'Microsoft Exchange', incoming: 'outlook.office365.com', outgoing: 'smtp.office365.com' },
    { value: 'custom', label: 'Other (Custom Settings)', incoming: '', outgoing: '' }
  ];

  const handleProviderChange = (provider: string) => {
    const providerData = emailProviders.find(p => p.value === provider);
    if (providerData && provider !== 'custom') {
      setFormData(prev => ({
        ...prev,
        provider,
        incomingServer: providerData.incoming,
        outgoingServer: providerData.outgoing,
        incomingPort: provider === 'gmail' ? '993' : '993',
        outgoingPort: provider === 'gmail' ? '587' : '587'
      }));
    } else {
      setFormData(prev => ({ ...prev, provider }));
    }
  };

  const handleTestConnection = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please enter your email and password to test the connection.",
        variant: "destructive",
      });
      return;
    }

    setTestingConnection(true);
    
    // Simulate connection test
    setTimeout(() => {
      setTestingConnection(false);
      toast({
        title: "Connection Successful",
        description: "Your email account has been successfully configured!",
      });
    }, 3000);
  };

  const handleAddAccount = () => {
    if (!formData.accountName || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newAccount: EmailAccount = {
      id: Date.now().toString(),
      name: formData.accountName,
      email: formData.email,
      provider: emailProviders.find(p => p.value === formData.provider)?.label || 'Custom',
      isDefault: accounts.length === 0,
      status: 'connected',
      lastSync: 'Just now'
    };

    setAccounts([...accounts, newAccount]);
    setFormData({
      accountName: '',
      email: '',
      password: '',
      provider: '',
      incomingServer: '',
      incomingPort: '993',
      incomingEncryption: 'SSL',
      outgoingServer: '',
      outgoingPort: '587',
      outgoingEncryption: 'STARTTLS',
      username: ''
    });
    setShowAddForm(false);

    toast({
      title: "Account Added",
      description: "Your email account has been successfully added!",
    });
  };

  const handleRemoveAccount = (accountId: string) => {
    setAccounts(accounts.filter(acc => acc.id !== accountId));
    toast({
      title: "Account Removed",
      description: "Email account has been removed successfully.",
    });
  };

  const handleSetDefault = (accountId: string) => {
    setAccounts(accounts.map(acc => ({
      ...acc,
      isDefault: acc.id === accountId
    })));
    toast({
      title: "Default Account Updated",
      description: "Default email account has been updated.",
    });
  };

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-50 min-h-screen overflow-x-hidden max-w-full">
      <div className="max-w-4xl mx-auto max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 max-w-full">
          <div className="flex items-center gap-3 max-w-full overflow-x-hidden">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Email Setup</h1>
              <p className="text-gray-600">Configure your email accounts for seamless integration</p>
            </div>
          </div>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Done
            </Button>
          )}
        </div>

        <Tabs defaultValue="accounts" className="w-full max-w-full overflow-x-hidden">
          <TabsList className="grid w-full grid-cols-2 max-w-full">
            <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-6 max-w-full overflow-x-hidden">
            {/* Current Accounts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Connected Email Accounts
                  </CardTitle>
                  <Button onClick={() => setShowAddForm(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Account
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {accounts.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Email Accounts</h3>
                    <p className="text-gray-600 mb-4">Add your first email account to get started</p>
                    <Button onClick={() => setShowAddForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Email Account
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {accounts.map((account) => (
                      <div key={account.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-800">{account.name}</h4>
                                {account.isDefault && (
                                  <Badge variant="secondary">Default</Badge>
                                )}
                                <div className="flex items-center gap-1">
                                  {account.status === 'connected' && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                  {account.status === 'error' && (
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{account.email}</p>
                              <p className="text-xs text-gray-500">{account.provider} • Last sync: {account.lastSync}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!account.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefault(account.id)}
                              >
                                Set as Default
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveAccount(account.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add New Account Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Email Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-w-full overflow-x-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input
                        id="accountName"
                        placeholder="e.g., Work Email"
                        value={formData.accountName}
                        onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your email password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider">Email Provider</Label>
                    <Select value={formData.provider} onValueChange={handleProviderChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your email provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {emailProviders.map((provider) => (
                          <SelectItem key={provider.value} value={provider.value}>
                            {provider.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Server Settings - Always Visible */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Server className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-800">Server Settings</h4>
                      <div className="flex items-center gap-1 text-blue-600">
                        <Info className="w-4 h-4" />
                        <span className="text-sm">Configure your email servers</span>
                      </div>
                    </div>
                    
                    {!formData.provider && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Info className="w-5 h-5 text-blue-600" />
                          <div>
                            <h5 className="font-medium text-blue-900">Select a Provider</h5>
                            <p className="text-sm text-blue-700">Choose your email provider above to auto-configure server settings, or select "Other" for custom configuration.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-full">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-green-600" />
                          <h5 className="font-medium text-gray-700">Incoming Mail (IMAP)</h5>
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="incomingServer" className="flex items-center gap-2">
                              Server Address
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="incomingServer"
                              placeholder="imap.provider.com"
                              value={formData.incomingServer}
                              onChange={(e) => setFormData(prev => ({ ...prev, incomingServer: e.target.value }))}
                              className={!formData.incomingServer && formData.provider ? 'border-red-300' : ''}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3 max-w-full">
                            <div className="space-y-2">
                              <Label htmlFor="incomingPort" className="flex items-center gap-2">
                                Port
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="incomingPort"
                                value={formData.incomingPort}
                                onChange={(e) => setFormData(prev => ({ ...prev, incomingPort: e.target.value }))}
                                placeholder="993"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="incomingEncryption">Security</Label>
                              <Select 
                                value={formData.incomingEncryption} 
                                onValueChange={(value) => setFormData(prev => ({ ...prev, incomingEncryption: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SSL">SSL/TLS</SelectItem>
                                  <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                                  <SelectItem value="None">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-blue-600" />
                          <h5 className="font-medium text-gray-700">Outgoing Mail (SMTP)</h5>
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="outgoingServer" className="flex items-center gap-2">
                              Server Address
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="outgoingServer"
                              placeholder="smtp.provider.com"
                              value={formData.outgoingServer}
                              onChange={(e) => setFormData(prev => ({ ...prev, outgoingServer: e.target.value }))}
                              className={!formData.outgoingServer && formData.provider ? 'border-red-300' : ''}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3 max-w-full">
                            <div className="space-y-2">
                              <Label htmlFor="outgoingPort" className="flex items-center gap-2">
                                Port
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="outgoingPort"
                                value={formData.outgoingPort}
                                onChange={(e) => setFormData(prev => ({ ...prev, outgoingPort: e.target.value }))}
                                placeholder="587"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="outgoingEncryption">Security</Label>
                              <Select 
                                value={formData.outgoingEncryption} 
                                onValueChange={(value) => setFormData(prev => ({ ...prev, outgoingEncryption: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                                  <SelectItem value="SSL">SSL/TLS</SelectItem>
                                  <SelectItem value="None">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Authentication Settings */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Lock className="w-4 h-4 text-gray-600" />
                        <h5 className="font-medium text-gray-700">Authentication Settings</h5>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username (if different from email)</Label>
                          <Input
                            id="username"
                            placeholder="Leave blank to use email address"
                            value={formData.username}
                            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          />
                          <p className="text-xs text-gray-500">Some providers require a specific username format</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Provider-specific hints */}
                    {formData.provider && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-blue-900 mb-2">Provider-Specific Information</h5>
                            {formData.provider === 'gmail' && (
                              <div className="text-sm text-blue-800">
                                <p className="mb-1">• Enable 2-factor authentication and use an App Password instead of your regular password</p>
                                <p className="mb-1">• IMAP must be enabled in Gmail settings</p>
                                <p>• Use your full Gmail address as username</p>
                              </div>
                            )}
                            {formData.provider === 'outlook' && (
                              <div className="text-sm text-blue-800">
                                <p className="mb-1">• Use your full Outlook.com email address</p>
                                <p className="mb-1">• Enable 2-factor authentication for better security</p>
                                <p>• OAuth2 authentication is recommended</p>
                              </div>
                            )}
                            {formData.provider === 'exchange' && (
                              <div className="text-sm text-blue-800">
                                <p className="mb-1">• Contact your IT administrator for server details</p>
                                <p className="mb-1">• May require domain\\username format</p>
                                <p>• Often uses autodiscovery for server configuration</p>
                              </div>
                            )}
                            {formData.provider === 'yahoo' && (
                              <div className="text-sm text-blue-800">
                                <p className="mb-1">• Generate an App Password in Yahoo security settings</p>
                                <p className="mb-1">• Use the App Password instead of your regular password</p>
                                <p>• IMAP access must be enabled</p>
                              </div>
                            )}
                            {formData.provider === 'custom' && (
                              <div className="text-sm text-blue-800">
                                <p className="mb-1">• Contact your email provider for server settings</p>
                                <p className="mb-1">• Verify port numbers and encryption methods</p>
                                <p>• Test connection before saving</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-6 border-t max-w-full">
                    <Button
                      onClick={handleTestConnection}
                      disabled={testingConnection || !formData.email || !formData.password}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {testingConnection ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                          Testing Connection...
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          Test Connection
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleAddAccount}
                      disabled={!formData.accountName || !formData.email || !formData.password || testingConnection}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Account
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 max-w-full overflow-x-hidden">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Sync Frequency</h4>
                      <p className="text-sm text-gray-600">How often to check for new emails</p>
                    </div>
                    <Select defaultValue="15">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified of new emails instantly</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Signature</h4>
                      <p className="text-sm text-gray-600">Default signature for outgoing emails</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmailSetup;
