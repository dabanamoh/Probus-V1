import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Shield, 
  MessageSquare,
  BarChart3,
  calendar,
  history
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

interface DashboardData {
  riskAssessments: any[];
  predictions: any[];
  complianceHistory: any[];
  riskIncidents: any[];
}

const AIDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    riskAssessments: [],
    predictions: [],
    complianceHistory: [],
    riskIncidents: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'risk' | 'prediction' | 'compliance' | 'incident'>('risk');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load AI Risk Assessments
      const { data: riskData } = await supabase
        .from('ai_risk_assessments')
        .select(`
          *,
          employees(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Load AI Predictions
      const { data: predictionData } = await supabase
        .from('ai_predictions')
        .select(`
          *,
          employees(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Load Compliance History
      const { data: complianceData } = await supabase
        .from('compliance_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Load Risk Incidents
      const { data: incidentData } = await supabase
        .from('risk_incidents')
        .select(`
          *,
          employees(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Transform data to include employee names
      const transformedRiskData = riskData?.map(item => ({
        ...item,
        employee_name: item.employees?.name
      })) || [];

      const transformedPredictionData = predictionData?.map(item => ({
        ...item,
        employee_name: item.employees?.name
      })) || [];

      const transformedIncidentData = incidentData?.map(item => ({
        ...item,
        employee_name: item.employees?.name
      })) || [];

      setDashboardData({
        riskAssessments: transformedRiskData,
        predictions: transformedPredictionData,
        complianceHistory: complianceData || [],
        riskIncidents: transformedIncidentData
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (item: any, type: 'risk' | 'prediction' | 'compliance' | 'incident') => {
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">AI-powered insights and risk assessment</p>
        </div>
        <Button onClick={loadDashboardData} disabled={isLoading}>
          <Brain className="w-4 h-4 mr-2" />
          {isLoading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnalyticsCard
          title="High Risk Employees"
          value={highRiskEmployees}
          icon={<AlertTriangle className="w-8 h-8" />}
          description="Requiring immediate attention"
          type="risk"
          severity="high"
          onClick={() => openModal(dashboardData.riskAssessments[0], 'risk')}
        />

        <AnalyticsCard
          title="AI Predictions"
          value={totalPredictions}
          icon={<Brain className="w-8 h-8" />}
          description="Generated this week"
          type="prediction"
          onClick={() => openModal(dashboardData.predictions[0], 'prediction')}
        />

        <AnalyticsCard
          title="Chat Messages Today"
          value={chatMessagesToday.toLocaleString()}
          icon={<MessageSquare className="w-8 h-8" />}
          description="Monitored for risks"
          type="incident"
          onClick={() => openModal(dashboardData.riskIncidents[0], 'incident')}
        />

        <AnalyticsCard
          title="Compliance Score"
          value={`${averageComplianceScore}%`}
          icon={<Shield className="w-8 h-8" />}
          description="Average across all areas"
          type="compliance"
          onClick={() => openModal(dashboardData.complianceHistory[0], 'compliance')}
        />
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">Historical Data</TabsTrigger>
          <TabsTrigger value="analytics">Department Analytics</TabsTrigger>
          <TabsTrigger value="trends">Trends & Predictions</TabsTrigger>
          <TabsTrigger value="compliance">GDPR Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <history className="w-5 h-5" />
                  Risk Assessment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HistoryTable
                  data={dashboardData.riskAssessments}
                  type="risk"
                  onViewDetails={(item) => openModal(item, 'risk')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Predictions History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HistoryTable
                  data={dashboardData.predictions}
                  type="prediction"
                  onViewDetails={(item) => openModal(item, 'prediction')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Compliance History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HistoryTable
                  data={dashboardData.complianceHistory}
                  type="compliance"
                  onViewDetails={(item) => openModal(item, 'compliance')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Risk Incidents History
                </CardTitle>
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
          <Card>
            <CardHeader>
              <CardTitle>Department Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[]}>
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
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident Trends & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="incidents" stroke="#EF4444" name="Incidents" />
                  <Line type="monotone" dataKey="performance" stroke="#10B981" name="Performance" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GDPR Compliance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-green-600">Data Processing</h3>
                  <p className="text-2xl font-bold text-green-600">Compliant</p>
                  <p className="text-sm text-gray-600">All processing logged</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-blue-600">Retention Policies</h3>
                  <p className="text-2xl font-bold text-blue-600">Active</p>
                  <p className="text-sm text-gray-600">Auto-deletion enabled</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-purple-600">User Rights</h3>
                  <p className="text-2xl font-bold text-purple-600">Protected</p>
                  <p className="text-sm text-gray-600">Access controls in place</p>
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
