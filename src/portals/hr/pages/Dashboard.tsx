import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  ClipboardCheck, 
  BarChart3, 
  Calendar, 
  Shield, 
  UserPlus,
  Award,
  AlertTriangle,
  Settings,
  Clock,
  Building2,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Menu,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Skeleton } from "../../shared/ui/skeleton";
import { cn } from "@/lib/utils";

// Import HR-specific components
import HRSidebar from '../layouts/HRSidebar';
import EmployeeManagement from '../components/EmployeeManagement';
import HRApprovals from '../components/HRApprovals';
import PolicyManagement from '../components/PolicyManagement';
import RecruitmentPanel from '../components/RecruitmentPanel';
import HRReports from '../components/HRReports';
import HRSettings from '../components/HRSettings';

// Import Employee components for full functionality
import TaskManager from '../../employee/components/TaskManager';
import TimeTracking from '../../employee/components/TimeTracking';
import Directory from '../../employee/components/Directory';
import LeaveManagement from '../../employee/components/LeaveManagement';
import RulesAndEthics from '../../employee/components/RulesAndEthics';
import Whistleblower from '../../employee/components/Whistleblower';
import Apps from '../../employee/components/Apps';
import SettingsComponent from '../../employee/components/Settings';
import NotificationCenter from '../../shared/components/NotificationCenter';
import NotificationsPage from '../../employee/components/NotificationsPage';
import ChatInterface from '../../shared/components/chat/ChatInterface';
import Events from '../../admin/pages/Events';
import { useEmployeeStats } from '@/hooks/useEmployeeStats';
import ActivityAnalytics from '../../employee/components/ActivityAnalytics';

// Mock hooks for HR statistics
const useHRStats = (userId: string) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setStats({
        totalEmployees: 247,
        pendingApprovals: 12,
        activeRecruitment: 8,
        resignations: 3,
        newHires: 15,
        pendingOnboarding: 6,
        complianceIssues: 2,
        policiesNeedReview: 4,
        departmentUpdates: 7,
        hrTickets: 18
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [userId]);

  return { stats, loading, error };
};

const HRDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userId] = useState('hr-001'); // In a real app, this would come from auth context
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar toggle
  const [selectedChatEmployee, setSelectedChatEmployee] = useState<{id: string, name: string, callType?: 'voice' | 'video'} | null>(null);

  // Handle tab changes - stay within HR portal
  const handleTabChange = (tab: string) => {
 if (tab === 'mywork') {
      // HR users should stay within their portal for task management
      navigate('/hr');
    } else {
      setActiveTab(tab);
    }
  };

  // Handle opening chat with a specific employee
  const handleOpenChat = (employeeId: string, employeeName: string, callType?: 'voice' | 'video') => {
    setSelectedChatEmployee({ id: employeeId, name: employeeName, callType });
    setActiveTab('messages');
  };

  // Fetch HR statistics and employee stats for comprehensive view
  const { stats, loading: statsLoading, error: statsError } = useHRStats(userId);
  const { stats: employeeStats, loading: employeeStatsLoading } = useEmployeeStats(userId);

  // Log user login when component mounts with employee-style activity logging
  useEffect(() => {
    console.log('HR Dashboard loaded for user:', userId);
    
    // TODO: Re-enable when auditService is available
    // const loginEvent = {
    //   eventType: 'login' as const,
    //   userId,
    //   timestamp: new Date().toISOString(),
    //   page: window.location.pathname
    // };
    // 
    // logUserActivity(loginEvent);
    // 
    // // Log page view
    // const pageViewEvent = {
    //   eventType: 'page_view' as const,
    //   userId,
    //   timestamp: new Date().toISOString(),
    //   page: window.location.pathname
    // };
    // 
    // logUserActivity(pageViewEvent);
    // 
    // // Cleanup function to log logout when component unmounts
    // return () => {
    //   const logoutEvent = {
    //     eventType: 'logout' as const,
    //     userId,
    //     timestamp: new Date().toISOString()
    //   };
    //   
    //   logUserActivity(logoutEvent);
    // };
  }, [userId]);

  // Mock data for HR dashboard
  const recentActivities = [
    { id: '1', type: 'approval', title: 'Leave Request - Sarah Johnson', time: '2 hours ago', priority: 'high' },
    { id: '2', type: 'onboarding', title: 'New Employee - Mike Chen', time: '4 hours ago', priority: 'medium' },
    { id: '3', type: 'policy', title: 'Remote Work Policy Update', time: '1 day ago', priority: 'low' },
    { id: '4', type: 'recruitment', title: 'Interview Scheduled - Jane Doe', time: '2 days ago', priority: 'medium' },
    { id: '5', type: 'compliance', title: 'Training Completion Overdue', time: '3 days ago', priority: 'high' }
  ];

  const upcomingTasks = [
    { id: '1', task: 'Performance Reviews Q4', due: 'Dec 15, 2024', status: 'pending' },
    { id: '2', task: 'Benefits Enrollment Period', due: 'Jan 1, 2025', status: 'in-progress' },
    { id: '3', task: 'Annual Compliance Training', due: 'Dec 31, 2024', status: 'pending' },
    { id: '4', task: 'Salary Review Cycle', due: 'Jan 15, 2025', status: 'planned' }
  ];

  // Mock employee-style data for comprehensive functionality
  const kpiData = {
    unreadMessages: 8,
    upcomingTasks: 5,
    teamAnnouncements: 3,
    isClockedIn: false,
    lastClockIn: ''
  };

  // Mock activity records data for HR activities
  const activityRecords = [
    { id: '3', date: '2025-09-01', type: 'task_completed' as const, count: 15, details: 'Employee onboarding tasks' },
    { id: '4', date: '2025-09-01', type: 'task_completed' as const, count: 8, details: 'HR compliance reviews' },
    { id: '5', date: '2025-09-02', type: 'meeting_attended' as const, count: 4, details: 'Management and recruitment meetings' },
    { id: '8', date: '2025-09-03', type: 'task_completed' as const, count: 12, details: 'HR administrative tasks' },
    { id: '9', date: '2025-09-04', type: 'task_completed' as const, count: 6, details: 'Policy documentation updates' },
    { id: '10', date: '2025-09-04', type: 'meeting_attended' as const, count: 3, details: 'HR strategy planning' },
    { id: '13', date: '2025-09-05', type: 'task_completed' as const, count: 20, details: 'Employee data management' },
    { id: '14', date: '2025-09-05', type: 'absent' as const, count: 0, details: 'HR team attendance' },
    { id: '17', date: '2025-09-06', type: 'task_completed' as const, count: 8, details: 'Critical HR support' },
  ];

  // Handle clock in/out functionality for HR staff
  const handleClockInOut = async () => {
    console.log('HR Clock in/out clicked');
    
    const isClockedIn = false; // Mock state
    
    // TODO: Re-enable when auditService is available
    // try {
    //   await captureAndLogLocation(userId, isClockedIn ? 'clock_out' : 'clock_in');
    // } catch (error) {
    //   console.error('Error during HR clock in/out:', error);
    // }
  };

  const renderDashboardContent = () => (
    <div className="mb-6 max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pastel-blue-100 to-pastel-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 mb-8 shadow-sm border border-blue-200 dark:border-slate-600">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-slate-100 mb-2">Welcome back!</h1>
            <p className="text-blue-700 dark:text-slate-300">Here's what's happening with HR today.</p>
          </div>
          <Button
            onClick={handleClockInOut}
            className="bg-white dark:bg-slate-800 text-blue-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl px-6 py-6 shadow-sm font-medium transition-all flex items-center gap-2"
          >
            <Clock className="w-5 h-5" />
            Clock In
          </Button>
        </div>
      </div>
      
      {/* HR Statistics KPIs */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4 sm:mb-6">HR Overview</h2>
        {statsError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-red-700">Error loading HR statistics: {statsError}</p>
          </div>
        )}
        
        {statsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <Card key={i} className="border border-blue-200 shadow-sm rounded-xl bg-gradient-to-br from-blue-50 to-sky-50">
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-7 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Total Employees */}
            <Card 
              className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl bg-gradient-to-br from-blue-50 to-sky-50"
              onClick={() => setActiveTab('employees')}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-700">Total Employees</p>
                    <h3 className="text-2xl font-semibold text-blue-900 mt-2">{stats.totalEmployees}</h3>
                  </div>
                  <div className="p-2.5 bg-blue-100 rounded-xl border border-blue-200">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Pending Approvals */}
            <Card 
              className="border border-sky-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50"
              onClick={() => setActiveTab('approvals')}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-sky-700">Pending Approvals</p>
                    <h3 className="text-2xl font-semibold text-sky-900 mt-2">{stats.pendingApprovals}</h3>
                  </div>
                  <div className="p-2.5 bg-sky-100 rounded-xl border border-sky-200">
                    <ClipboardCheck className="w-5 h-5 text-sky-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Whistleblower Reports */}
            <Card 
              className="border border-indigo-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50"
              onClick={() => setActiveTab('whistleblower')}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-700">Safety Reports</p>
                    <h3 className="text-2xl font-semibold text-indigo-900 mt-2">{stats.complianceIssues}</h3>
                  </div>
                  <div className="p-2.5 bg-indigo-100 rounded-xl border border-indigo-200">
                    <Shield className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
      
      {/* Quick Access */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4 sm:mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card 
            className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-blue-50 to-sky-50"
            onClick={() => setActiveTab('approvals')}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-blue-900 flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors border border-blue-200">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                </div>
                My Work
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-blue-700 mb-4 leading-relaxed">All pending HR tasks and approvals</p>
              <div className="flex items-center justify-between text-xs text-blue-600 mb-3">
                <span>Pending Items</span>
                <span className="font-semibold text-blue-700">{stats?.pendingApprovals || 0}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('approvals'); }}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 rounded-xl text-sm font-medium shadow-sm transition-colors w-full h-10"
              >
                View All
              </button>
            </CardContent>
          </Card>
          
          <Card 
            className="border border-sky-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-sky-50 to-cyan-50"
            onClick={() => setActiveTab('employees')}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-sky-900 flex items-center gap-3">
                <div className="p-2.5 bg-sky-100 rounded-xl group-hover:bg-sky-200 transition-colors border border-sky-200">
                  <Users className="w-5 h-5 text-sky-600" />
                </div>
                Employee Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-sky-700 mb-4 leading-relaxed">Manage employee records and data</p>
              <div className="flex items-center justify-between text-xs text-sky-600 mb-3">
                <span>Total Employees</span>
                <span className="font-semibold text-sky-700">{stats?.totalEmployees || 0}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('employees'); }}
                className="bg-sky-600 text-white hover:bg-sky-700 px-4 rounded-xl text-sm font-medium shadow-sm transition-colors w-full h-10"
              >
                Manage
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activities & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activities */}
        <Card className="border border-blue-200 shadow-sm rounded-xl bg-gradient-to-br from-blue-50/30 to-sky-50/30">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-blue-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge 
                    variant={activity.priority === 'high' ? 'destructive' : activity.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {activity.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border border-sky-200 shadow-sm rounded-xl bg-gradient-to-br from-sky-50/30 to-cyan-50/30">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-sky-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{task.task}</p>
                    <p className="text-xs text-gray-500">Due: {task.due}</p>
                  </div>
                  <Badge 
                    variant={task.status === 'pending' ? 'default' : task.status === 'in-progress' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Analytics */}
      <div className="mb-8">
        <ActivityAnalytics activityRecords={activityRecords} />
      </div>
      
      {/* Employee Statistics Charts */}
      {/* TODO: Re-enable when EmployeeStatsChart component is available */}
      {/* !employeeStatsLoading && employeeStats && (
        <EmployeeStatsChart stats={employeeStats} />
      ) */}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 w-full overflow-hidden max-w-full">
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-blue-600 dark:bg-blue-700 text-white shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      
      {/* Sidebar - desktop version */}
      <div className="hidden md:block w-64 h-screen fixed top-0 left-0 z-30">
        <HRSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>
      
      {/* Sidebar - mobile version */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="w-64 h-screen bg-white fixed left-0 top-0 shadow-2xl">
            <HRSidebar activeTab={activeTab} setActiveTab={(tab) => {
              handleTabChange(tab);
              setSidebarOpen(false); // Close sidebar when tab is selected on mobile
            }} />
          </div>
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden md:ml-64 max-w-full overflow-x-hidden">
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto max-w-full overflow-x-hidden">
          {activeTab === 'dashboard' && renderDashboardContent()}
          {activeTab === 'employees' && <EmployeeManagement onOpenChat={handleOpenChat} />}
          {activeTab === 'approvals' && <HRApprovals />}
          {activeTab === 'tasks' && <TaskManager />}
          {activeTab === 'leave' && <LeaveManagement />}
          {activeTab === 'messages' && (
            <ChatInterface 
              userId={userId} 
              userName="HR Manager" 
              selectedEmployee={selectedChatEmployee}
            />
          )}
          {activeTab === 'notifications' && <NotificationsPage />}
          {activeTab === 'directory' && <Directory onOpenChat={handleOpenChat} />}
          {activeTab === 'whistleblower' && <Whistleblower />}
          {activeTab === 'settings' && <SettingsComponent />}
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
