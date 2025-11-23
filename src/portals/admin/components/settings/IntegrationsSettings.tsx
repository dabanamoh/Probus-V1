import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { Badge } from "../../../shared/ui/badge";
import { Input } from "../../../shared/ui/input";
import { Label } from "../../../shared/ui/label";
import { Switch } from "../../../shared/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../shared/ui/dialog";
import { 
  Mail, 
  Calendar, 
  MessageCircle, 
  Plug,
  CheckCircle,
  AlertCircle,
  Plus,
  ExternalLink,
  Video,
  Brain,
  Shield,
  Search,
  Settings,
  Trash2,
  RefreshCw,
  Link,
  Zap,
  Clock,
  Activity,
  Database,
  Cloud,
  Github,
  Slack,
  Chrome,
  Key,
  Globe,
  Code,
  BarChart,
  FileText,
  Droplet,
  Linkedin
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/ui/tabs";
import { useIntegrations, useConnectIntegration, useDisconnectIntegration } from '@/hooks/useIntegrations';
import { useToast } from '@/hooks/use-toast';
// TODO: Create these components when needed
// import IntegrationCard from '@/components/integrations/IntegrationCard';
// import AIMonitoringDashboard from '@/components/integrations/AIMonitoringDashboard';

const IntegrationsSettings = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [showWebhookDialog, setShowWebhookDialog] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [showAddIntegrationDialog, setShowAddIntegrationDialog] = useState(false);
  const [webhookData, setWebhookData] = useState({ name: '', url: '', events: [] });
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    description: '',
    category: '',
    icon: 'plug',
    apiUrl: '',
    authType: 'api_key'
  });
  const [integrationRequests, setIntegrationRequests] = useState([
    {
      id: '1',
      requestedBy: 'John Doe (HR)',
      integrationName: 'Asana',
      useCase: 'Project management for HR initiatives',
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'pending'
    },
    {
      id: '2',
      requestedBy: 'Sarah Manager (Manager)',
      integrationName: 'Trello',
      useCase: 'Task tracking for team collaboration',
      requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'pending'
    }
  ]);
  
  // Fetch integrations
  const { data: integrations = [], isLoading, error } = useIntegrations();
  
  // Mutation hooks for connecting/disconnecting
  const { mutate: connectIntegration } = useConnectIntegration();
  const { mutate: disconnectIntegration } = useDisconnectIntegration();
  
  const connectedIntegrations = integrations.filter(int => int.status === 'connected');
  
  // Filter integrations based on search
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  
  const filteredConnected = filteredIntegrations.filter(int => int.status === 'connected');
  const filteredDisconnected = filteredIntegrations.filter(int => int.status === 'disconnected');
  // Map integration icon names to actual components
  const getIntegrationIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail': return Mail;
      case 'calendar': return Calendar;
      case 'message-circle': return MessageCircle;
      case 'video': return Video;
      default: return Plug;
    }
  };

  const handleConnect = (integrationId: string) => {
    connectIntegration(integrationId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Integration connected successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to connect integration: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  };

  const handleDisconnect = (integrationId: string) => {
    disconnectIntegration(integrationId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Integration disconnected successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to disconnect integration: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  };
  
  const handleConfigure = (integration: any) => {
    setSelectedIntegration(integration);
    setShowConfigDialog(true);
  };
  
  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "Integration settings have been updated successfully.",
    });
    setShowConfigDialog(false);
  };
  
  const handleAddIntegration = () => {
    if (!newIntegration.name.trim() || !newIntegration.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Integration Added",
      description: `${newIntegration.name} has been added successfully and is now available to all users.`,
    });
    setNewIntegration({
      name: '',
      description: '',
      category: '',
      icon: 'plug',
      apiUrl: '',
      authType: 'api_key'
    });
    setShowAddIntegrationDialog(false);
  };
  
  const handleApproveRequest = (requestId: string) => {
    setIntegrationRequests(integrationRequests.filter(r => r.id !== requestId));
    toast({
      title: "Request Approved",
      description: "Integration request has been approved. The integration will be added soon.",
    });
  };
  
  const handleRejectRequest = (requestId: string) => {
    setIntegrationRequests(integrationRequests.filter(r => r.id !== requestId));
    toast({
      title: "Request Rejected",
      description: "Integration request has been rejected.",
    });
  };
  
  const handleAddWebhook = () => {
    if (!webhookData.name.trim() || !webhookData.url.trim()) {
      toast({
        title: "Error",
        description: "Please enter webhook name and URL",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Webhook Added",
      description: `Webhook "${webhookData.name}" has been created successfully.`,
    });
    setWebhookData({ name: '', url: '', events: [] });
    setShowWebhookDialog(false);
  };
  
  const handleGenerateApiKey = () => {
    const newKey = `pk_live_${Math.random().toString(36).substring(2, 18)}`;
    toast({
      title: "API Key Generated",
      description: "New API key has been generated. Make sure to save it securely.",
    });
    setShowApiKeyDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            {connectedIntegrations.length} of {integrations.length} apps connected
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
          <Input
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
          />
        </div>
      </div>

      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="dark:bg-slate-800">
          <TabsTrigger value="integrations" className="dark:data-[state=active]:bg-slate-700">
            <Plug className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="dark:data-[state=active]:bg-slate-700">
            <Shield className="w-4 h-4 mr-2" />
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="mt-6 space-y-6">
          {/* Integration Requests (Admin Only) */}
          {integrationRequests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">Integration Requests</h3>
              <div className="space-y-3">
                {integrationRequests.map((request) => (
                  <div key={request.id} className="p-4 border dark:border-slate-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold dark:text-slate-100">{request.integrationName}</h4>
                          <Badge variant="outline" className="text-xs dark:border-amber-500 dark:text-amber-400">
                            Pending
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">{request.useCase}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-500">
                          <span>Requested by: {request.requestedBy}</span>
                          <span>•</span>
                          <span>{request.requestedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700 dark:bg-green-500"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRejectRequest(request.id)}
                          className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Connected Apps */}
          {filteredConnected.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">Connected</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredConnected.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    id={integration.id}
                    name={integration.name}
                    description={integration.description}
                    icon={integration.icon}
                    category={integration.category}
                    status={integration.status}
                    connectedAt={integration.connectedAt}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Available Apps */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100">Available</h3>
              <div className="flex gap-2">
                <Dialog open={showWebhookDialog} onOpenChange={setShowWebhookDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="dark:border-slate-600">
                      <Zap className="w-4 h-4 mr-2" />
                      Add Webhook
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="dark:bg-slate-800 dark:border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="dark:text-slate-100">Add New Webhook</DialogTitle>
                      <DialogDescription className="dark:text-slate-400">
                        Configure a webhook to receive real-time notifications
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label className="dark:text-slate-200">Webhook Name *</Label>
                        <Input 
                          placeholder="e.g., Employee Events"
                          value={webhookData.name}
                          onChange={(e) => setWebhookData({ ...webhookData, name: e.target.value })}
                          className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="dark:text-slate-200">Webhook URL *</Label>
                        <Input 
                          placeholder="https://api.yourapp.com/webhooks/..."
                          value={webhookData.url}
                          onChange={(e) => setWebhookData({ ...webhookData, url: e.target.value })}
                          className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" 
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleAddWebhook} className="flex-1">
                          Create Webhook
                        </Button>
                        <Button variant="outline" onClick={() => setShowWebhookDialog(false)} className="dark:border-slate-600">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="dark:border-slate-600">
                      <Key className="w-4 h-4 mr-2" />
                      Generate API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="dark:bg-slate-800 dark:border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="dark:text-slate-100">Generate API Key</DialogTitle>
                      <DialogDescription className="dark:text-slate-400">
                        Generate a new API key for programmatic access to Probus
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                          <div className="text-sm text-amber-800 dark:text-amber-300">
                            <p className="font-medium mb-1">Important Security Notice</p>
                            <p>Make sure to copy and save your API key securely. You won't be able to see it again after closing this dialog.</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="dark:text-slate-200">Key Type</Label>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 dark:border-slate-600">Production</Button>
                          <Button variant="outline" className="flex-1 dark:border-slate-600">Development</Button>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleGenerateApiKey} className="flex-1">
                          Generate Key
                        </Button>
                        <Button variant="outline" onClick={() => setShowApiKeyDialog(false)} className="dark:border-slate-600">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showAddIntegrationDialog} onOpenChange={setShowAddIntegrationDialog}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Integration
                    </Button>
                  </DialogTrigger>
                <DialogContent className="dark:bg-slate-800 dark:border-slate-700 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="dark:text-slate-100">Add New Integration</DialogTitle>
                    <DialogDescription className="dark:text-slate-400">
                      Add a new integration/API that will be available to all users
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="dark:text-slate-200">Integration Name *</Label>
                        <Input 
                          placeholder="e.g., Slack, Teams, Jira"
                          value={newIntegration.name}
                          onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                          className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="dark:text-slate-200">Category *</Label>
                        <Input 
                          placeholder="e.g., communication, productivity"
                          value={newIntegration.category}
                          onChange={(e) => setNewIntegration({ ...newIntegration, category: e.target.value })}
                          className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-slate-200">Description *</Label>
                      <Input 
                        placeholder="Brief description of the integration"
                        value={newIntegration.description}
                        onChange={(e) => setNewIntegration({ ...newIntegration, description: e.target.value })}
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-slate-200">API URL</Label>
                      <Input 
                        placeholder="https://api.service.com/v1"
                        value={newIntegration.apiUrl}
                        onChange={(e) => setNewIntegration({ ...newIntegration, apiUrl: e.target.value })}
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-slate-200">Authentication Type</Label>
                      <select 
                        value={newIntegration.authType}
                        onChange={(e) => setNewIntegration({ ...newIntegration, authType: e.target.value })}
                        className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                      >
                        <option value="api_key">API Key</option>
                        <option value="oauth">OAuth 2.0</option>
                        <option value="basic">Basic Auth</option>
                        <option value="bearer">Bearer Token</option>
                      </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleAddIntegration} className="flex-1">
                        Add Integration
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddIntegrationDialog(false)} className="dark:border-slate-600">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
            
            {filteredDisconnected.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-slate-400">No apps found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDisconnected.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    id={integration.id}
                    name={integration.name}
                    description={integration.description}
                    icon={integration.icon}
                    category={integration.category}
                    status={integration.status}
                    connectedAt={integration.connectedAt}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="mt-6">
          <AIMonitoringDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsSettings;
