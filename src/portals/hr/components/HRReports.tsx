import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Download, 
  Users,
  UserCheck,
  UserX,
  Calendar,
  DollarSign,
  Award,
  Clock,
  AlertTriangle,
  Activity,
  PieChart,
  FileSpreadsheet,
  Target,
  Briefcase,
  GraduationCap,
  Filter,
  CheckCircle,
  History,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";

const HRReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('11');
  const [selectedQuarter, setSelectedQuarter] = useState('Q4');
  const [showHistoricalView, setShowHistoricalView] = useState(false);
  const [historicalRange, setHistoricalRange] = useState('6months'); // 3months, 6months, 1year, 2years, 5years

  // Available years for filtering
  const availableYears = ['2024', '2023', '2022', '2021', '2020'];
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  // Mock data for reports
  const employeeMetrics = {
    total: 247,
    active: 235,
    onLeave: 8,
    resigned: 4,
    newHires: 15,
    turnoverRate: '6.2%',
    avgTenure: '3.2 years',
    satisfaction: '87%'
  };

  const departmentStats = [
    { name: 'Engineering', employees: 85, growth: '+12%', status: 'growing' },
    { name: 'Sales', employees: 42, growth: '+8%', status: 'growing' },
    { name: 'Marketing', employees: 28, growth: '+5%', status: 'stable' },
    { name: 'Operations', employees: 35, growth: '-3%', status: 'declining' },
    { name: 'HR', employees: 15, growth: '+2%', status: 'stable' },
    { name: 'Finance', employees: 22, growth: '+6%', status: 'growing' },
    { name: 'Customer Success', employees: 20, growth: '+15%', status: 'growing' }
  ];

  const attendanceData = {
    presentToday: 228,
    onLeaveToday: 12,
    absent: 7,
    avgAttendance: '94.5%',
    lateArrivals: 3,
    earlyDepartures: 2
  };

  const performanceData = {
    excellent: 45,
    good: 125,
    satisfactory: 58,
    needsImprovement: 19,
    avgRating: 4.1,
    completedReviews: '89%'
  };

  const recruitmentMetrics = {
    openPositions: 12,
    activeApplications: 48,
    interviewsScheduled: 15,
    offersExtended: 6,
    avgTimeToHire: '28 days',
    acceptanceRate: '78%'
  };

  const payrollSummary = {
    totalPayroll: '$2,450,000',
    avgSalary: '$9,919',
    pendingPayments: 0,
    benefitsCost: '$385,000',
    overtimeHours: 142,
    bonusesPaid: '$125,000'
  };

  const trainingMetrics = {
    coursesCompleted: 324,
    hoursTraining: 1248,
    certifications: 67,
    complianceRate: '96%',
    avgTrainingPerEmployee: '5.2 hrs',
    inProgressCourses: 89
  };

  // Historical data generator based on selected range
  const generateHistoricalData = (range: string) => {
    const periods = [];
    const baseDate = new Date(2024, 10, 1); // November 2024
    
    let numPeriods = 0;
    let periodType = 'month';
    
    switch(range) {
      case '3months':
        numPeriods = 3;
        periodType = 'month';
        break;
      case '6months':
        numPeriods = 6;
        periodType = 'month';
        break;
      case '1year':
        numPeriods = 12;
        periodType = 'month';
        break;
      case '2years':
        numPeriods = 8;
        periodType = 'quarter';
        break;
      case '5years':
        numPeriods = 5;
        periodType = 'year';
        break;
      default:
        numPeriods = 6;
        periodType = 'month';
    }
    
    for (let i = numPeriods - 1; i >= 0; i--) {
      let date = new Date(baseDate);
      let label = '';
      
      if (periodType === 'month') {
        date.setMonth(date.getMonth() - i);
        label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } else if (periodType === 'quarter') {
        const quarterBack = Math.floor(i / 3);
        date.setMonth(date.getMonth() - (quarterBack * 3));
        const q = Math.ceil((date.getMonth() + 1) / 3);
        label = `Q${q} ${date.getFullYear()}`;
      } else {
        date.setFullYear(date.getFullYear() - i);
        label = date.getFullYear().toString();
      }
      
      // Generate realistic fluctuating data
      const baseEmployees = 220 + Math.floor(Math.random() * 30);
      const variation = () => Math.floor(Math.random() * 15) - 7;
      
      periods.push({
        period: label,
        employees: baseEmployees + variation(),
        newHires: 8 + Math.floor(Math.random() * 12),
        turnover: (4 + Math.floor(Math.random() * 6)) + '%',
        turnoverNum: 4 + Math.floor(Math.random() * 6),
        attendance: (92 + Math.floor(Math.random() * 6)) + '%',
        satisfaction: (82 + Math.floor(Math.random() * 12)) + '%',
        avgSalary: '$' + (9200 + Math.floor(Math.random() * 1500)).toLocaleString(),
        trainingHours: 950 + Math.floor(Math.random() * 500),
        openPositions: 5 + Math.floor(Math.random() * 15),
        performanceAvg: (3.8 + Math.random() * 0.6).toFixed(1)
      });
    }
    
    return periods;
  };

  const historicalData = useMemo(() => generateHistoricalData(historicalRange), [historicalRange]);
  
  // Calculate trends
  const calculateTrend = (data: any[], key: string) => {
    if (data.length < 2) return { direction: 'stable', percentage: '0' };
    
    const latest = typeof data[data.length - 1][key] === 'string' 
      ? parseFloat(data[data.length - 1][key].replace(/[^0-9.]/g, ''))
      : data[data.length - 1][key];
    const previous = typeof data[data.length - 2][key] === 'string'
      ? parseFloat(data[data.length - 2][key].replace(/[^0-9.]/g, ''))
      : data[data.length - 2][key];
    
    const change = ((latest - previous) / previous) * 100;
    
    return {
      direction: change > 1 ? 'up' : change < -1 ? 'down' : 'stable',
      percentage: Math.abs(change).toFixed(1)
    };
  };

  const quickReports = [
    { id: 1, name: 'Monthly Headcount Report', type: 'PDF', lastGenerated: '2 hours ago' },
    { id: 2, name: 'Attendance Summary Q4', type: 'Excel', lastGenerated: '1 day ago' },
    { id: 3, name: 'Performance Review Report', type: 'PDF', lastGenerated: '3 days ago' },
    { id: 4, name: 'Recruitment Pipeline', type: 'Excel', lastGenerated: '5 days ago' },
    { id: 5, name: 'Payroll Breakdown', type: 'PDF', lastGenerated: '1 week ago' },
    { id: 6, name: 'Training Completion Report', type: 'Excel', lastGenerated: '1 week ago' }
  ];

  const handleDownloadReport = (reportName: string) => {
    console.log(`Downloading report: ${reportName}`);
    // Simulate download with toast notification
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = `
      <div style="position: fixed; bottom: 20px; right: 20px; background: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid #3b82f6; z-index: 9999; min-width: 300px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="background: #eff6ff; padding: 8px; border-radius: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </div>
          <div>
            <p style="margin: 0; font-weight: 600; color: #1e3a8a; font-size: 14px;">Download Started</p>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 13px;">${reportName}</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(toastContainer);
    setTimeout(() => {
      toastContainer.remove();
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 p-8 shadow-xl border border-blue-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-300/15 rounded-full blur-2xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold text-blue-900 drop-shadow-sm">HR Reports & Analytics</h1>
          <p className="text-blue-700 mt-2">Comprehensive insights and data-driven decisions</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                className={selectedPeriod === 'week' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-300'}
                onClick={() => { setSelectedPeriod('week'); setShowHistoricalView(false); }}
              >
                This Week
              </Button>
              <Button 
                variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                className={selectedPeriod === 'month' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-300'}
                onClick={() => { setSelectedPeriod('month'); setShowHistoricalView(false); }}
              >
                This Month
              </Button>
              <Button 
                variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
                className={selectedPeriod === 'quarter' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-300'}
                onClick={() => { setSelectedPeriod('quarter'); setShowHistoricalView(false); }}
              >
                This Quarter
              </Button>
              <Button 
                variant={selectedPeriod === 'year' ? 'default' : 'outline'}
                className={selectedPeriod === 'year' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-300'}
                onClick={() => { setSelectedPeriod('year'); setShowHistoricalView(false); }}
              >
                This Year
              </Button>
            </div>
            <Button
              variant={showHistoricalView ? 'default' : 'outline'}
              className={showHistoricalView ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-300 flex items-center gap-2'}
              onClick={() => setShowHistoricalView(!showHistoricalView)}
            >
              <History className="w-4 h-4" />
              Historical View
            </Button>
          </div>
        </div>
      </div>

      {/* Historical View Section */}
      {showHistoricalView && (
        <Card className="shadow-xl border border-blue-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                  <History className="w-6 h-6 text-blue-600" />
                  Historical Reports Overview
                </h2>
                <p className="text-sm text-blue-700 mt-1">Track trends and patterns over time</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant={historicalRange === '3months' ? 'default' : 'outline'}
                  className={historicalRange === '3months' ? 'bg-blue-500 hover:bg-blue-600' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}
                  onClick={() => setHistoricalRange('3months')}
                >
                  3 Months
                </Button>
                <Button
                  size="sm"
                  variant={historicalRange === '6months' ? 'default' : 'outline'}
                  className={historicalRange === '6months' ? 'bg-blue-500 hover:bg-blue-600' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}
                  onClick={() => setHistoricalRange('6months')}
                >
                  6 Months
                </Button>
                <Button
                  size="sm"
                  variant={historicalRange === '1year' ? 'default' : 'outline'}
                  className={historicalRange === '1year' ? 'bg-blue-500 hover:bg-blue-600' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}
                  onClick={() => setHistoricalRange('1year')}
                >
                  1 Year
                </Button>
                <Button
                  size="sm"
                  variant={historicalRange === '2years' ? 'default' : 'outline'}
                  className={historicalRange === '2years' ? 'bg-blue-500 hover:bg-blue-600' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}
                  onClick={() => setHistoricalRange('2years')}
                >
                  2 Years
                </Button>
                <Button
                  size="sm"
                  variant={historicalRange === '5years' ? 'default' : 'outline'}
                  className={historicalRange === '5years' ? 'bg-blue-500 hover:bg-blue-600' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}
                  onClick={() => setHistoricalRange('5years')}
                >
                  5 Years
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            {/* Historical Trends Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-blue-700">Employees Trend</p>
                  {calculateTrend(historicalData, 'employees').direction === 'up' ? (
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  ) : calculateTrend(historicalData, 'employees').direction === 'down' ? (
                    <ArrowDownRight className="w-5 h-5 text-red-600" />
                  ) : (
                    <Minus className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <p className={`text-2xl font-bold ${
                  calculateTrend(historicalData, 'employees').direction === 'up' ? 'text-green-600' :
                  calculateTrend(historicalData, 'employees').direction === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {calculateTrend(historicalData, 'employees').direction !== 'stable' && (
                    calculateTrend(historicalData, 'employees').direction === 'up' ? '+' : '-'
                  )}
                  {calculateTrend(historicalData, 'employees').percentage}%
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-blue-700">Attendance Trend</p>
                  {calculateTrend(historicalData, 'attendance').direction === 'up' ? (
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  ) : calculateTrend(historicalData, 'attendance').direction === 'down' ? (
                    <ArrowDownRight className="w-5 h-5 text-red-600" />
                  ) : (
                    <Minus className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <p className={`text-2xl font-bold ${
                  calculateTrend(historicalData, 'attendance').direction === 'up' ? 'text-green-600' :
                  calculateTrend(historicalData, 'attendance').direction === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {calculateTrend(historicalData, 'attendance').direction !== 'stable' && (
                    calculateTrend(historicalData, 'attendance').direction === 'up' ? '+' : '-'
                  )}
                  {calculateTrend(historicalData, 'attendance').percentage}%
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-blue-700">Satisfaction Trend</p>
                  {calculateTrend(historicalData, 'satisfaction').direction === 'up' ? (
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  ) : calculateTrend(historicalData, 'satisfaction').direction === 'down' ? (
                    <ArrowDownRight className="w-5 h-5 text-red-600" />
                  ) : (
                    <Minus className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <p className={`text-2xl font-bold ${
                  calculateTrend(historicalData, 'satisfaction').direction === 'up' ? 'text-green-600' :
                  calculateTrend(historicalData, 'satisfaction').direction === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {calculateTrend(historicalData, 'satisfaction').direction !== 'stable' && (
                    calculateTrend(historicalData, 'satisfaction').direction === 'up' ? '+' : '-'
                  )}
                  {calculateTrend(historicalData, 'satisfaction').percentage}%
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-blue-700">Turnover Trend</p>
                  {calculateTrend(historicalData, 'turnoverNum').direction === 'down' ? (
                    <ArrowDownRight className="w-5 h-5 text-green-600" />
                  ) : calculateTrend(historicalData, 'turnoverNum').direction === 'up' ? (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  ) : (
                    <Minus className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <p className={`text-2xl font-bold ${
                  calculateTrend(historicalData, 'turnoverNum').direction === 'down' ? 'text-green-600' :
                  calculateTrend(historicalData, 'turnoverNum').direction === 'up' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {calculateTrend(historicalData, 'turnoverNum').direction !== 'stable' && (
                    calculateTrend(historicalData, 'turnoverNum').direction === 'up' ? '+' : '-'
                  )}
                  {calculateTrend(historicalData, 'turnoverNum').percentage}%
                </p>
              </div>
            </div>

            {/* Historical Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-700">Period</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Employees</th>
                    <th className="text-right p-3 font-semibold text-gray-700">New Hires</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Turnover</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Attendance</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Satisfaction</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Avg Salary</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Training (hrs)</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Open Positions</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalData.map((data, index) => (
                    <tr 
                      key={index}
                      className="border-b border-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all"
                    >
                      <td className="p-3 font-semibold text-gray-900">{data.period}</td>
                      <td className="p-3 text-right text-gray-700">{data.employees}</td>
                      <td className="p-3 text-right">
                        <Badge variant="default" className="bg-green-100 text-green-700">
                          +{data.newHires}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          {data.turnover}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-gray-700">{data.attendance}</td>
                      <td className="p-3 text-right text-gray-700">{data.satisfaction}</td>
                      <td className="p-3 text-right text-gray-700">{data.avgSalary}</td>
                      <td className="p-3 text-right text-gray-700">{data.trainingHours}</td>
                      <td className="p-3 text-right text-gray-700">{data.openPositions}</td>
                      <td className="p-3 text-right">
                        <Badge 
                          variant="default"
                          className={`${
                            parseFloat(data.performanceAvg) >= 4.2 ? 'bg-green-100 text-green-700' :
                            parseFloat(data.performanceAvg) >= 3.8 ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {data.performanceAvg}/5.0
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Download Historical Report */}
            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleDownloadReport(`Historical Report - ${historicalRange}`)}
              >
                <Download className="w-4 h-4" />
                Download Excel
              </Button>
              <Button 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => handleDownloadReport(`Historical Report PDF - ${historicalRange}`)}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Employees */}
        <Card className="border border-blue-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-300/30 rounded-full blur-xl"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-blue-700 uppercase">Total Employees</p>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-4xl font-bold text-blue-900">{employeeMetrics.total}</h3>
            <p className="text-sm text-blue-700 mt-2">+{employeeMetrics.newHires} new this month</p>
          </CardContent>
        </Card>

        {/* Active Employees */}
        <Card className="border border-sky-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-cyan-200"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-300/30 rounded-full blur-xl"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-sky-700 uppercase">Active</p>
              <UserCheck className="w-5 h-5 text-sky-600" />
            </div>
            <h3 className="text-4xl font-bold text-sky-900">{employeeMetrics.active}</h3>
            <p className="text-sm text-sky-700 mt-2">{attendanceData.avgAttendance} attendance</p>
          </CardContent>
        </Card>

        {/* Turnover Rate */}
        <Card className="border border-indigo-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-200"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-300/30 rounded-full blur-xl"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-indigo-700 uppercase">Turnover Rate</p>
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-4xl font-bold text-indigo-900">{employeeMetrics.turnoverRate}</h3>
            <p className="text-sm text-indigo-700 mt-2">Industry avg: 8.5%</p>
          </CardContent>
        </Card>

        {/* Satisfaction Score */}
        <Card className="border border-blue-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-indigo-200"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-300/30 rounded-full blur-xl"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-blue-700 uppercase">Satisfaction</p>
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-4xl font-bold text-blue-900">{employeeMetrics.satisfaction}</h3>
            <p className="text-sm text-blue-700 mt-2">+3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4 mt-6">
          <Card className="shadow-lg border border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Department Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {departmentStats.map((dept) => (
                  <div 
                    key={dept.name}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-200"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{dept.name}</h4>
                      <p className="text-sm text-gray-600">{dept.employees} employees</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          dept.status === 'growing' ? 'text-green-600' : 
                          dept.status === 'declining' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {dept.growth}
                        </p>
                        <p className="text-xs text-gray-500">Growth</p>
                      </div>
                      <Badge 
                        variant={dept.status === 'growing' ? 'default' : dept.status === 'declining' ? 'destructive' : 'secondary'}
                      >
                        {dept.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-sky-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <UserCheck className="w-8 h-8 text-blue-600" />
                  <Badge variant="default" className="bg-green-100 text-green-700">Today</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{attendanceData.presentToday}</h3>
                <p className="text-sm text-gray-600 mt-1">Present Employees</p>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-sky-50 to-cyan-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-sky-600" />
                  <Badge variant="secondary">Today</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{attendanceData.onLeaveToday}</h3>
                <p className="text-sm text-gray-600 mt-1">On Leave</p>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <UserX className="w-8 h-8 text-indigo-600" />
                  <Badge variant="destructive">Today</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{attendanceData.absent}</h3>
                <p className="text-sm text-gray-600 mt-1">Absent</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">Average Attendance</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{attendanceData.avgAttendance}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">Late Arrivals</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{attendanceData.lateArrivals}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">Early Departures</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{attendanceData.earlyDepartures}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-100 to-sky-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-blue-800">{performanceData.excellent}</h3>
                <p className="text-sm text-blue-700 mt-1">Excellent</p>
              </CardContent>
            </Card>

            <Card className="border border-sky-200 shadow-lg bg-gradient-to-br from-sky-100 to-cyan-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-3xl font-bold text-sky-800">{performanceData.good}</h3>
                <p className="text-sm text-sky-700 mt-1">Good</p>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 shadow-lg bg-gradient-to-br from-indigo-100 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-bold text-indigo-800">{performanceData.satisfactory}</h3>
                <p className="text-sm text-indigo-700 mt-1">Satisfactory</p>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-cyan-100 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-6 h-6 text-cyan-700" />
                </div>
                <h3 className="text-3xl font-bold text-cyan-800">{performanceData.needsImprovement}</h3>
                <p className="text-sm text-cyan-700 mt-1">Needs Work</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700 mb-2">Average Rating</p>
                  <p className="text-4xl font-bold text-blue-900">{performanceData.avgRating}/5.0</p>
                  <p className="text-sm text-blue-700 mt-2">Across all employees</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-xl border border-sky-200">
                  <p className="text-sm text-sky-700 mb-2">Review Completion</p>
                  <p className="text-4xl font-bold text-sky-900">{performanceData.completedReviews}</p>
                  <p className="text-sm text-sky-700 mt-2">Annual reviews completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recruitment Tab */}
        <TabsContent value="recruitment" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-sky-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-900">Open Positions</h4>
                </div>
                <p className="text-3xl font-bold text-blue-900">{recruitmentMetrics.openPositions}</p>
              </CardContent>
            </Card>

            <Card className="border border-sky-200 shadow-lg bg-gradient-to-br from-sky-50 to-cyan-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-sky-100 rounded-lg border border-sky-200">
                    <FileText className="w-6 h-6 text-sky-600" />
                  </div>
                  <h4 className="font-semibold text-sky-900">Applications</h4>
                </div>
                <p className="text-3xl font-bold text-sky-900">{recruitmentMetrics.activeApplications}</p>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg border border-indigo-200">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-indigo-900">Interviews</h4>
                </div>
                <p className="text-3xl font-bold text-indigo-900">{recruitmentMetrics.interviewsScheduled}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Recruitment Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">Avg Time to Hire</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{recruitmentMetrics.avgTimeToHire}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-lg border border-sky-200">
                  <p className="text-sm text-sky-700">Acceptance Rate</p>
                  <p className="text-2xl font-bold text-sky-900 mt-1">{recruitmentMetrics.acceptanceRate}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-700">Offers Extended</p>
                  <p className="text-2xl font-bold text-indigo-900 mt-1">{recruitmentMetrics.offersExtended}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-blue-200 shadow-xl overflow-hidden relative bg-gradient-to-br from-blue-50 to-sky-100">
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  <h4 className="text-lg font-semibold text-blue-900">Total Monthly Payroll</h4>
                </div>
                <p className="text-4xl font-bold text-blue-900">{payrollSummary.totalPayroll}</p>
                <p className="text-sm text-blue-700 mt-2">Average per employee: {payrollSummary.avgSalary}</p>
              </CardContent>
            </Card>

            <Card className="border border-sky-200 shadow-xl overflow-hidden relative bg-gradient-to-br from-sky-50 to-cyan-100">
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-8 h-8 text-sky-600" />
                  <h4 className="text-lg font-semibold text-sky-900">Benefits Cost</h4>
                </div>
                <p className="text-4xl font-bold text-sky-900">{payrollSummary.benefitsCost}</p>
                <p className="text-sm text-sky-700 mt-2">Monthly benefits allocation</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Additional Payroll Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">Overtime Hours</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{payrollSummary.overtimeHours}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg border border-sky-200">
                  <p className="text-sm text-sky-700">Bonuses Paid</p>
                  <p className="text-2xl font-bold text-sky-900 mt-1">{payrollSummary.bonusesPaid}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                  <p className="text-sm text-cyan-700">Pending Payments</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{payrollSummary.pendingPayments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-sky-50">
              <CardContent className="p-6">
                <GraduationCap className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-blue-900">{trainingMetrics.coursesCompleted}</h3>
                <p className="text-sm text-blue-700 mt-1">Courses Completed</p>
              </CardContent>
            </Card>

            <Card className="border border-sky-200 shadow-lg bg-gradient-to-br from-sky-50 to-cyan-50">
              <CardContent className="p-6">
                <Clock className="w-8 h-8 text-sky-600 mb-4" />
                <h3 className="text-3xl font-bold text-sky-900">{trainingMetrics.hoursTraining}</h3>
                <p className="text-sm text-sky-700 mt-1">Training Hours</p>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardContent className="p-6">
                <Award className="w-8 h-8 text-indigo-600 mb-4" />
                <h3 className="text-3xl font-bold text-indigo-900">{trainingMetrics.certifications}</h3>
                <p className="text-sm text-indigo-700 mt-1">Certifications</p>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
              <CardContent className="p-6">
                <CheckCircle className="w-8 h-8 text-cyan-600 mb-4" />
                <h3 className="text-3xl font-bold text-cyan-900">{trainingMetrics.complianceRate}</h3>
                <p className="text-sm text-cyan-700 mt-1">Compliance Rate</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Training Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl border border-indigo-200">
                  <p className="text-sm text-indigo-700 mb-2">Avg Training per Employee</p>
                  <p className="text-4xl font-bold text-indigo-900">{trainingMetrics.avgTrainingPerEmployee}</p>
                  <p className="text-sm text-indigo-700 mt-2">Per employee this quarter</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700 mb-2">In Progress</p>
                  <p className="text-4xl font-bold text-blue-900">{trainingMetrics.inProgressCourses}</p>
                  <p className="text-sm text-blue-700 mt-2">Courses currently active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Report Downloads */}
      <Card className="shadow-xl border border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            Quick Report Downloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickReports.map((report) => (
              <div 
                key={report.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-200 group"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{report.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{report.type}</Badge>
                    <span className="text-xs text-gray-500">{report.lastGenerated}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-3 group-hover:bg-blue-100 group-hover:text-blue-700"
                  onClick={() => handleDownloadReport(report.name)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRReports;
