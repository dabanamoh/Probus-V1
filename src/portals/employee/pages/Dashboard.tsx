import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Calendar,
  Clock,
  User,
  FileText,
  Users,
  BookOpen,
  Bell,
  Settings,
  Menu,
  X,
  Phone,
  Video,
  CalendarDays,
  CheckCircle,
  AlertCircle,
  ClockIcon,
  MessageSquare,
  ClipboardCheck,
  BarChart3
} from 'lucide-react';
import Sidebar from '../layouts/EmployeeSidebar';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
// TODO: Re-enable when audit service is available
// import { captureAndLogLocation, logUserActivity } from '@/integrations/auditService';
import TaskManager from '../components/TaskManager';
import TimeTracking from '../components/TimeTracking';
import Directory from '../components/Directory';
import EmailClient from '../components/EmailClient';
import SettingsComponent from '../components/Settings';
import Whistleblower from '../components/Whistleblower';
import Apps from '../components/Apps';
import RulesAndEthics from '../components/RulesAndEthics';
import EmployeeApprovals from '../components/EmployeeApprovals';
import PersonalReports from '../components/PersonalReports';
import Events from '../../admin/pages/Events';
import Notices from '../../admin/pages/Notices';
import { useEmployeeStats } from '@/hooks/useEmployeeStats';
import { Skeleton } from "../../shared/ui/skeleton";
// TODO: Re-enable when EmployeeStatsChart component is available
// import EmployeeStatsChart from '../components/EmployeeStatsChart';
import ActivityAnalytics from '../components/ActivityAnalytics';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userId] = useState('employee-123'); // In a real app, this would come from auth context
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar toggle

  console.log('Rendering EmployeeDashboard', { activeTab, userId });

  // Fetch employee statistics
  const { stats, loading: statsLoading, error: statsError } = useEmployeeStats(userId);

  // Handle tab changes - stay within employee portal
  const handleTabChange = (tab: string) => {
    if (tab === 'mywork') {
      // Employee users should stay within their portal
      setActiveTab('approvals');
    } else {
      setActiveTab(tab);
    }
  };

  // Log user login when component mounts
  // TODO: Re-enable when audit service is available
  // useEffect(() => {
  //   const loginEvent = {
  //     eventType: 'login' as const,
  //     userId,
  //     timestamp: new Date().toISOString(),
  //     page: window.location.pathname
  //   };

  //   logUserActivity(loginEvent);

  //   // Log page view
  //   const pageViewEvent = {
  //     eventType: 'page_view' as const,
  //     userId,
  //     timestamp: new Date().toISOString(),
  //     page: window.location.pathname
  //   };

  //   logUserActivity(pageViewEvent);

  //   // Cleanup function to log logout when component unmounts
  //   return () => {
  //     const logoutEvent = {
  //       eventType: 'logout' as const,
  //       userId,
  //       timestamp: new Date().toISOString()
  //     };

  //     logUserActivity(logoutEvent);
  //   };
  // }, [userId]);

  // Mock data for dashboard
  const kpiData = {
    unreadMessages: 5,
    upcomingTasks: 3,
    teamAnnouncements: 2,
    pendingApprovals: 1,
    isClockedIn: false,
    lastClockIn: ''
  };

  // Mock activity records data
  const activityRecords = [
    { id: '1', date: '2025-09-01', type: 'email_sent' as const, count: 15, details: 'Weekly email summary' },
    { id: '2', date: '2025-09-01', type: 'email_received' as const, count: 23, details: 'Daily email intake' },
    { id: '3', date: '2025-09-01', type: 'task_completed' as const, count: 42, details: 'Team communication' },
    { id: '4', date: '2025-09-01', type: 'task_completed' as const, count: 3, details: 'Project milestones' },
    { id: '5', date: '2025-09-02', type: 'meeting_attended' as const, count: 2, details: 'Team sync and client call' },
    { id: '6', date: '2025-09-03', type: 'email_sent' as const, count: 18, details: 'Project updates' },
    { id: '7', date: '2025-09-03', type: 'email_received' as const, count: 31, details: 'Client communications' },
    { id: '8', date: '2025-09-03', type: 'task_completed' as const, count: 28, details: 'Support requests' },
    { id: '9', date: '2025-09-04', type: 'task_completed' as const, count: 2, details: 'Bug fixes' },
    { id: '10', date: '2025-09-04', type: 'meeting_attended' as const, count: 1, details: 'Sprint planning' },
    { id: '11', date: '2025-09-05', type: 'email_sent' as const, count: 12, details: 'Status reports' },
    { id: '12', date: '2025-09-05', type: 'email_received' as const, count: 19, details: 'Internal communications' },
    { id: '13', date: '2025-09-05', type: 'task_completed' as const, count: 35, details: 'Team collaboration' },
    { id: '14', date: '2025-09-05', type: 'absent' as const, count: 1, details: 'Annual leave' },
    { id: '15', date: '2025-09-06', type: 'email_sent' as const, count: 8, details: 'Weekend summary' },
    { id: '16', date: '2025-09-06', type: 'email_received' as const, count: 14, details: 'Weekend messages' },
    { id: '17', date: '2025-09-06', type: 'task_completed' as const, count: 12, details: 'Weekend support' },
  ];

  const handleClockInOut = async () => {
    // In a real implementation, this would capture geolocation and send to backend
    console.log('Clock in/out clicked');

    // Determine if we're clocking in or out based on current state
    // In a real app, this would be determined by checking the backend
    const isClockedIn = false; // Mock state

    // TODO: Re-enable when audit service is available
    // try {
    //   await captureAndLogLocation(userId, isClockedIn ? 'clock_out' : 'clock_in');

    //   // Update local state
    //   // setKpiData(prev => ({ ...prev, isClockedIn: !isClockedIn }));
    // } catch (error) {
    //   console.error('Error during clock in/out:', error);
    // }
  };

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 p-8 shadow-xl border border-blue-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 drop-shadow-sm">Welcome back!</h1>
            <p className="text-sm text-blue-700 mt-2">Here's what's happening with your work today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClockInOut}
              className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg backdrop-blur-sm ${
                kpiData.isClockedIn 
                  ? 'bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-300/50' 
                  : 'bg-white hover:bg-gray-50 text-blue-700 ring-2 ring-blue-200/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                {kpiData.isClockedIn ? 'Clock Out' : 'Clock In'}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Error */}
      {statsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">Error loading statistics: {statsError}</p>
        </div>
      )}

      {/* Key Metrics - Enhanced with Vibrant Gradients */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Pending Tasks - Pastel Blue */}
          <Card
            className="border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden relative rounded-xl"
            onClick={() => setActiveTab('tasks')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-sky-50"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Pending</p>
                <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors border border-blue-200">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-blue-900 drop-shadow-sm">{stats.pendingTasks}</h3>
              <p className="text-sm text-blue-700 mt-2 font-medium">Tasks to complete</p>
            </CardContent>
          </Card>

          {/* Pending Emails - Pastel Sky */}
          <Card
            className="border border-sky-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden relative rounded-xl"
            onClick={() => setActiveTab('mail')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-cyan-50"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-100/30 rounded-full blur-2xl"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider">Inbox</p>
                <div className="p-2 bg-sky-100 rounded-xl group-hover:bg-sky-200 transition-colors border border-sky-200">
                  <Mail className="w-5 h-5 text-sky-600" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-sky-900 drop-shadow-sm">{stats.pendingEmails}</h3>
              <p className="text-sm text-sky-700 mt-2 font-medium">Unread messages</p>
            </CardContent>
          </Card>

          {/* Leave Balance - Pastel Indigo */}
          <Card
            className="border border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden relative rounded-xl"
            onClick={() => setActiveTab('time')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/30 rounded-full blur-2xl"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Leave</p>
                <div className="p-2 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors border border-indigo-200">
                  <CalendarDays className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-indigo-900 drop-shadow-sm">{stats.leaveDays}</h3>
              <p className="text-sm text-indigo-700 mt-2 font-medium">Days available</p>
            </CardContent>
          </Card>

          {/* Completed Tasks - Pastel Cyan */}
          <Card
            className="border border-cyan-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden relative rounded-xl"
            onClick={() => setActiveTab('tasks')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-100/30 rounded-full blur-2xl"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-cyan-700 uppercase tracking-wider">Completed</p>
                <div className="p-2 bg-cyan-100 rounded-xl group-hover:bg-cyan-200 transition-colors border border-cyan-200">
                  <CheckCircle className="w-5 h-5 text-cyan-600" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-cyan-900 drop-shadow-sm">{stats.completedTasks}</h3>
              <p className="text-sm text-cyan-700 mt-2 font-medium">This month</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Main Content Grid */}
      <div className="space-y-6">
        {/* Quick Access Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {/* Email - Pastel Blue */}
            <Card
              className="border border-blue-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden relative rounded-xl"
              onClick={() => setActiveTab('mail')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-sky-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-sky-100 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 border border-blue-200">
                    <Mail className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-900 transition-colors">Email</h3>
                    <p className="text-xs text-gray-600 group-hover:text-blue-700 mt-1 transition-colors font-medium">{stats?.pendingEmails || 0} unread</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks - Pastel Sky */}
            <Card
              className="border border-sky-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden relative rounded-xl"
              onClick={() => setActiveTab('tasks')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 border border-sky-200">
                    <ClipboardCheck className="w-7 h-7 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-sky-900 transition-colors">Tasks</h3>
                    <p className="text-xs text-gray-600 group-hover:text-sky-700 mt-1 transition-colors font-medium">{stats?.pendingTasks || 0} pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Tracking - Pastel Indigo */}
            <Card
              className="border border-indigo-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden relative rounded-xl"
              onClick={() => setActiveTab('time')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 border border-indigo-200">
                    <Clock className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-900 transition-colors">Time</h3>
                    <p className="text-xs text-gray-600 group-hover:text-indigo-700 mt-1 transition-colors font-medium">{kpiData.isClockedIn ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Announcements - Pastel Cyan */}
            <Card
              className="border border-cyan-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden relative rounded-xl"
              onClick={() => setActiveTab('announcements')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 border border-cyan-200">
                    <Bell className="w-7 h-7 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-cyan-900 transition-colors">Notices</h3>
                    <p className="text-xs text-gray-600 group-hover:text-cyan-700 mt-1 transition-colors font-medium">{stats?.announcements || 0} new</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events - Pastel Blue */}
            <Card
              className="border border-blue-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden relative rounded-xl"
              onClick={() => setActiveTab('events')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 border border-blue-200">
                    <Calendar className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-900 transition-colors">Events</h3>
                    <p className="text-xs text-gray-600 group-hover:text-blue-700 mt-1 transition-colors font-medium">View calendar</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Directory - Pastel Sky */}
            <Card
              className="border border-sky-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden relative rounded-xl"
              onClick={() => setActiveTab('directory')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-cyan-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 border border-sky-200">
                    <Users className="w-7 h-7 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-sky-900 transition-colors">Directory</h3>
                    <p className="text-xs text-gray-600 group-hover:text-sky-700 mt-1 transition-colors font-medium">Find people</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Analytics - Full Width Below */}
        <div>
          <ActivityAnalytics activityRecords={activityRecords} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg text-gray-600"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar - desktop version */}
      <div className="hidden md:block w-64 h-screen bg-white fixed left-0 top-0 shadow-xl z-30">
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>

      {/* Sidebar - mobile version */}
      {
        sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
            <div className="w-64 h-screen bg-white fixed left-0 top-0 shadow-2xl">
              <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
                handleTabChange(tab);
                setSidebarOpen(false); // Close sidebar when tab is selected on mobile
              }} />
            </div>
          </div>
        )
      }

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden md:ml-64 max-w-full overflow-x-hidden">
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto max-w-full overflow-x-hidden">
          {activeTab === 'dashboard' && renderDashboardContent()}
          {activeTab === 'mail' && <EmailClient />}
          {activeTab === 'tasks' && <TaskManager />}
          {activeTab === 'approvals' && <EmployeeApprovals />}
          {activeTab === 'announcements' && <Notices />}
          {activeTab === 'events' && <Events standalone={false} />}
          {activeTab === 'time' && <TimeTracking />}
          {activeTab === 'directory' && <Directory />}
          {activeTab === 'reports' && <PersonalReports />}
          {activeTab === 'rules' && <RulesAndEthics />}
          {activeTab === 'whistleblower' && <Whistleblower />}
          {activeTab === 'settings' && <SettingsComponent />}
          {activeTab === 'apps' && <Apps />}
        </div>
      </div>
    </div >
  );
};

export default EmployeeDashboard;
