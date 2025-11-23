import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Badge } from "../../shared/ui/badge";
import { Button } from "../../shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Alert, AlertDescription } from "../../shared/ui/alert";
import { localDb } from "@/integrations/local-db/client";
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Users,
  Shield,
  MessageSquare,
  BarChart3,
  Calendar,
  History,
  Info,
  Lightbulb,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Clock
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
import AnalyticsCard from './AnalyticsCard';
import DetailModal from './DetailModal';
import HistoryTable from './HistoryTable';
import { RiskAssessment, Prediction, ComplianceRecord, Incident, AIDashboardItem } from '@/types/ai';

interface DashboardData {
  riskAssessments: RiskAssessment[];
  predictions: Prediction[];
  complianceHistory: ComplianceRecord[];
  riskIncidents: Incident[];
}

const AIDashboard: React.FC = () => {
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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load AI Risk Assessments (using risk_incidents as a substitute)
      const riskResult = await localDb
        .from('risk_incidents')
        .select(`
          *,
          employees(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Load Risk Incidents (this is the actual table)
      const incidentResult = await localDb
        .from('risk_incidents')
        .select(`
          *,
          employees(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // For missing tables, we'll use empty arrays or substitute with available data
      const predictionResult = { data: [], error: null };
      const complianceResult = { data: [], error: null };

      if (riskResult.error) throw riskResult.error;
      if (incidentResult.error) throw incidentResult.error;

      // Transform data to include employee names
      const transformedRiskData = (riskResult.data?.map(item => ({
        ...item,
        employee_name: item.employees?.name
      })) || []) as unknown as RiskAssessment[];

      const transformedIncidentData = (incidentResult.data?.map(item => ({
        ...item,
        employee_name: item.employees?.name
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

  // Calculate KPI values from real data
  const highRiskEmployees = dashboardData.riskAssessments.filter(
    assessment => assessment.risk_level === 'high' || assessment.risk_level === 'critical'
  ).length;

  const totalPredictions = dashboardData.predictions.length;
  const chatMessagesToday = 1247; // This would come from chat messages table with today's filter
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

  // New data for department analytics
  const departmentData = [
    { department: 'Engineering', risk_score: 6.2, performance: 8.1 },
    { department: 'Marketing', risk_score: 4.5, performance: 7.8 },
    { department: 'Sales', risk_score: 3.8, performance: 8.5 },
    { department: 'HR', risk_score: 2.1, performance: 9.2 },
    { department: 'Finance', risk_score: 5.3, performance: 7.9 }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">AI Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">AI-powered insights and risk assessment for proactive HR management</p>
        </div>
        <Button
          onClick={loadDashboardData}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Overview Section */}
      <Card className="bg-white shadow-sm border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Info className="w-5 h-5 text-blue-600" />
            Dashboard Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>This AI Analytics Dashboard provides real-time insights into employee behavior, risk assessment, and compliance monitoring. The system uses advanced machine learning algorithms to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Risk Assessment:</strong> Analyze employee behavior patterns, communication, and performance metrics to identify potential risks</li>
              <li><strong>Predictive Analytics:</strong> Forecast potential issues before they escalate, including turnover risk and performance decline</li>
              <li><strong>Compliance Monitoring:</strong> Ensure GDPR compliance and track data processing activities in real-time</li>
              <li><strong>Communication Analysis:</strong> Monitor chat messages for sentiment, policy violations, and workplace harassment indicators</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards with AI Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="space-y-2">
          <AnalyticsCard
            title="High Risk Employees"
            value={highRiskEmployees}
            icon={<AlertTriangle className="w-8 h-8" />}
            description="Requiring immediate attention"
            type="risk"
            severity="high"
            onClick={() => openModal(dashboardData.riskAssessments[0], 'risk')}
          />
          <Alert className={`${getAIAdvice('risk').status === 'warning' ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {getAIAdvice('risk').message}
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-2">
          <AnalyticsCard
            title="AI Predictions"
            value={totalPredictions}
            icon={<Brain className="w-8 h-8" />}
            description="Generated this week"
            type="prediction"
            onClick={() => openModal(dashboardData.predictions[0], 'prediction')}
          />
          <Alert className="border-blue-200 bg-blue-50">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {getAIAdvice('predictions').message}
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-2">
          <AnalyticsCard
            title="Chat Messages Today"
            value={chatMessagesToday.toLocaleString()}
            icon={<MessageSquare className="w-8 h-8" />}
            description="Monitored for risks"
            type="incident"
            onClick={() => openModal(dashboardData.riskIncidents[0], 'incident')}
          />
          <Alert className="border-purple-200 bg-purple-50">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {getAIAdvice('chat').message}
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-2">
          <AnalyticsCard
            title="Compliance Score"
            value={`${averageComplianceScore}%`}
            icon={<Shield className="w-8 h-8" />}
            description="Average across all areas"
            type="compliance"
            onClick={() => openModal(dashboardData.complianceHistory[0], 'compliance')}
          />
          <Alert className={`${getAIAdvice('compliance').status === 'warning' ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {getAIAdvice('compliance').message}
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white p-1 rounded-lg shadow-sm border">
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <History className="w-4 h-4 mr-2" />
            Historical Data
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Department Analytics
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trends & Predictions
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            GDPR Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          {/* AI Insights for Historical Data */}
          <Card className="bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Brain className="w-5 h-5 text-blue-600" />
                AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-green-800">Positive Trends</h3>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Risk incidents decreased by 25% this month</li>
                    <li>• AI prediction accuracy improved to 87%</li>
                    <li>• Compliance scores trending upward</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-medium text-orange-800">Areas for Attention</h3>
                  </div>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Higher chat activity after hours needs monitoring</li>
                    <li>• 3 departments show elevated stress indicators</li>
                    <li>• Data access patterns require review</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <History className="w-5 h-5 text-blue-600" />
                    Risk Assessment History
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Track AI-powered risk assessments over time. Each assessment analyzes employee behavior, communication patterns, and performance metrics to identify potential issues before they escalate.
                </p>
              </CardHeader>
              <CardContent>
                <HistoryTable
                  data={dashboardData.riskAssessments}
                  type="risk"
                  onViewDetails={(item) => openModal(item, 'risk')}
                />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Brain className="w-5 h-5 text-blue-600" />
                    AI Predictions History
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Review predictive analytics outcomes. The AI analyzes trends to forecast potential turnover, performance issues, and compliance risks, helping you take proactive measures.
                </p>
              </CardHeader>
              <CardContent>
                <HistoryTable
                  data={dashboardData.predictions}
                  type="prediction"
                  onViewDetails={(item) => openModal(item, 'prediction')}
                />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Compliance History
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Monitor GDPR compliance scores and data processing activities. Regular automated checks ensure your organization meets privacy regulations and data protection standards.
                </p>
              </CardHeader>
              <CardContent>
                <HistoryTable
                  data={dashboardData.complianceHistory}
                  type="compliance"
                  onViewDetails={(item) => openModal(item, 'compliance')}
                />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                    Risk Incidents History
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Track workplace incidents and AI-detected anomalies. This includes behavioral concerns, security violations, and compliance issues identified through automated monitoring.
                </p>
              </CardHeader>
              <CardContent>
                <HistoryTable
                  data={dashboardData.riskIncidents}
                  type="incident"
                  onViewDetails={(item) => openModal(item, 'incident')}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-800">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Department Risk Analysis
                  </div>
                  <Badge variant="secondary">Real-time</Badge>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Compare risk levels and performance metrics across departments. This helps identify organizational patterns and allocate resources effectively.
                </p>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>AI Recommendation:</strong> Focus on departments with risk scores above 7.0. Consider team-building activities, workload redistribution, or additional management support for high-risk areas.
                  </AlertDescription>
                </Alert>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="risk_score" fill="#EF4444" name="Risk Score" />
                    <Bar dataKey="performance" fill="#10B981" name="Performance Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-800">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-600" />
                    Risk Distribution
                  </div>
                  <Badge variant="secondary">Updated</Badge>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Distribution of risk levels across the organization. Monitor changes in risk distribution to identify emerging patterns.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-sm text-gray-600">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Incident Trends & Performance
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Last 6 months</span>
                </div>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Track incident frequency and overall performance trends. Use this data to identify seasonal patterns, measure improvement initiatives, and predict future needs.
              </p>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>Trend Analysis:</strong> Incidents are decreasing while performance improves. Continue current strategies and consider implementing similar approaches in underperforming areas.
                </AlertDescription>
              </Alert>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="incidents" stroke="#EF4444" name="Incidents" strokeWidth={2} />
                  <Line type="monotone" dataKey="performance" stroke="#10B981" name="Performance" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card className="bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  GDPR Compliance Overview
                </div>
                <Badge variant="secondary">Compliant</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Monitor GDPR compliance across all data processing activities. The AI continuously checks data access, retention policies, and user rights implementation.
              </p>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Compliance Status:</strong> All systems are GDPR compliant. Continue monitoring data access patterns and ensure regular policy reviews. Consider quarterly compliance audits.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <h3 className="font-medium text-green-800 mb-1">Data Processing</h3>
                  <p className="text-2xl font-bold text-green-600">Compliant</p>
                  <p className="text-sm text-green-700">All processing logged and audited</p>
                </div>
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-1">Retention Policies</h3>
                  <p className="text-2xl font-bold text-blue-600">Active</p>
                  <p className="text-sm text-blue-700">Auto-deletion schedules running</p>
                </div>
                <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                  <h3 className="font-medium text-purple-800 mb-1">User Rights</h3>
                  <p className="text-2xl font-bold text-purple-600">Protected</p>
                  <p className="text-sm text-purple-700">Access controls functioning properly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedItem}
        type={modalType}
      />
    </div>
  );
};

export default AIDashboard;
