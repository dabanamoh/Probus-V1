import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
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
  BarChart3,
  MessageCircle
} from 'lucide-react';
import ManagerSidebar from '../layouts/ManagerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import TaskManager from '../../employee/components/TaskManager';
import Directory from '../../employee/components/Directory';
import LeaveManagement from '../../employee/components/LeaveManagement';
import SettingsComponent from '../../employee/components/Settings';
import Whistleblower from '../../employee/components/Whistleblower';
import Apps from '../../employee/components/Apps';
import RulesAndEthics from '../../employee/components/RulesAndEthics';
import NotificationCenter from '../../shared/components/NotificationCenter';
import NotificationsPage from '../../employee/components/NotificationsPage';
import ChatInterface from '../../shared/components/chat/ChatInterface';
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
  const [selectedChatEmployee, setSelectedChatEmployee] = useState<{id: string, name: string, callType?: 'voice' | 'video'} | null>(null);

  // Handle tab changes - stay within manager portal
  const handleTabChange = (tab: string) => {
    if (tab === 'mywork') {
      // Manager users should stay within their portal
      setActiveTab('approvals');
    } else {
      setActiveTab(tab);
    }
  };

  // Handle opening chat with a specific employee
  const handleOpenChat = (employeeId: string, employeeName: string, callType?: 'voice' | 'video') => {
    setSelectedChatEmployee({ id: employeeId, name: employeeName, callType });
    setActiveTab('messages');
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
    { id: '3', date: '2025-09-01', type: 'task_completed' as const, count: 42, details: 'Team communication' },
    { id: '4', date: '2025-09-01', type: 'task_completed' as const, count: 3, details: 'Team project milestones' },
    { id: '5', date: '2025-09-02', type: 'meeting_attended' as const, count: 2, details: 'Team sync and client call' },
    { id: '8', date: '2025-09-03', type: 'task_completed' as const, count: 28, details: 'Team support requests' },
    { id: '9', date: '2025-09-04', type: 'task_completed' as const, count: 2, details: 'Team bug fixes' },
    { id: '10', date: '2025-09-04', type: 'meeting_attended' as const, count: 1, details: 'Sprint planning' },
    { id: '13', date: '2025-09-05', type: 'task_completed' as const, count: 35, details: 'Team collaboration' },
    { id: '14', date: '2025-09-05', type: 'absent' as const, count: 1, details: 'Team leave' },
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
        {/* Header Section */}
        <div className="bg-gradient-to-r from-pastel-blue-100 to-pastel-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 mb-8 shadow-sm border border-blue-200 dark:border-slate-600">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 dark:text-slate-100 mb-2">Welcome back!</h1>
              <p className="text-blue-700 dark:text-slate-300">Here's what's happening with your team today.</p>
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
        
        {/* Manager Statistics KPIs */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-700 mb-4">Team Activity Statistics</h2>
          {statsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">Error loading statistics: {statsError}</p>
            </div>
          )}
          
          {statsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="shadow-lg border-0">
                  <CardContent className="p-3 sm:p-4">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Team Members */}
              <Card 
                className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl"
                onClick={() => setActiveTab('team')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1">Team Members</div>
                      <div className="text-2xl font-semibold text-blue-900">{stats.completedTasks || 12}</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Pending Approvals */}
              <Card 
                className="border border-sky-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl"
                onClick={() => setActiveTab('approvals')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-sky-600 mb-1">Pending Approvals</div>
                      <div className="text-2xl font-semibold text-sky-900">{stats.pendingTasks || 8}</div>
                    </div>
                    <div className="p-2 bg-sky-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-sky-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Safety Reports */}
              <Card 
                className="border border-indigo-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl"
                onClick={() => setActiveTab('whistleblower')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-indigo-600 mb-1">Safety Reports</div>
                      <div className="text-2xl font-semibold text-indigo-900">{stats.announcements || 2}</div>
                    </div>
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Shield className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>

        {/* Quick Actions - MVP */}
        <h2 className="text-lg font-semibold text-blue-900 mb-4 mt-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Team Management */}
          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                Team Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-blue-600 mb-4">Manage team members and assignments</p>
              <button 
                onClick={() => setActiveTab('team')}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-colors w-full"
              >
                Manage Team
              </button>
            </CardContent>
          </Card>
          
          {/* Team Approvals */}
          <Card className="border border-sky-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-sky-900 flex items-center gap-2">
                <div className="p-2 bg-sky-50 rounded-lg group-hover:bg-sky-100 transition-colors">
                  <CheckCircle className="w-4 h-4 text-sky-600" />
                </div>
                Team Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-sky-600 mb-4">Review and approve team requests</p>
              <button 
                onClick={() => setActiveTab('approvals')}
                className="bg-sky-600 text-white hover:bg-sky-700 px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-colors w-full"
              >
                View Approvals
              </button>
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
          {activeTab === 'approvals' && <ManagerApprovals />}
          {activeTab === 'tasks' && <TaskManager />}
          {activeTab === 'leave' && <LeaveManagement />}
          {activeTab === 'messages' && (
            <ChatInterface 
              userId={userId} 
              userName="Manager" 
              selectedEmployee={selectedChatEmployee}
            />
          )}
          {activeTab === 'notifications' && <NotificationsPage />}
          {activeTab === 'directory' && <Directory onOpenChat={handleOpenChat} />}
          {activeTab === 'team' && <TeamManagement onOpenChat={handleOpenChat} />}
          {activeTab === 'whistleblower' && <Whistleblower />}
          {activeTab === 'settings' && <SettingsComponent />}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
