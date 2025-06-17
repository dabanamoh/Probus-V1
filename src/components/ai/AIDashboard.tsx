
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
  Eye
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

interface RiskAssessment {
  id: string;
  employee_name: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  assessment_type: string;
  confidence_score: number;
  requires_action: boolean;
  created_at: string;
}

interface AnalyticsData {
  department: string;
  risk_score: number;
  incidents: number;
  performance: number;
}

const AIDashboard: React.FC = () => {
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration - in real app, this would come from AI analysis
      const mockRiskAssessments: RiskAssessment[] = [
        {
          id: '1',
          employee_name: 'John Doe',
          risk_level: 'high',
          assessment_type: 'behavioral',
          confidence_score: 0.85,
          requires_action: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          employee_name: 'Jane Smith',
          risk_level: 'medium',
          assessment_type: 'performance',
          confidence_score: 0.72,
          requires_action: false,
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          employee_name: 'Mike Johnson',
          risk_level: 'low',
          assessment_type: 'compliance',
          confidence_score: 0.91,
          requires_action: false,
          created_at: new Date().toISOString()
        }
      ];

      const mockAnalytics: AnalyticsData[] = [
        { department: 'Engineering', risk_score: 2.3, incidents: 1, performance: 8.5 },
        { department: 'Marketing', risk_score: 1.8, incidents: 0, performance: 9.1 },
        { department: 'Sales', risk_score: 3.2, incidents: 2, performance: 7.8 },
        { department: 'HR', risk_score: 1.5, incidents: 0, performance: 8.9 },
        { department: 'Finance', risk_score: 2.1, incidents: 1, performance: 8.7 }
      ];

      setRiskAssessments(mockRiskAssessments);
      setAnalyticsData(mockAnalytics);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

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
        <Button>
          <Brain className="w-4 h-4 mr-2" />
          Run AI Analysis
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Employees</p>
                <p className="text-2xl font-bold text-red-600">8</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Predictions</p>
                <p className="text-2xl font-bold text-blue-600">23</p>
              </div>
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chat Messages Today</p>
                <p className="text-2xl font-bold text-green-600">1,247</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-purple-600">94%</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="risks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          <TabsTrigger value="analytics">Department Analytics</TabsTrigger>
          <TabsTrigger value="trends">Trends & Predictions</TabsTrigger>
          <TabsTrigger value="compliance">GDPR Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="risks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Risk Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAssessments.map((assessment) => (
                    <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{assessment.employee_name}</p>
                        <p className="text-sm text-gray-600">{assessment.assessment_type}</p>
                        <p className="text-xs text-gray-500">
                          Confidence: {(assessment.confidence_score * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(assessment.risk_level)}>
                          {assessment.risk_level.toUpperCase()}
                        </Badge>
                        {assessment.requires_action && (
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
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
                <BarChart data={analyticsData}>
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
    </div>
  );
};

export default AIDashboard;
