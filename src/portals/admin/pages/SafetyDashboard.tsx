import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Switch } from "../../shared/ui/switch";
import { Label } from "../../shared/ui/label";
import { Alert, AlertDescription } from "../../shared/ui/alert";
import { localDb } from "@/integrations/local-db/client";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  FileWarning,
  Eye,
  EyeOff,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Mail,
  Users,
  Activity,
  BarChart3,
  Brain,
  History,
  Info,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import AnalyticsCard from '../../shared/components/ai/AnalyticsCard';
import DetailModal from '../../shared/components/ai/DetailModal';
import HistoryTable from '../../shared/components/ai/HistoryTable';
import { RiskAssessment, Prediction, ComplianceRecord, Incident, AIDashboardItem } from '@/types/ai';

interface DashboardData {
  riskAssessments: RiskAssessment[];
  predictions: Prediction[];
  complianceHistory: ComplianceRecord[];
  riskIncidents: Incident[];
}

interface Alert {
  id: string;
  category: 'harassment' | 'security' | 'productivity' | 'policy';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  status: 'new' | 'reviewed' | 'resolved';
  recommendation?: string;
}

const SafetyDashboard = () => {
  // AI Analytics state
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    riskAssessments: [],
    predictions: [],
    complianceHistory: [],
    riskIncidents: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<AIDashboardItem | null>(null);
  const [modalType, setModalType] = useState<'risk' | 'prediction' | 'compliance' | 'incident'>('risk');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Safety monitoring state
  const [monitoringSettings, setMonitoringSettings] = useState({
    harassment: true,
    security: true,
    productivity: false,
    policy: true,
    emailSubjects: false,
    chatMessages: true,
    notices: true,
    scanFrequency: 'daily' as 'off' | 'weekly' | 'daily'
  });

  // Mock alerts data
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      category: 'harassment',
      severity: 'high',
      title: 'Potential harassment detected in team chat',
      description: 'Inappropriate language detected in Engineering team chat',
      source: 'Team Chat - Engineering',
      timestamp: '2025-11-21T10:30:00Z',
      status: 'new',
      recommendation: 'Review message context and speak with involved parties'
    },
    {
      id: '2',
      category: 'security',
      severity: 'medium',
      title: 'Unusual login pattern detected',
      description: 'Multiple failed login attempts from unknown location',
      source: 'Security Logs',
      timestamp: '2025-11-21T09:15:00Z',
      status: 'reviewed',
      recommendation: 'Verify with user and consider password reset'
    },
    {
      id: '3',
      category: 'policy',
      severity: 'low',
      title: 'Policy acknowledgment overdue',
      description: '5 employees have not acknowledged updated Data Privacy Policy',
      source: 'Policy Management',
      timestamp: '2025-11-20T14:00:00Z',
      status: 'new',
      recommendation: 'Send reminder notification to pending employees'
    },
    {
      id: '4',
      category: 'productivity',
      severity: 'medium',
      title: 'Team productivity trend declining',
      description: 'Engineering team task completion rate down 15% this week',
      source: 'Productivity Analytics',
      timestamp: '2025-11-20T08:00:00Z',
      status: 'new',
      recommendation: 'Schedule check-in meeting to identify blockers'
    }
  ]);

  // Load AI Analytics data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const riskResult = await localDb
        .from('risk_incidents')
        .select(`
          *,
          employees(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      const incidentResult = await localDb
        .from('risk_incidents')
        .select(`
          *,
          employees(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      const predictionResult = { data: [], error: null };
      const complianceResult = { data: [], error: null };

      if (riskResult.error) throw riskResult.error;
      if (incidentResult.error) throw incidentResult.error;

      const transformedRiskData = (riskResult.data?.map(item => ({
        ...item,
        employee_name: (item as any).employees?.name
      })) || []) as unknown as RiskAssessment[];

      const transformedIncidentData = (incidentResult.data?.map(item => ({
        ...item,
        employee_name: (item as any).employees?.name
      })) || []) as unknown as Incident[];

      setDashboardData({
        riskAssessments: transformedRiskData,
        predictions: predictionResult.data as unknown as Prediction[] || [],
        complianceHistory: complianceResult.data as unknown as ComplianceRecord[] || [],
        riskIncidents: transformedIncidentData
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (item: AIDashboardItem, type: 'risk' | 'prediction' | 'compliance' | 'incident') => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, any> = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return <Badge variant={variants[severity] || 'secondary'}>{severity.toUpperCase()}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'harassment': return AlertTriangle;
      case 'security': return Shield;
      case 'productivity': return TrendingUp;
      case 'policy': return FileWarning;
      default: return Activity;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'harassment': return 'Harassment/Threats';
      case 'security': return 'Security Risks';
      case 'productivity': return 'Productivity Signals';
      case 'policy': return 'Policy Violations';
      default: return category;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge variant="outline" className="bg-yellow-50">New</Badge>;
      case 'reviewed': return <Badge variant="outline" className="bg-blue-50">Reviewed</Badge>;
      case 'resolved': return <Badge variant="outline" className="bg-green-50">Resolved</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const categoryCounts = alerts.reduce((acc, alert) => {
    acc[alert.category] = (acc[alert.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const newAlertsCount = alerts.filter(a => a.status === 'new').length;

  // AI Analytics calculations
  const highRiskEmployees = dashboardData.riskAssessments.filter(
    assessment => assessment.risk_level === 'high' || assessment.risk_level === 'critical'
  ).length;
  const totalPredictions = dashboardData.predictions.length;
  const chatMessagesToday = 1247;
  const averageComplianceScore = dashboardData.complianceHistory.length > 0
    ? Math.round(dashboardData.complianceHistory.reduce((sum, item) => sum + item.score, 0) / dashboardData.complianceHistory.length)
    : 94;

  const pieData = [
    { name: 'Low Risk', value: 65, color: '#10B981' },
    { name: 'Medium Risk', value: 25, color: '#F59E0B' },
    { name: 'High Risk', value: 8, color: '#EF4444' },
    { name: 'Critical Risk', value: 2, color: '#DC2626' }
  ];

  const trendData = [
    { month: 'Jan', incidents: 12, performance: 8.2 },
    { month: 'Feb', incidents: 8, performance: 8.5 },
    { month: 'Mar', incidents: 15, performance: 8.1 },
    { month: 'Apr', incidents: 6, performance: 8.7 },
    { month: 'May', incidents: 4, performance: 8.9 },
    { month: 'Jun', incidents: 3, performance: 9.1 }
  ];

  const departmentData = [
    { department: 'Engineering', risk_score: 6.2, performance: 8.1 },
    { department: 'Marketing', risk_score: 4.5, performance: 7.8 },
    { department: 'Sales', risk_score: 3.8, performance: 8.5 },
    { department: 'HR', risk_score: 2.1, performance: 9.2 },
    { department: 'Finance', risk_score: 5.3, performance: 7.9 }
  ];

  const getAIAdvice = (section: string) => {
    const advice = {
      risk: {
        status: highRiskEmployees > 3 ? 'warning' : 'good',
        message: highRiskEmployees > 3
          ? `You have ${highRiskEmployees} high-risk employees. Immediate action required: Schedule 1-on-1 meetings, review workload distribution, and consider additional support or training.`
          : 'Risk levels are manageable. Continue monitoring and maintain current preventive measures.'
      },
      predictions: {
        status: totalPredictions > 0 ? 'good' : 'info',
        message: totalPredictions > 0
          ? `${totalPredictions} AI predictions are helping you stay ahead of potential issues. Review accuracy rates and adjust models as needed.`
          : 'No recent predictions available. Consider enabling more AI monitoring features for proactive management.'
      },
      compliance: {
        status: averageComplianceScore < 90 ? 'warning' : 'good',
        message: averageComplianceScore < 90
          ? `Compliance score is ${averageComplianceScore}%. Focus on data retention policies, access controls, and employee training to improve scores.`
          : `Excellent compliance score of ${averageComplianceScore}%. Maintain current practices and conduct regular audits.`
      },
      chat: {
        status: 'info',
        message: `Monitoring ${chatMessagesToday.toLocaleString()} messages for risk indicators. AI is analyzing communication patterns, sentiment, and potential policy violations in real-time.`
      }
    };
    return advice[section as keyof typeof advice];
  };

  return (
    <DashboardLayout title="Safety & Productivity" subtitle="AI-Powered Monitoring">
      <div className="flex-1 p-4 md:p-6 bg-gray-50 min-h-screen overflow-x-hidden max-w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Safety & Productivity</h1>
                <p className="text-gray-600">AI-powered monitoring for workplace safety and team health</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {newAlertsCount} new alerts
              </Badge>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-red-700 mb-1">Harassment/Threats</div>
                  <div className="text-2xl font-bold text-red-900">{categoryCounts.harassment || 0}</div>
                </div>
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-700 mb-1">Security Risks</div>
                  <div className="text-2xl font-bold text-amber-900">{categoryCounts.security || 0}</div>
                </div>
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-blue-700 mb-1">Productivity Signals</div>
                  <div className="text-2xl font-bold text-blue-900">{categoryCounts.productivity || 0}</div>
                </div>
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-700 mb-1">Policy Violations</div>
                  <div className="text-2xl font-bold text-purple-900">{categoryCounts.policy || 0}</div>
                </div>
                <FileWarning className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="alerts">Safety Alerts</TabsTrigger>
            <TabsTrigger value="ai-analytics">AI Analytics</TabsTrigger>
            <TabsTrigger value="settings">Privacy & Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            {alerts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
                  <p className="text-gray-600">No safety or productivity alerts at this time</p>
                </CardContent>
              </Card>
            ) : (
              alerts.map((alert) => {
                const CategoryIcon = getCategoryIcon(alert.category);
                return (
                  <Card key={alert.id} className={`shadow-lg hover:shadow-xl transition-all ${getSeverityColor(alert.severity)} border`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${alert.severity === 'high' ? 'bg-red-200' : alert.severity === 'medium' ? 'bg-amber-200' : 'bg-blue-200'}`}>
                            <CategoryIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base font-semibold">{alert.title}</CardTitle>
                              {getSeverityBadge(alert.severity)}
                              {getStatusBadge(alert.status)}
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {alert.source}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(alert.timestamp).toLocaleString()}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {getCategoryLabel(alert.category)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    {alert.recommendation && (
                      <CardContent className="pt-0">
                        <div className="bg-white bg-opacity-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-start gap-2">
                            <Activity className="w-4 h-4 mt-0.5 text-blue-600" />
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-1">Recommended Action</p>
                              <p className="text-xs text-gray-600">{alert.recommendation}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">Mark Reviewed</Button>
                          <Button size="sm">Resolve</Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* AI Analytics Tab */}
          <TabsContent value="ai-analytics" className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">AI-Powered Analytics</h2>
                <p className="text-sm text-gray-500 mt-1">Real-time insights and predictive risk assessment</p>
              </div>
              <Button
                onClick={loadDashboardData}
                disabled={isLoading}
                variant="outline"
                className="rounded-xl border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>

            {/* KPI Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* High Risk Employees */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-red-50 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <Badge variant="destructive" className="text-xs">High Priority</Badge>
                  </div>
                  <div className="mb-2">
                    <h3 className="text-3xl font-bold text-gray-900">{highRiskEmployees}</h3>
                    <p className="text-sm text-gray-600 mt-1">High Risk Employees</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-start gap-2">
                      <Lightbulb className="w-3 h-3 mt-0.5 text-amber-500" />
                      <span className="flex-1">{getAIAdvice('risk').message}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* AI Predictions */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">Predictive</Badge>
                  </div>
                  <div className="mb-2">
                    <h3 className="text-3xl font-bold text-gray-900">{totalPredictions}</h3>
                    <p className="text-sm text-gray-600 mt-1">AI Predictions</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-start gap-2">
                      <Lightbulb className="w-3 h-3 mt-0.5 text-amber-500" />
                      <span className="flex-1">{getAIAdvice('predictions').message}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Monitoring */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Real-time</Badge>
                  </div>
                  <div className="mb-2">
                    <h3 className="text-3xl font-bold text-gray-900">{chatMessagesToday.toLocaleString()}</h3>
                    <p className="text-sm text-gray-600 mt-1">Messages Monitored</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-start gap-2">
                      <Lightbulb className="w-3 h-3 mt-0.5 text-amber-500" />
                      <span className="flex-1">{getAIAdvice('chat').message}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Score */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-green-50 rounded-xl">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Excellent</Badge>
                  </div>
                  <div className="mb-2">
                    <h3 className="text-3xl font-bold text-gray-900">{averageComplianceScore}%</h3>
                    <p className="text-sm text-gray-600 mt-1">Compliance Score</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-start gap-2">
                      <Lightbulb className="w-3 h-3 mt-0.5 text-amber-500" />
                      <span className="flex-1">{getAIAdvice('compliance').message}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department Risk Analysis */}
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        Department Risk Analysis
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-2">
                        Compare risk vs performance across departments
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="risk_score" fill="#EF4444" name="Risk Score" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="performance" fill="#10B981" name="Performance" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                      <span className="text-xs text-gray-600">Risk Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                      <span className="text-xs text-gray-600">Performance</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Incident Trends */}
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        Performance Trends
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-2">
                        6-month incident and performance tracking
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="incidents" stroke="#EF4444" name="Incidents" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="performance" stroke="#10B981" name="Performance" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Incidents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Performance</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Historical Data Section */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Historical Data</h3>
                <p className="text-sm text-gray-500 mt-1">Track AI assessments and incidents over time</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Assessment History */}
                <Card className="border border-gray-200 shadow-sm rounded-xl">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <History className="w-4 h-4 text-blue-600" />
                      </div>
                      Risk Assessments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <HistoryTable
                      data={dashboardData.riskAssessments}
                      type="risk"
                      onViewDetails={(item) => openModal(item, 'risk')}
                    />
                  </CardContent>
                </Card>

                {/* Risk Incidents History */}
                <Card className="border border-gray-200 shadow-sm rounded-xl">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <div className="p-1.5 bg-red-50 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      Risk Incidents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <HistoryTable
                      data={dashboardData.riskIncidents}
                      type="incident"
                      onViewDetails={(item) => openModal(item, 'incident')}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Monitoring Settings
                </CardTitle>
                <p className="text-sm text-gray-600">Configure what AI monitors and privacy controls</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Toggles */}
                <div>
                  <h3 className="font-semibold mb-3">Alert Categories</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div>
                          <Label className="font-medium">Harassment & Threats Detection</Label>
                          <p className="text-xs text-gray-500">Detect inappropriate language and threatening behavior</p>
                        </div>
                      </div>
                      <Switch
                        checked={monitoringSettings.harassment}
                        onCheckedChange={(checked) => setMonitoringSettings({...monitoringSettings, harassment: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-amber-600" />
                        <div>
                          <Label className="font-medium">Security Risk Monitoring</Label>
                          <p className="text-xs text-gray-500">Track unusual login patterns and security incidents</p>
                        </div>
                      </div>
                      <Switch
                        checked={monitoringSettings.security}
                        onCheckedChange={(checked) => setMonitoringSettings({...monitoringSettings, security: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <div>
                          <Label className="font-medium">Productivity Insights</Label>
                          <p className="text-xs text-gray-500">Monitor team health and productivity trends</p>
                        </div>
                      </div>
                      <Switch
                        checked={monitoringSettings.productivity}
                        onCheckedChange={(checked) => setMonitoringSettings({...monitoringSettings, productivity: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileWarning className="w-5 h-5 text-purple-600" />
                        <div>
                          <Label className="font-medium">Policy Compliance</Label>
                          <p className="text-xs text-gray-500">Track policy acknowledgments and violations</p>
                        </div>
                      </div>
                      <Switch
                        checked={monitoringSettings.policy}
                        onCheckedChange={(checked) => setMonitoringSettings({...monitoringSettings, policy: checked})}
                      />
                    </div>
                  </div>
                </div>

                {/* Data Sources */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">Data Sources</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                        <div>
                          <Label className="font-medium">Internal Chat Messages</Label>
                          <p className="text-xs text-gray-500">Scan team chat for policy compliance</p>
                        </div>
                      </div>
                      <Switch
                        checked={monitoringSettings.chatMessages}
                        onCheckedChange={(checked) => setMonitoringSettings({...monitoringSettings, chatMessages: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <Label className="font-medium">Email Subject Lines</Label>
                          <p className="text-xs text-gray-500">Monitor subject lines only (never full content)</p>
                        </div>
                      </div>
                      <Switch
                        checked={monitoringSettings.emailSubjects}
                        onCheckedChange={(checked) => setMonitoringSettings({...monitoringSettings, emailSubjects: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-600" />
                        <div>
                          <Label className="font-medium">Company Notices</Label>
                          <p className="text-xs text-gray-500">Monitor company-wide communications</p>
                        </div>
                      </div>
                      <Switch
                        checked={monitoringSettings.notices}
                        onCheckedChange={(checked) => setMonitoringSettings({...monitoringSettings, notices: checked})}
                      />
                    </div>
                  </div>
                </div>

                {/* Scan Frequency */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">Scan Frequency (Cost Control)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button
                      variant={monitoringSettings.scanFrequency === 'off' ? 'default' : 'outline'}
                      onClick={() => setMonitoringSettings({...monitoringSettings, scanFrequency: 'off'})}
                      className="w-full"
                    >
                      Off
                    </Button>
                    <Button
                      variant={monitoringSettings.scanFrequency === 'weekly' ? 'default' : 'outline'}
                      onClick={() => setMonitoringSettings({...monitoringSettings, scanFrequency: 'weekly'})}
                      className="w-full"
                    >
                      Weekly
                    </Button>
                    <Button
                      variant={monitoringSettings.scanFrequency === 'daily' ? 'default' : 'outline'}
                      onClick={() => setMonitoringSettings({...monitoringSettings, scanFrequency: 'daily'})}
                      className="w-full"
                    >
                      Daily
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Lower frequency reduces costs. Daily scans recommended for high-risk environments.
                  </p>
                </div>

                {/* Privacy Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Privacy First</h4>
                      <p className="text-sm text-blue-800">
                        All monitoring uses aggregated patterns and anonymized data. Individual messages are never stored.
                        Results are visible only to HR and Admin roles. Employees are notified about active monitoring categories.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detail Modal for AI Analytics */}
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          data={selectedItem}
          type={modalType}
        />
      </div>
    </DashboardLayout>
  );
};

export default SafetyDashboard;
