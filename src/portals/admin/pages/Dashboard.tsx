import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import {
  Building2,
  Users,
  FileText,
  Award,
  TrendingUp,
  LogOut,
  UserPlus,
  MessageSquare,
  Bell,
  PartyPopper,
  MessageCircle,
  Brain,
  Command,
  Inbox,
  Shield
} from 'lucide-react';
import { Button } from "../../shared/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSetupBanner, setShowSetupBanner] = useState(false);

  useEffect(() => {
    // Check if user is already logged in as admin
    // This is now handled by ProtectedRoute, but keeping for double safety or specific logic
    // Actually, ProtectedRoute handles this, so we might not need this check here if we trust it.
    // But keeping it doesn't hurt.
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    
    // Check if setup is complete
    const setupComplete = localStorage.getItem('setupComplete') === 'true';
    if (!setupComplete) {
      setShowSetupBanner(true);
    }

    // if (!isAdminLoggedIn) {
    //   navigate('/login');
    // }
  }, [navigate]);

  const renderDashboardContent = () => (
    <div className="mb-6">
      {/* Setup Banner */}
      {showSetupBanner && (
        <div className="bg-blue-600 text-white rounded-xl p-6 mb-6 shadow-sm border border-blue-700">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white bg-opacity-10 rounded-lg">
                <PartyPopper className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Welcome to Probus! 🎉</h3>
                <p className="text-blue-100 mb-3">Get started in minutes with our Quick Setup Wizard</p>
                <Button
                  onClick={() => navigate('/setup')}
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-sm"
                >
                  <PartyPopper className="w-4 h-4 mr-2" />
                  Start Quick Setup
                </Button>
              </div>
            </div>
            <button
              onClick={() => setShowSetupBanner(false)}
              className="text-white hover:text-blue-100 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-blue-900 dark:text-slate-100">Admin Dashboard</h1>
          <p className="text-sm text-blue-700 dark:text-slate-400 mt-1">Manage your organization</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-slate-300 bg-blue-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-blue-200 dark:border-slate-700">
          <Command className="w-4 h-4" />
          <span className="hidden sm:inline">Press</span>
          <kbd className="px-2 py-1 bg-white dark:bg-slate-700 border border-blue-300 dark:border-slate-600 rounded-md text-xs font-semibold shadow-sm text-blue-700 dark:text-slate-200">Ctrl+K</kbd>
          <span className="hidden sm:inline">for quick actions</span>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card
          className="border border-blue-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl bg-gradient-to-br from-blue-50 to-sky-50 dark:bg-slate-800"
          onClick={() => navigate('/departments')}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-700 dark:text-slate-400">Departments</p>
                <h3 className="text-3xl font-semibold text-blue-900 dark:text-slate-100 mt-2">12</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl border border-blue-200">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border border-sky-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 dark:bg-slate-800"
          onClick={() => navigate('/employees')}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-sky-700 dark:text-slate-400">Employees</p>
                <h3 className="text-3xl font-semibold text-sky-900 dark:text-slate-100 mt-2">142</h3>
              </div>
              <div className="p-3 bg-sky-100 dark:bg-green-500/10 rounded-xl border border-sky-200">
                <Users className="w-6 h-6 text-sky-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border border-indigo-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:bg-slate-800"
          onClick={() => navigate('/kpis')}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-indigo-700 dark:text-slate-400">Performance</p>
                <h3 className="text-3xl font-semibold text-indigo-900 dark:text-slate-100 mt-2">86%</h3>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-purple-500/10 rounded-xl border border-indigo-200">
                <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border border-cyan-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:bg-slate-800"
          onClick={() => navigate('/rewards')}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-cyan-700 dark:text-slate-400">Rewards</p>
                <h3 className="text-3xl font-semibold text-cyan-900 dark:text-slate-100 mt-2">24</h3>
              </div>
              <div className="p-3 bg-cyan-100 dark:bg-amber-500/10 rounded-xl border border-cyan-200">
                <Award className="w-6 h-6 text-cyan-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Overview */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-slate-100 mb-4 sm:mb-6">Management Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card
            className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-blue-50 to-sky-50"
            onClick={() => navigate('/work')}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-blue-900 flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors border border-blue-200">
                  <Inbox className="w-5 h-5 text-blue-600" />
                </div>
                My Work
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-blue-700 mb-4 leading-relaxed">All pending tasks, approvals, and notifications</p>
              <div className="flex items-center justify-between text-xs text-blue-600 mb-3">
                <span>Pending Items</span>
                <span className="font-semibold text-blue-700">8</span>
              </div>
              <Button
                onClick={(e) => { e.stopPropagation(); navigate('/work'); }}
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-sm font-medium shadow-sm w-full h-10"
              >
                View All
              </Button>
            </CardContent>
          </Card>

          <Card
            className="border border-sky-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-sky-50 to-cyan-50"
            onClick={() => navigate('/departments')}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-sky-900 flex items-center gap-3">
                <div className="p-2.5 bg-sky-100 rounded-xl group-hover:bg-sky-200 transition-colors border border-sky-200">
                  <Building2 className="w-5 h-5 text-sky-600" />
                </div>
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-sky-700 mb-4 leading-relaxed">Departments, employees, and structure</p>
              <div className="flex items-center justify-between text-xs text-sky-600 mb-3">
                <span>Total Employees</span>
                <span className="font-semibold text-sky-700">142</span>
              </div>
              <Button
                onClick={(e) => { e.stopPropagation(); navigate('/departments'); }}
                className="bg-sky-600 text-white hover:bg-sky-700 rounded-xl text-sm font-medium shadow-sm w-full h-10"
              >
                Manage
              </Button>
            </CardContent>
          </Card>

          <Card
            className="border border-indigo-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-indigo-50 to-purple-50"
            onClick={() => navigate('/kpis')}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-indigo-900 flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors border border-indigo-200">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-indigo-700 mb-4 leading-relaxed">KPIs, analytics, and reporting</p>
              <div className="flex items-center justify-between text-xs text-indigo-600 mb-3">
                <span>Avg Performance</span>
                <span className="font-semibold text-indigo-700">86%</span>
              </div>
              <Button
                onClick={(e) => { e.stopPropagation(); navigate('/kpis'); }}
                className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-sm font-medium shadow-sm w-full h-10"
              >
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Workflow Management */}
      <h2 className="text-lg font-semibold text-blue-900 dark:text-slate-100 mb-4">Workflow Management</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card
          className="border border-cyan-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-cyan-50 to-blue-50"
          onClick={() => navigate('/employees?tab=pending')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-cyan-900 flex items-center gap-2">
              <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors border border-cyan-200">
                <UserPlus className="w-4 h-4 text-cyan-600" />
              </div>
              Onboarding
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-cyan-700 mb-4">Manage new employee registrations</p>
            <Button
              onClick={(e) => { e.stopPropagation(); navigate('/employees?tab=pending'); }}
              className="bg-cyan-600 text-white hover:bg-cyan-700 rounded-lg text-xs font-medium shadow-sm w-full"
              size="sm"
            >
              View Registrations
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-blue-100 to-indigo-100"
          onClick={() => navigate('/resignations')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors border border-blue-200">
                <LogOut className="w-4 h-4 text-blue-700" />
              </div>
              Offboarding
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-blue-700 mb-4">Handle resignations and terminations</p>
            <Button
              onClick={(e) => { e.stopPropagation(); navigate('/resignations'); }}
              className="bg-blue-700 text-white hover:bg-blue-800 rounded-lg text-xs font-medium shadow-sm w-full"
              size="sm"
            >
              View Requests
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border border-indigo-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-indigo-50 to-purple-50"
          onClick={() => navigate('/safety')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
              <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors border border-indigo-200">
                <Shield className="w-4 h-4 text-indigo-600" />
              </div>
              Safety & AI
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-indigo-700 mb-4">Monitor workplace safety and productivity</p>
            <Button
              onClick={(e) => { e.stopPropagation(); navigate('/safety'); }}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-medium shadow-sm w-full"
              size="sm"
            >
              View Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Communication & Events Section */}
      <h2 className="text-lg font-semibold text-blue-900 dark:text-slate-100 mb-4">Communication & Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card
          className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-blue-50 to-sky-50"
          onClick={() => navigate('/notices')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors border border-blue-200">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              Notices & Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-blue-700 mb-4">Manage company notices and announcements</p>
            <Button
              onClick={(e) => { e.stopPropagation(); navigate('/notices'); }}
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-medium shadow-sm w-full"
              size="sm"
            >
              View Notices
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border border-sky-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-sky-50 to-cyan-50"
          onClick={() => navigate('/events')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-sky-900 flex items-center gap-2">
              <div className="p-2 bg-sky-100 rounded-lg group-hover:bg-sky-200 transition-colors border border-sky-200">
                <PartyPopper className="w-4 h-4 text-sky-600" />
              </div>
              Events & Celebrations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-sky-700 mb-4">Organize company events and celebrations</p>
            <Button
              onClick={(e) => { e.stopPropagation(); navigate('/events'); }}
              className="bg-sky-600 text-white hover:bg-sky-700 rounded-lg text-xs font-medium shadow-sm w-full"
              size="sm"
            >
              Manage Events
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border border-indigo-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-indigo-50 to-purple-50"
          onClick={() => navigate('/feedbacks')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
              <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors border border-indigo-200">
                <MessageCircle className="w-4 h-4 text-indigo-600" />
              </div>
              Feedback & Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-indigo-700 mb-4">Handle employee feedback and requests</p>
            <Button
              onClick={(e) => { e.stopPropagation(); navigate('/feedbacks'); }}
              className="bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-xs font-medium shadow-sm w-full"
              size="sm"
            >
              View Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {activeTab === 'dashboard' && renderDashboardContent()}
    </DashboardLayout>
  );
};

export default Index;
