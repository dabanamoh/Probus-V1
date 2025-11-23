import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { AlertTriangle, ArrowLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Badge } from "../../shared/ui/badge";
import { Button } from "../../shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import {
  TrendingUp,
  Users,
  Building2,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Target,
  User,
  FileText
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

interface KPIData {
  id: string;
  department_name?: string;
  employee_name?: string;
  [key: string]: unknown;
}

interface ScoreMetric {
  current: number;
  target: number;
  trend: 'up' | 'down';
}

interface ScoredEmployee {
  id: string;
  name: string;
  position: string;
  created_at?: string;
  department?: { name: string };
  overallScore: number;
  performanceScore: number;
  qualityScore: number;
  teamworkScore: number;
  punctualityScore: number;
  innovationScore: number;
  lastUpdated: string;
  scoreBreakdown?: {
    performance: ScoreMetric;
    quality: ScoreMetric;
    teamwork: ScoreMetric;
    punctuality: ScoreMetric;
    innovation: ScoreMetric;
  };
}

interface DepartmentWithEmployees {
  id: string;
  name: string;
  description?: string;
  employees?: ScoredEmployee[];
  employee_count?: number;
}

const KPIs = () => {

  const [activeTab, setActiveTab] = useState('overview');
  const [currentView, setCurrentView] = useState('default'); // 'default', 'department', 'employee'
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentWithEmployees | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<ScoredEmployee | null>(null);

  // Fetch KPI data
  const { data: kpiData, isLoading: kpiLoading, isError: kpiError, error: kpiErrorDetails, refetch: refetchKpis } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      try {
        console.log('Fetching KPI data...');
        const { data, error } = await localDb
          .from('kpis')
          .select('*')
          .order('last_updated', { ascending: false });

        if (error) {
          console.error('KPI data fetch error:', error);
          throw error;
        }
        console.log('KPI data fetched:', data);
        return data;
      } catch (error) {
        console.error('Error fetching KPI data:', error);
        throw error;
      }
    },
    retry: false // Prevent infinite retry loops
  });

  // Fetch departments data with employee counts
  const { data: departmentsData, isLoading: departmentsLoading, isError: departmentsError, error: departmentsErrorDetails } = useQuery({
    queryKey: ['departments-with-employees'],
    queryFn: async () => {
      try {
        console.log('Fetching departments data...');
        const { data, error } = await localDb
          .from('departments')
          .select(`
            id,
            name,
            description,
            employees (id, created_at, date_of_resumption)
          `)
          .order('name');

        if (error) {
          console.error('Departments data fetch error:', error);
          throw error;
        }

        console.log('Departments data fetched:', data);
        // Process data to include employee counts
        return (data || []).map(dept => ({
          ...dept,
          employee_count: dept.employees ? (Array.isArray(dept.employees) ? dept.employees.length : 1) : 0
        }));
      } catch (error) {
        console.error('Error fetching departments data:', error);
        throw error;
      }
    },
    retry: false
  });

  // Fetch employees data
  const { data: employeesData, isLoading: employeesLoading, isError: employeesError, error: employeesErrorDetails } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        console.log('Fetching employees data...');
        const { data, error } = await localDb
          .from('employees')
          .select(`
            *,
            department:departments(name)
          `)
          .order('name');

        if (error) {
          console.error('Employees data fetch error:', error);
          throw error;
        }
        console.log('Employees data fetched:', data);
        return data;
      } catch (error) {
        console.error('Error fetching employees data:', error);
        throw error;
      }
    },
    retry: false
  });

  // Function to generate consistent colors for departments
  const getColorForDepartment = (name: string) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
    const index = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Calculate employee growth data from real employee data
  const calculateEmployeeGrowthData = () => {
    if (!employeesData) return [];

    // Group employees by month of joining (created_at)
    const employeesByMonth: Record<string, { total: number, newHires: number, terminations: number }> = {};

    employeesData.forEach(employee => {
      if (employee.created_at) {
        const date = new Date(employee.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!employeesByMonth[monthKey]) {
          employeesByMonth[monthKey] = { total: 0, newHires: 0, terminations: 0 };
        }

        employeesByMonth[monthKey].newHires += 1;
      }
    });

    // Calculate cumulative totals
    const sortedMonths = Object.keys(employeesByMonth).sort();
    let cumulativeTotal = 0;

    return sortedMonths.map(month => {
      const monthData = employeesByMonth[month];
      cumulativeTotal += monthData.newHires;
      return {
        month: new Date(month + '-01').toLocaleString('default', { month: 'short' }),
        employees: cumulativeTotal,
        newHires: monthData.newHires,
        terminations: monthData.terminations
      };
    }).slice(-6); // Get last 6 months
  };

  const employeeGrowthData = calculateEmployeeGrowthData();

  // Prepare department data for charts with employee counts
  const departmentData = departmentsData ? departmentsData.map(dept => ({
    name: dept.name,
    value: dept.employee_count,
    color: getColorForDepartment(dept.name)
  })) : [];

  const performanceData = [
    { name: 'Exceeds Expectations', value: 25, color: '#10b981' },
    { name: 'Meets Expectations', value: 60, color: '#3b82f6' },
    { name: 'Needs Improvement', value: 12, color: '#f59e0b' },
    { name: 'Unsatisfactory', value: 3, color: '#ef4444' },
  ];

  const turnoverData = [
    { month: 'Jan', rate: 2.1 },
    { month: 'Feb', rate: 1.8 },
    { month: 'Mar', rate: 2.5 },
    { month: 'Apr', rate: 1.2 },
    { month: 'May', rate: 1.9 },
    { month: 'Jun', rate: 1.5 },
  ];

  // Group KPIs by department
  const kpisByDepartment = kpiData ? kpiData.reduce((acc: Record<string, KPIData[]>, kpi: KPIData) => {
    const dept = kpi.department_name || 'Unassigned';
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(kpi);
    return acc;
  }, {}) : {};

  // Group KPIs by employee
  const kpisByEmployee = kpiData ? kpiData.reduce((acc: Record<string, KPIData[]>, kpi: KPIData) => {
    const emp = kpi.employee_name || 'Unassigned';
    if (!acc[emp]) {
      acc[emp] = [];
    }
    acc[emp].push(kpi);
    return acc;
  }, {}) : {};

  // Generate mock employee scores for each department
  const generateEmployeeScores = (departmentName: string) => {
    const mockEmployees = employeesData?.filter(emp =>
      emp.department?.name === departmentName
    ) || [];

    return mockEmployees.map(emp => ({
      id: emp.id,
      name: emp.name,
      position: emp.position,
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      performanceScore: Math.floor(Math.random() * 30) + 70,
      qualityScore: Math.floor(Math.random() * 30) + 70,
      teamworkScore: Math.floor(Math.random() * 30) + 70,
      punctualityScore: Math.floor(Math.random() * 30) + 70,
      innovationScore: Math.floor(Math.random() * 30) + 60,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Navigation handlers
  const handleDepartmentClick = (department: DepartmentWithEmployees, employees: ScoredEmployee[]) => {
    setSelectedDepartment({ ...department, employees });
    setCurrentView('department');
  };

  const handleEmployeeClick = (employee: ScoredEmployee) => {
    const employeeWithBreakdown = {
      ...employee,
      scoreBreakdown: {
        performance: { current: employee.performanceScore, target: 85, trend: 'up' },
        quality: { current: employee.qualityScore, target: 90, trend: 'up' },
        teamwork: { current: employee.teamworkScore, target: 80, trend: 'down' },
        punctuality: { current: employee.punctualityScore, target: 95, trend: 'up' },
        innovation: { current: employee.innovationScore, target: 75, trend: 'up' }
      }
    };
    setSelectedEmployee(employeeWithBreakdown);
    setCurrentView('employee');
  };

  const handleBackToDefault = () => {
    setCurrentView('default');
    setSelectedDepartment(null);
    setSelectedEmployee(null);
  };

  const handleBackToDepartment = () => {
    setCurrentView('department');
    setSelectedEmployee(null);
  };

  // Check if there are any errors
  if (kpiError || departmentsError || employeesError) {
    return (
      <DashboardLayout title="KPIs" subtitle="Probus">
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Key Performance Indicators</h1>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold text-red-800">Error Loading KPI Data</h2>
              </div>
              <p className="text-red-700 mb-4">
                There was an error loading the KPI data. Please try refreshing the page.
              </p>
              {kpiError && (
                <div className="text-left bg-red-100 p-3 rounded mb-3">
                  <p className="font-medium text-red-800">KPI Error:</p>
                  <p className="text-red-700 text-sm">{kpiErrorDetails?.message || 'Unknown error'}</p>
                </div>
              )}
              {departmentsError && (
                <div className="text-left bg-red-100 p-3 rounded mb-3">
                  <p className="font-medium text-red-800">Departments Error:</p>
                  <p className="text-red-700 text-sm">{departmentsErrorDetails?.message || 'Unknown error'}</p>
                </div>
              )}
              {employeesError && (
                <div className="text-left bg-red-100 p-3 rounded mb-3">
                  <p className="font-medium text-red-800">Employees Error:</p>
                  <p className="text-red-700 text-sm">{employeesErrorDetails?.message || 'Unknown error'}</p>
                </div>
              )}
              <Button onClick={() => {
                refetchKpis();
                window.location.reload();
              }} className="bg-red-600 hover:bg-red-700">
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Render department view
  const renderDepartmentView = () => (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={handleBackToDefault} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to KPI Overview
        </Button>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">{selectedDepartment?.name} Department</span>
      </div>

      {/* Department Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            {selectedDepartment?.name} Department KPIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{selectedDepartment?.employees?.length || 0}</div>
              <div className="text-sm text-blue-700">Total Employees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900">
                {selectedDepartment?.employees?.reduce((avg: number, emp: ScoredEmployee) => avg + emp.overallScore, 0) / (selectedDepartment?.employees?.length || 1) || 0}%
              </div>
              <div className="text-sm text-green-700">Avg. Performance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900">
                {selectedDepartment?.employees?.filter((emp: ScoredEmployee) => emp.overallScore >= 80).length || 0}
              </div>
              <div className="text-sm text-purple-700">High Performers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Performance Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedDepartment?.employees?.map((employee: ScoredEmployee) => (
              <div
                key={employee.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                onClick={() => handleEmployeeClick(employee)}
              >
                <h3 className="font-semibold text-lg mb-2">{employee.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{employee.position}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overall Score</span>
                    <Badge variant={employee.overallScore >= 85 ? 'default' : employee.overallScore >= 70 ? 'secondary' : 'destructive'}>
                      {employee.overallScore}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${employee.overallScore >= 85 ? 'bg-green-500' : employee.overallScore >= 70 ? 'bg-blue-500' : 'bg-red-500'}`}
                      style={{ width: `${employee.overallScore}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Click to view detailed breakdown</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render employee detail view
  const renderEmployeeView = () => (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={handleBackToDefault} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          KPI Overview
        </Button>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <Button variant="ghost" onClick={handleBackToDepartment} className="text-gray-600">
          {selectedDepartment?.name}
        </Button>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">{selectedEmployee?.name}</span>
      </div>

      {/* Employee Header */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-6 h-6 text-purple-600" />
            {selectedEmployee?.name} - Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Position: {selectedEmployee?.position}</p>
              <p className="text-sm text-gray-600">Department: {selectedDepartment?.name}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-900">{selectedEmployee?.overallScore}%</div>
              <div className="text-sm text-purple-700">Overall Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(selectedEmployee?.scoreBreakdown || {}).map(([metric, data]: [string, ScoreMetric]) => (
          <Card key={metric} className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg capitalize flex items-center justify-between">
                {metric}
                <Badge variant={data.current >= data.target ? 'default' : 'secondary'}>
                  {data.current >= data.target ? 'Met' : 'Below Target'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="font-semibold">{data.current}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Target</span>
                  <span className="font-semibold">{data.target}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${data.current >= data.target ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${Math.min(data.current, 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${data.trend === 'up' ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                  <span className={`text-sm ${data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {data.trend === 'up' ? 'Improving' : 'Declining'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout title="KPIs" subtitle="Probus">
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Key Performance Indicators</h1>
          </div>

          {!kpiLoading && !departmentsLoading && !employeesLoading && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white p-1 rounded-lg shadow-sm border mb-6">
                <TabsTrigger value="overview">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="details">
                  <FileText className="w-4 h-4 mr-2" />
                  Department/Employee Details
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab - existing content */}
              <TabsContent value="overview" className="space-y-6">
                {/* KPI Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-blue-700 mb-1 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Total Employees
                          </div>
                          <div className="text-xl md:text-2xl font-bold text-blue-900">
                            {employeesData ? employeesData.length : '0'}
                          </div>
                          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" />
                            +2.1% from last month
                          </div>
                        </div>
                        <Users className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-green-700 mb-1 flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Avg. Performance
                          </div>
                          <div className="text-xl md:text-2xl font-bold text-green-900">86%</div>
                          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" />
                            +3.2% from last quarter
                          </div>
                        </div>
                        <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-amber-700 mb-1 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Rewards Given
                          </div>
                          <div className="text-xl md:text-2xl font-bold text-amber-900">24</div>
                          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" />
                            +8 from last month
                          </div>
                        </div>
                        <Award className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-50 to-red-100 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-red-700 mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Turnover Rate
                          </div>
                          <div className="text-xl md:text-2xl font-bold text-red-900">1.5%</div>
                          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3 rotate-180" />
                            -0.4% from last month
                          </div>
                        </div>
                        <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Employee Growth Chart */}
                  <Card className="bg-white shadow-sm border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-800">
                        <Users className="w-5 h-5 text-blue-600" />
                        Employee Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={employeeGrowthData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="employees" fill="#3b82f6" name="Total Employees" />
                          <Bar dataKey="newHires" fill="#10b981" name="New Hires" />
                          <Bar dataKey="terminations" fill="#ef4444" name="Terminations" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Department Distribution */}
                  <Card className="bg-white shadow-sm border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-800">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        Department Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={departmentData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {departmentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                          {departmentData.map((entry, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                              <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Performance Distribution */}
                  <Card className="bg-white shadow-sm border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-800">
                        <Target className="w-5 h-5 text-blue-600" />
                        Performance Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={performanceData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {performanceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                          {performanceData.map((entry, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                              <span className="text-sm text-gray-600">{entry.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Turnover Rate Trend */}
                  <Card className="bg-white shadow-sm border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-800">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Turnover Rate Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={turnoverData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="rate"
                            stroke="#ef4444"
                            name="Turnover Rate (%)"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Insights Section */}
                <Card className="bg-white shadow-sm border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h3 className="font-medium text-green-800">Positive Trend</h3>
                        </div>
                        <p className="text-sm text-green-700">
                          Employee growth is steady with a 2.1% increase this month. New hire retention rate is at 92%.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-blue-600" />
                          <h3 className="font-medium text-blue-800">Performance</h3>
                        </div>
                        <p className="text-sm text-blue-700">
                          85% of employees are meeting or exceeding performance expectations, up from 79% last quarter.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                          <h3 className="font-medium text-amber-800">Area of Focus</h3>
                        </div>
                        <p className="text-sm text-amber-700">
                          Turnover rate in the Engineering department is 3.2%, higher than company average of 1.5%.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab - Enhanced with drill-down */}
              <TabsContent value="details" className="space-y-6">
                {currentView === 'default' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departmentsData?.map((department) => {
                      const employees = generateEmployeeScores(department.name);
                      const avgScore = employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + emp.overallScore, 0) / employees.length) : 0;

                      return (
                        <Card
                          key={department.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
                          onClick={() => handleDepartmentClick(department, employees)}
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-600" />
                                {department.name}
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Employees</span>
                                <span className="font-semibold">{employees.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Avg. Score</span>
                                <Badge variant={avgScore >= 85 ? 'default' : avgScore >= 70 ? 'secondary' : 'destructive'}>
                                  {avgScore}%
                                </Badge>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${avgScore >= 85 ? 'bg-green-500' : avgScore >= 70 ? 'bg-blue-500' : 'bg-red-500'}`}
                                  style={{ width: `${avgScore}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Click to view employee details</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {currentView === 'department' && renderDepartmentView()}
                {currentView === 'employee' && renderEmployeeView()}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KPIs;
