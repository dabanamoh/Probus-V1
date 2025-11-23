import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Badge } from "../../shared/ui/badge";
import { Button } from "../../shared/ui/button";
import { 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  useThreatAlerts, 
  useProductivityInsights, 
  useComplianceIssues,
  useDismissThreatAlert,
  useResolveComplianceIssue
} from '@/hooks/useAIMonitoring';
import { useToast } from '@/hooks/use-toast';

const AIMonitoringDashboard = () => {
  const { toast } = useToast();
  const { data: threatAlerts = [] } = useThreatAlerts();
  const { data: productivityInsights = [] } = useProductivityInsights();
  const { data: complianceIssues = [] } = useComplianceIssues();
  
  const { mutate: dismissThreatAlert } = useDismissThreatAlert();
  const { mutate: resolveComplianceIssue } = useResolveComplianceIssue();

  const activeThreats = threatAlerts.filter(alert => alert.status === 'active');
  const resolvedThreats = threatAlerts.filter(alert => alert.status === 'resolved');
  const dismissedThreats = threatAlerts.filter(alert => alert.status === 'dismissed');

  const handleDismissThreat = (alertId: string) => {
    dismissThreatAlert(alertId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Threat alert dismissed successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to dismiss threat alert: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  };

  const handleResolveComplianceIssue = (issueId: string) => {
    resolveComplianceIssue(issueId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Compliance issue resolved successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to resolve compliance issue: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  };

  // Get severity color for threat alerts
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Get impact color for productivity insights
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      case 'neutral': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Get severity color for compliance issues
  const getComplianceSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Active Threats</CardTitle>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{activeThreats.length}</div>
            <p className="text-sm text-gray-600 mt-1">Require immediate attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Productivity Insights</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{productivityInsights.length}</div>
            <p className="text-sm text-gray-600 mt-1">Actionable insights</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Compliance Issues</CardTitle>
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{complianceIssues.filter(i => i.status === 'open').length}</div>
            <p className="text-sm text-gray-600 mt-1">Open issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Threat Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Threat Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeThreats.length > 0 ? (
            <div className="space-y-4">
              {activeThreats.map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg border-red-200 bg-red-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${getSeverityColor(alert.severity)}`}></div>
                      <div>
                        <h3 className="font-semibold text-red-800">{alert.title}</h3>
                        <p className="text-sm text-red-700 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {alert.integrationName}
                          </Badge>
                          <span className="text-xs text-red-600">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDismissThreat(alert.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700">No Active Threats</h3>
              <p className="text-sm text-gray-600 mt-1">All systems are secure</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Productivity Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Productivity Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {productivityInsights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productivityInsights.map((insight) => (
                <div key={insight.id} className="p-4 border rounded-lg border-green-200 bg-green-50">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${getImpactColor(insight.impact)}`}></div>
                    <div>
                      <h3 className="font-semibold text-green-800">{insight.title}</h3>
                      <p className="text-sm text-green-700 mt-1">{insight.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {insight.integrationName}
                        </Badge>
                        <span className="text-xs text-green-600">
                          {new Date(insight.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {insight.metric && insight.value !== undefined && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-green-700">
                            {insight.metric}: {insight.value > 0 ? '+' : ''}{insight.value}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700">No Insights Available</h3>
              <p className="text-sm text-gray-600 mt-1">Check back later for productivity insights</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Compliance Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          {complianceIssues.filter(i => i.status === 'open').length > 0 ? (
            <div className="space-y-4">
              {complianceIssues.filter(i => i.status === 'open').map((issue) => (
                <div key={issue.id} className="p-4 border rounded-lg border-blue-200 bg-blue-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${getComplianceSeverityColor(issue.severity)}`}></div>
                      <div>
                        <h3 className="font-semibold text-blue-800">{issue.title}</h3>
                        <p className="text-sm text-blue-700 mt-1">{issue.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {issue.integrationName}
                          </Badge>
                          <span className="text-xs text-blue-600">
                            {new Date(issue.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleResolveComplianceIssue(issue.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700">All Compliance Issues Resolved</h3>
              <p className="text-sm text-gray-600 mt-1">No open compliance issues</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIMonitoringDashboard;
