// Mock service for AI monitoring of integrated apps
// In a real implementation, this would connect to AI analytics systems

export interface ThreatAlert {
  id: string;
  integrationId: string;
  integrationName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'dismissed';
}

export interface ProductivityInsight {
  id: string;
  integrationId: string;
  integrationName: string;
  title: string;
  description: string;
  timestamp: string;
  impact: 'positive' | 'negative' | 'neutral';
  metric?: string;
  value?: number;
}

export interface ComplianceIssue {
  id: string;
  integrationId: string;
  integrationName: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved' | 'acknowledged';
}

class AIMonitoringService {
  // Mock data for threat alerts
  private threatAlerts: ThreatAlert[] = [
    {
      id: 'alert-1',
      integrationId: 'gmail',
      integrationName: 'Gmail',
      severity: 'high',
      title: 'Suspicious Login Attempt',
      description: 'Multiple failed login attempts detected from unfamiliar IP address',
      timestamp: '2023-05-15T14:30:00Z',
      status: 'active'
    },
    {
      id: 'alert-2',
      integrationId: 'trello',
      integrationName: 'Trello',
      severity: 'medium',
      title: 'Unusual Data Access',
      description: 'Large number of board exports detected in short time period',
      timestamp: '2023-05-14T09:15:00Z',
      status: 'resolved'
    }
  ];

  // Mock data for productivity insights
  private productivityInsights: ProductivityInsight[] = [
    {
      id: 'insight-1',
      integrationId: 'gmail',
      integrationName: 'Gmail',
      title: 'Email Response Time',
      description: 'Average response time improved by 25% this week',
      timestamp: '2023-05-15T10:00:00Z',
      impact: 'positive',
      metric: 'response_time',
      value: -25
    },
    {
      id: 'insight-2',
      integrationId: 'trello',
      integrationName: 'Trello',
      title: 'Task Completion Rate',
      description: 'Team completed 15% more tasks than last week',
      timestamp: '2023-05-14T16:45:00Z',
      impact: 'positive',
      metric: 'completion_rate',
      value: 15
    }
  ];

  // Mock data for compliance issues
  private complianceIssues: ComplianceIssue[] = [
    {
      id: 'compliance-1',
      integrationId: 'gmail',
      integrationName: 'Gmail',
      title: 'Data Retention Policy',
      description: 'Emails older than retention period still present in account',
      timestamp: '2023-05-12T11:20:00Z',
      severity: 'medium',
      status: 'open'
    }
  ];

  // Get all threat alerts
  async getThreatAlerts(): Promise<ThreatAlert[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.threatAlerts);
      }, 300);
    });
  }

  // Get active threat alerts
  async getActiveThreatAlerts(): Promise<ThreatAlert[]> {
    const alerts = await this.getThreatAlerts();
    return alerts.filter(alert => alert.status === 'active');
  }

  // Get all productivity insights
  async getProductivityInsights(): Promise<ProductivityInsight[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.productivityInsights);
      }, 300);
    });
  }

  // Get all compliance issues
  async getComplianceIssues(): Promise<ComplianceIssue[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.complianceIssues);
      }, 300);
    });
  }

  // Dismiss a threat alert
  async dismissThreatAlert(alertId: string): Promise<ThreatAlert> {
    const alert = this.threatAlerts.find(a => a.id === alertId);
    if (!alert) {
      throw new Error(`Threat alert with id ${alertId} not found`);
    }

    alert.status = 'dismissed';

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(alert);
      }, 200);
    });
  }

  // Resolve a compliance issue
  async resolveComplianceIssue(issueId: string): Promise<ComplianceIssue> {
    const issue = this.complianceIssues.find(i => i.id === issueId);
    if (!issue) {
      throw new Error(`Compliance issue with id ${issueId} not found`);
    }

    issue.status = 'resolved';

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(issue);
      }, 200);
    });
  }
}

export default new AIMonitoringService();