// Mock service for handling app integrations
// In a real implementation, this would connect to a backend API

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error';
  connectedAt: string | null;
  configuration?: Record<string, unknown>;
}

class IntegrationService {
  // Mock data for integrations
  private integrations: Integration[] = [
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Connect your Gmail account to manage emails directly from Probus',
      icon: 'mail',
      category: 'Communication',
      status: 'connected',
      connectedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'trello',
      name: 'Trello',
      description: 'Sync your Trello boards and cards with Probus tasks',
      icon: 'calendar',
      category: 'Project Management',
      status: 'connected',
      connectedAt: '2024-01-20T14:45:00Z'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Send and receive WhatsApp messages through Probus',
      icon: 'message-circle',
      category: 'Communication',
      status: 'connected',
      connectedAt: '2024-01-25T09:15:00Z'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Integrate Slack channels and direct messages',
      icon: 'message-circle',
      category: 'Communication',
      status: 'connected',
      connectedAt: '2024-02-01T11:20:00Z'
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Schedule and manage Zoom meetings',
      icon: 'video',
      category: 'Communication',
      status: 'connected',
      connectedAt: '2024-02-05T16:30:00Z'
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      description: 'Connect with Microsoft Teams for chat and meetings',
      icon: 'message-circle',
      category: 'Communication',
      status: 'disconnected',
      connectedAt: null
    },
    {
      id: 'asana',
      name: 'Asana',
      description: 'Manage projects and tasks with Asana integration',
      icon: 'calendar',
      category: 'Project Management',
      status: 'disconnected',
      connectedAt: null
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Access and manage files from Google Drive',
      icon: 'mail',
      category: 'File Storage',
      status: 'disconnected',
      connectedAt: null
    }
  ];

  // Get all integrations
  async getAllIntegrations(): Promise<Integration[]> {
    // In a real implementation, this would fetch from an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.integrations);
      }, 300);
    });
  }

  // Get connected integrations
  async getConnectedIntegrations(): Promise<Integration[]> {
    const integrations = await this.getAllIntegrations();
    return integrations.filter(int => int.status === 'connected');
  }

  // Get disconnected integrations
  async getDisconnectedIntegrations(): Promise<Integration[]> {
    const integrations = await this.getAllIntegrations();
    return integrations.filter(int => int.status === 'disconnected');
  }

  // Connect an integration
  async connectIntegration(id: string): Promise<Integration> {
    const integration = this.integrations.find(int => int.id === id);
    if (!integration) {
      throw new Error(`Integration with id ${id} not found`);
    }

    // In a real implementation, this would initiate OAuth flow
    integration.status = 'connected';
    integration.connectedAt = new Date().toISOString();

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(integration);
      }, 500);
    });
  }

  // Disconnect an integration
  async disconnectIntegration(id: string): Promise<Integration> {
    const integration = this.integrations.find(int => int.id === id);
    if (!integration) {
      throw new Error(`Integration with id ${id} not found`);
    }

    integration.status = 'disconnected';
    integration.connectedAt = null;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(integration);
      }, 500);
    });
  }

  // Get integration by ID
  async getIntegrationById(id: string): Promise<Integration | undefined> {
    const integrations = await this.getAllIntegrations();
    return integrations.find(int => int.id === id);
  }
}

export default new IntegrationService();