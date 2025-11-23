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
  Shield,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import ManagerSidebar from '../layouts/ManagerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import TaskManager from '../../employee/components/TaskManager';
import TimeTracking from '../../employee/components/TimeTracking';
import Directory from '../../employee/components/Directory';
import EmailClient from '../../employee/components/EmailClient';
import SettingsComponent from '../../employee/components/Settings';
import Whistleblower from '../../employee/components/Whistleblower';
import Apps from '../../employee/components/Apps';
import RulesAndEthics from '../../employee/components/RulesAndEthics';
import ManagerApprovals from '../components/ManagerApprovals';
import TeamManagement from '../components/TeamManagement';
import KPIManagement from '../components/KPIManagement';
import ManagerReports from '../components/ManagerReports';
import Events from '../../admin/pages/Events';
import { useEmployeeStats } from '@/hooks/useEmployeeStats';
import { Skeleton } from "../../shared/ui/skeleton";
import ActivityAnalytics from '../../employee/components/ActivityAnalytics';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userId] = useState('manager-123'); // In a real app, this would come from auth context
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar toggle

  // Handle tab changes - stay within manager portal
  const handleTabChange = (tab: string) => {
    if (tab === 'mywork') {
      // Manager users should stay within their portal
      setActiveTab('approvals');
    } else {
      setActiveTab(tab);
    }
  };

  // Fetch employee statistics
  const { stats, loading: statsLoading, error: statsError } = useEmployeeStats(userId);

  // Log user login when component mounts
  // TODO: Re-enable when audit service is available
  // useEffect(() => {
  //   const loginEvent = {
  //     eventType: 'login' as const,
  //     userId,
  //     timestamp: new Date().toISOString(),
  //     page: window.location.pathname
  //   };
  //   
  //   logUserActivity(loginEvent);
  //   
  //   // Log page view
  //   const pageViewEvent = {
  //     eventType: 'page_view' as const,
  //     userId,
  //     timestamp: new Date().toISOString(),
  //     page: window.location.pathname
  //   };
  //   
  //   logUserActivity(pageViewEvent);
  //   
  //   // Cleanup function to log logout when component unmounts
  //   return () => {
  //     const logoutEvent = {
  //       eventType: 'logout' as const,
  //       userId,
  //       timestamp: new Date().toISOString()
  //     };
  //     
  //     logUserActivity(logoutEvent);
  //   };
  // }, [userId]);

  // Mock data for dashboard
  const kpiData = {
    unreadMessages: 5,
    upcomingTasks: 3,
    teamAnnouncements: 2,
    isClockedIn: false,
    lastClockIn: ''
  };

  // Mock activity records data - manager specific
  const activityRecords = [
    { id: '1', date: '2025-09-01', type: 'email_sent' as const, count: 15, details: 'Weekly team email summary' },
    { id: '2', date: '2025-09-01', type: 'email_received' as const, count: 23, details: 'Team email intake' },
    { id: '3', date: '2025-09-01', type: 'task_completed' as const, count: 42, details: 'Team communication' },
    { id: '4', date: '2025-09-01', type: 'task_completed' as const, count: 3, details: 'Team project milestones' },
    { id: '5', date: '2025-09-02', type: 'meeting_attended' as const, count: 2, details: 'Team sync and client call' },
    { id: '6', date: '2025-09-03', type: 'email_sent' as const, count: 18, details: 'Team project updates' },
    { id: '7', date: '2025-09-03', type: 'email_received' as const, count: 31, details: 'Client communications' },
    { id: '8', date: '2025-09-03', type: 'task_completed' as const, count: 28, details: 'Team support requests' },
    { id: '9', date: '2025-09-04', type: 'task_completed' as const, count: 2, details: 'Team bug fixes' },
    { id: '10', date: '2025-09-04', type: 'meeting_attended' as const, count: 1, details: 'Sprint planning' },
    { id: '11', date: '2025-09-05', type: 'email_sent' as const, count: 12, details: 'Team status reports' },
    { id: '12', date: '2025-09-05', type: 'email_received' as const, count: 19, details: 'Internal communications' },
    { id: '13', date: '2025-09-05', type: 'task_completed' as const, count: 35, details: 'Team collaboration' },
    { id: '14', date: '2025-09-05', type: 'absent' as const, count: 1, details: 'Team leave' },
    { id: '15', date: '2025-09-06', type: 'email_sent' as const, count: 8, details: 'Weekend team summary' },
    { id: '16', date: '2025-09-06', type: 'email_received' as const, count: 14, details: 'Weekend messages' },
    { id: '17', date: '2025-09-06', type: 'task_completed' as const, count: 12, details: 'Weekend support' },
  ];

  const handleClockInOut = async () => {
    // In a real implementation, this would capture geolocation and send to backend
    console.log('Clock in/out clicked');
    
    // TODO: Re-enable when audit service is available
    // Determine if we're clocking in or out based on current state
    // In a real app, this would be determined by checking the backend
    // const isClockedIn = false; // Mock state
    
    // try {
    //   await captureAndLogLocation(userId, isClockedIn ? 'clock_out' : 'clock_in');
    //   
    //   // Update local state
    //   // setKpiData(prev => ({ ...prev, isClockedIn: !isClockedIn }));
    // } catch (error) {
    //   console.error('Error during clock in/out:', error);
    // }
  };

  const renderDashboardContent = () => (
    <div className="flex-1 p-4 sm:p-6 bg-blue-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Manager Dashboard</h1>

        </div>
        
        {/* Manager Statistics KPIs */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-700 mb-4">Team Activity Statistics</h2>
          {statsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">Error loading statistics: {statsError}</p>
            </div>
          )}
          
          {statsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <Card key={i} className="shadow-lg border-0">
                  <CardContent className="p-3 sm:p-4">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Team Pending Emails */}
              <Card 
                className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl"
                onClick={() => setActiveTab('mail')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1">Team Emails</div>
                      <div className="text-2xl font-semibold text-blue-900">{stats.pendingEmails * 5}</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Team Announcements */}
              <Card 
                className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl"
                onClick={() => setActiveTab('announcements')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1">Team Announcements</div>
                      <div className="text-2xl font-semibold text-blue-900">{stats.announcements * 3}</div>
                    </div>
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Bell className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Team Leave Days */}
              <Card 
                className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl"
                onClick={() => setActiveTab('settings')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1">Team Leave Days</div>
                      <div className="text-2xl font-semibold text-blue-900">{stats.leaveDays * 4}</div>
                    </div>
                    <div className="p-2 bg-sky-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-sky-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Team Late Resumption Days */}
              <Card 
                className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl"
                onClick={() => setActiveTab('time')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1">Team Late Days</div>
                      <div className="text-2xl font-semibold text-blue-900">{stats.lateResumptionDays * 2}</div>
                    </div>
                    <div className="p-2 bg-cyan-50 rounded-lg">
                      <ClockIcon className="w-5 h-5 text-cyan-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Team Pending Tasks */}
              <Card 
                className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl"
                onClick={() => setActiveTab('tasks')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1">Team Pending Tasks</div>
                      <div className="text-2xl font-semibold text-blue-900">{stats.pendingTasks * 3}</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CalendarDays className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Team Completed Tasks */}
              <Card 
                className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl"
                onClick={() => setActiveTab('tasks')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1">Team Completed Tasks</div>
                      <div className="text-2xl font-semibold text-blue-900">{stats.completedTasks * 4}</div>
                    </div>
                    <div className="p-2 bg-sky-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-sky-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Team Upcoming Meetings */}
              <Card 
                className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl"
                onClick={() => setActiveTab('tasks')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1">Team Meetings</div>
                      <div className="text-2xl font-semibold text-blue-900">{stats.upcomingMeetings * 2}</div>
                    </div>
                    <div className="p-2 bg-cyan-50 rounded-lg">
                      <Video className="w-5 h-5 text-cyan-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Team Missed Calls */}
              <Card 
                className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl"
                onClick={() => setActiveTab('chat')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1">Team Missed Calls</div>
                      <div className="text-2xl font-semibold text-blue-900">{stats.missedCalls * 2}</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Time Tracking */}
              <Card className="border border-blue-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1">Time Tracking</div>
                      <div className="text-base font-semibold text-blue-900">
                        {kpiData.isClockedIn ? 'Clocked In' : 'Clocked Out'}
                      </div>
                      {kpiData.lastClockIn && (
                        <div className="text-xs text-blue-500 mt-1">
                          Since {kpiData.lastClockIn}
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-sky-50 rounded-lg">
                      <Clock className="w-5 h-5 text-sky-600" />
                    </div>
                  </div>
                  <button 
                    onClick={handleClockInOut}
                    className={`w-full py-2 rounded-lg text-xs font-medium shadow-sm transition-colors ${
                      kpiData.isClockedIn 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    {kpiData.isClockedIn ? 'Clock Out' : 'Clock In'}
                  </button>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-blue-900 mb-4 mt-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Email */}
          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                Email
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-blue-600 mb-4">Access your corporate email client</p>
              <button 
                onClick={() => setActiveTab('mail')}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-colors w-full"
              >
                Open Email
              </button>
            </CardContent>
          </Card>
          
          {/* Tasks */}
          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <div className="p-2 bg-sky-50 rounded-lg group-hover:bg-sky-100 transition-colors">
                  <Calendar className="w-4 h-4 text-sky-600" />
                </div>
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-blue-600 mb-4">Manage your personal and team tasks</p>
              <button 
                onClick={() => setActiveTab('tasks')}
                className="bg-sky-600 text-white hover:bg-sky-700 px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-colors w-full"
              >
                View Tasks
              </button>
            </CardContent>
          </Card>
          
          {/* Team Directory */}
          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                  <Users className="w-4 h-4 text-amber-600" />
                </div>
                Team Directory
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-4">View and manage your team members</p>
              <button 
                onClick={() => setActiveTab('directory')}
                className="bg-amber-600 text-white hover:bg-amber-700 px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-colors w-full"
              >
                View Team
              </button>
            </CardContent>
          </Card>
          
          {/* Team Approvals */}
          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <Shield className="w-4 h-4 text-purple-600" />
                </div>
                Team Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-4">Manage team approval requests</p>
              <button 
                onClick={() => setActiveTab('approvals')}
                className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-colors w-full"
              >
                View Approvals
              </button>
            </CardContent>
          </Card>
          
          {/* Time Tracking */}
          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                  <Clock className="w-4 h-4 text-teal-600" />
                </div>
                Time Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-4">Track your work hours and attendance</p>
              <button 
                onClick={() => setActiveTab('time')}
                className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-colors w-full"
              >
                Track Time
              </button>
            </CardContent>
          </Card>
          
          {/* Team Management */}
          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                Team Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-4">Manage team members and performance</p>
              <button 
                onClick={() => setActiveTab('team')}
                className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-colors w-full"
              >
                Manage Team
              </button>
            </CardContent>
          </Card>
          
          {/* KPI Management */}
          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                  <FileText className="w-4 h-4 text-indigo-600" />
                </div>
                KPI Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-4">Monitor and manage team KPIs</p>
              <button 
                onClick={() => setActiveTab('kpis')}
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-colors w-full"
              >
                View KPIs
              </button>
            </CardContent>
          </Card>
          
          {/* Reports */}
          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <div className="p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
                  <BarChart3 className="w-4 h-4 text-rose-600" />
                </div>
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-4">Generate and view team reports</p>
              <button 
                onClick={() => setActiveTab('reports')}
                className="bg-rose-600 text-white hover:bg-rose-700 px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-colors w-full"
              >
                View Reports
              </button>
            </CardContent>
          </Card>
          
          {/* Chat (non-interactive) */}
          <Card className="border border-gray-200 shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-cyan-50 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-cyan-600" />
                </div>
                Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-4">Chat is always available in the bottom right corner</p>
              <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-xs font-medium text-center">
                Always Available
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Analytics */}
        <div className="mt-6">
          <ActivityAnalytics activityRecords={activityRecords} />
        </div>
        
        {/* Employee Statistics Charts */}
        {/* TODO: Re-enable when EmployeeStatsChart component is available */}
        {/* {!statsLoading && stats && (
          <EmployeeStatsChart stats={stats} />
        )} */}
      </div>
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
        <ManagerSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>
      
      {/* Sidebar - mobile version */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="w-64 h-screen bg-white fixed left-0 top-0 shadow-2xl">
            <ManagerSidebar activeTab={activeTab} setActiveTab={(tab) => {
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
          {activeTab === 'mail' && <EmailClient />}
          {activeTab === 'tasks' && <TaskManager />}
          {activeTab === 'events' && <Events standalone={false} />}
          {activeTab === 'time' && <TimeTracking />}
          {activeTab === 'directory' && <Directory />}
          {activeTab === 'rules' && <RulesAndEthics />}
          {activeTab === 'whistleblower' && <Whistleblower />}
          {activeTab === 'settings' && <SettingsComponent />}
          {activeTab === 'apps' && <Apps />}
          {activeTab === 'approvals' && <ManagerApprovals />}
          {activeTab === 'team' && <TeamManagement />}
          {activeTab === 'kpis' && <KPIManagement />}
          {activeTab === 'reports' && <ManagerReports />}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
