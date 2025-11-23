import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Eye,
  Download,
  Calendar,
  Users,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";

const KPIManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock KPI data for team management
  const teamKPIs = [
    {
      id: 'kpi-1',
      name: 'Team Productivity',
      category: 'Performance',
      current: 87,
      target: 90,
      trend: 'up',
      period: 'Q4 2024',
      employee: 'Team Average',
      status: 'on-track',
      lastUpdated: '2024-11-15'
    },
    {
      id: 'kpi-2',
      name: 'Code Quality Score',
      category: 'Quality',
      current: 92,
      target: 85,
      trend: 'up',
      period: 'Q4 2024',
      employee: 'Engineering Team',
      status: 'exceeding',
      lastUpdated: '2024-11-14'
    },
    {
      id: 'kpi-3',
      name: 'Sprint Completion Rate',
      category: 'Delivery',
      current: 78,
      target: 85,
      trend: 'down',
      period: 'Q4 2024',
      employee: 'Development Team',
      status: 'at-risk',
      lastUpdated: '2024-11-13'
    },
    {
      id: 'kpi-4',
      name: 'Team Collaboration Score',
      category: 'Teamwork',
      current: 88,
      target: 80,
      trend: 'up',
      period: 'Q4 2024',
      employee: 'All Team Members',
      status: 'exceeding',
      lastUpdated: '2024-11-12'
    },
    {
      id: 'kpi-5',
      name: 'Customer Satisfaction',
      category: 'Service',
      current: 85,
      target: 90,
      trend: 'stable',
      period: 'Q4 2024',
      employee: 'Client-facing Team',
      status: 'on-track',
      lastUpdated: '2024-11-11'
    }
  ];

  const individualKPIs = [
    {
      id: 'ikpi-1',
      employeeName: 'Sarah Johnson',
      position: 'Senior Developer',
      kpis: {
        productivity: { current: 95, target: 90, status: 'exceeding' },
        quality: { current: 88, target: 85, status: 'exceeding' },
        collaboration: { current: 90, target: 85, status: 'exceeding' }
      },
      overallScore: 91,
      lastReview: '2024-11-10'
    },
    {
      id: 'ikpi-2',
      employeeName: 'Mike Chen',
      position: 'Frontend Developer',
      kpis: {
        productivity: { current: 82, target: 85, status: 'at-risk' },
        quality: { current: 90, target: 85, status: 'exceeding' },
        collaboration: { current: 85, target: 85, status: 'on-track' }
      },
      overallScore: 86,
      lastReview: '2024-11-08'
    },
    {
      id: 'ikpi-3',
      employeeName: 'Emily Davis',
      position: 'Backend Developer',
      kpis: {
        productivity: { current: 80, target: 85, status: 'at-risk' },
        quality: { current: 85, target: 85, status: 'on-track' },
        collaboration: { current: 70, target: 85, status: 'needs-improvement' }
      },
      overallScore: 78,
      lastReview: '2024-11-05'
    }
  ];

  const categories = ['All', 'Performance', 'Quality', 'Delivery', 'Teamwork', 'Service'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'exceeding':
        return <Badge className="bg-green-100 text-green-800">Exceeding</Badge>;
      case 'on-track':
        return <Badge className="bg-blue-100 text-blue-800">On Track</Badge>;
      case 'at-risk':
        return <Badge className="bg-yellow-100 text-yellow-800">At Risk</Badge>;
      case 'needs-improvement':
        return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getScoreColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredKPIs = teamKPIs.filter(kpi => {
    const matchesCategory = selectedCategory === 'all' || kpi.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesCategory;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">KPI Management</h1>
            <p className="text-gray-600">Monitor and manage team performance indicators and evaluations</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export KPI Report
            </Button>
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add KPI
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Team KPIs</TabsTrigger>
            <TabsTrigger value="individual">Individual Performance</TabsTrigger>
            <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total KPIs</p>
                      <p className="text-2xl font-bold text-gray-900">{teamKPIs.length}</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Exceeding</p>
                      <p className="text-2xl font-bold text-green-600">
                        {teamKPIs.filter(k => k.status === 'exceeding').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">At Risk</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {teamKPIs.filter(k => k.status === 'at-risk').length}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Score</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(teamKPIs.reduce((acc, k) => acc + k.current, 0) / teamKPIs.length)}%
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current</SelectItem>
                        <SelectItem value="q3">Q3 2024</SelectItem>
                        <SelectItem value="q2">Q2 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPIs Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Team KPIs ({filteredKPIs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>KPI Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Current/Target</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredKPIs.map((kpi) => (
                        <TableRow key={kpi.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{kpi.name}</div>
                              <div className="text-sm text-gray-500">{kpi.employee}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{kpi.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className={`font-medium ${getScoreColor(kpi.current, kpi.target)}`}>
                                {kpi.current}%
                              </span>
                              <span className="text-gray-500"> / {kpi.target}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  kpi.current >= kpi.target ? 'bg-green-500' : 
                                  kpi.current >= kpi.target * 0.8 ? 'bg-blue-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTrendIcon(kpi.trend)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(kpi.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="individual" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {individualKPIs.map((employee) => (
                <Card key={employee.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <span>{employee.employeeName}</span>
                        <p className="text-sm text-gray-500 font-normal">{employee.position}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{employee.overallScore}%</div>
                        <div className="text-sm text-gray-500">Overall Score</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(employee.kpis).map(([kpiName, kpiData]) => (
                        <div key={kpiName} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium capitalize">{kpiName}</span>
                            {getStatusBadge(kpiData.status)}
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Current: {kpiData.current}%</span>
                            <span>Target: {kpiData.target}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                kpiData.current >= kpiData.target ? 'bg-green-500' : 
                                kpiData.current >= kpiData.target * 0.8 ? 'bg-blue-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min((kpiData.current / kpiData.target) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="text-sm text-gray-500">Last Review: {employee.lastReview}</span>
                      <Button size="sm" variant="outline">
                        Update KPIs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="evaluations" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Evaluations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Schedule and manage performance evaluations for your team members.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Performance History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">View historical performance data and evaluation trends.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KPIManagement;
