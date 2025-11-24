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
  Shield,
  ClipboardCheck,
  Clock
} from 'lucide-react';
import { Button } from "../../shared/ui/button";
import ActivityFeed from '../../shared/components/ActivityFeed';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Check if user is already logged in as admin
    // This is now handled by ProtectedRoute, but keeping for double safety or specific logic
    // Actually, ProtectedRoute handles this, so we might not need this check here if we trust it.
    // But keeping it doesn't hurt.
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  }, [navigate]);

  const renderDashboardContent = () => (
    <div className="mb-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pastel-blue-100 to-pastel-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 mb-8 shadow-sm border border-blue-200 dark:border-slate-600">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-slate-100 mb-2">Welcome back!</h1>
            <p className="text-blue-700 dark:text-slate-300">Here's what's happening with your organization today.</p>
          </div>
          <Button
            className="bg-white dark:bg-slate-800 text-blue-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl px-6 py-6 shadow-sm font-medium transition-all flex items-center gap-2"
          >
            <Clock className="w-5 h-5" />
            Clock In
          </Button>
        </div>
      </div>

      {/* Dashboard Stats - MVP Version */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
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
          onClick={() => navigate('/safety')}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-indigo-700 dark:text-slate-400">AI Monitoring</p>
                <h3 className="text-3xl font-semibold text-indigo-900 dark:text-slate-100 mt-2">Active</h3>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-purple-500/10 rounded-xl border border-indigo-200">
                <Brain className="w-6 h-6 text-indigo-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Overview - MVP */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-slate-100 mb-4 sm:mb-6">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card
            className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-pastel-blue-100 to-pastel-blue-50"
            onClick={() => navigate('/admin/approvals')}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-blue-900 flex items-center gap-3">
                <div className="p-2.5 bg-pastel-blue-200 rounded-xl group-hover:bg-pastel-blue-300 transition-colors border border-blue-200">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                </div>
                Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-blue-700 mb-4 leading-relaxed">Review system-level approval requests</p>
              <div className="flex items-center justify-between text-xs text-blue-600 mb-3">
                <span>Pending Requests</span>
                <span className="font-semibold text-blue-700">3</span>
              </div>
              <Button
                onClick={(e) => { e.stopPropagation(); navigate('/admin/approvals'); }}
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-sm font-medium shadow-sm w-full h-10"
              >
                Review
              </Button>
            </CardContent>
          </Card>

          <Card
            className="border border-sky-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-sky-50 to-cyan-50"
            onClick={() => navigate('/employees')}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-sky-900 flex items-center gap-3">
                <div className="p-2.5 bg-sky-100 rounded-xl group-hover:bg-sky-200 transition-colors border border-sky-200">
                  <Users className="w-5 h-5 text-sky-600" />
                </div>
                Employees
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-sky-700 mb-4 leading-relaxed">Manage employee profiles and departments</p>
              <div className="flex items-center justify-between text-xs text-sky-600 mb-3">
                <span>Total Employees</span>
                <span className="font-semibold text-sky-700">142</span>
              </div>
              <Button
                onClick={(e) => { e.stopPropagation(); navigate('/employees'); }}
                className="bg-sky-600 text-white hover:bg-sky-700 rounded-xl text-sm font-medium shadow-sm w-full h-10"
              >
                Manage
              </Button>
            </CardContent>
          </Card>

          <Card
            className="border border-indigo-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl group bg-gradient-to-br from-indigo-50 to-purple-50"
            onClick={() => navigate('/safety')}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-indigo-900 flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors border border-indigo-200">
                  <Brain className="w-5 h-5 text-indigo-600" />
                </div>
                AI Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-indigo-700 mb-4 leading-relaxed">AI-powered monitoring and risk assessment</p>
              <div className="flex items-center justify-between text-xs text-indigo-600 mb-3">
                <span>Status</span>
                <span className="font-semibold text-indigo-700">Active</span>
              </div>
              <Button
                onClick={(e) => { e.stopPropagation(); navigate('/safety'); }}
                className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-sm font-medium shadow-sm w-full h-10"
              >
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Communication - MVP */}
      <h2 className="text-lg font-semibold text-blue-900 dark:text-slate-100 mb-4">Communication</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
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
            <p className="text-xs text-blue-700 mb-4">Manage company-wide communications</p>
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
          onClick={() => navigate('/employees?tab=pending')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-sky-900 flex items-center gap-2">
              <div className="p-2 bg-sky-100 rounded-lg group-hover:bg-sky-200 transition-colors border border-sky-200">
                <UserPlus className="w-4 h-4 text-sky-600" />
              </div>
              Employee Onboarding
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-sky-700 mb-4">Approve new employee registrations</p>
            <Button
              onClick={(e) => { e.stopPropagation(); navigate('/employees?tab=pending'); }}
              className="bg-sky-600 text-white hover:bg-sky-700 rounded-lg text-xs font-medium shadow-sm w-full"
              size="sm"
            >
              View Registrations
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed - NEW */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-slate-100 mb-4">Recent Activity</h2>
        <ActivityFeed maxItems={8} showTitle={false} />
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
