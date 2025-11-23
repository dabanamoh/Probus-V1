import React, { useState } from 'react';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { useNavigate } from 'react-router-dom';
import { 
  Inbox, 
  CheckCircle, 
  Clock, 
  Calendar, 
  FileText, 
  Bell, 
  CalendarDays,
  Mail,
  AlertCircle,
  XCircle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";

// Mock data - replace with actual API calls
const mockData = {
  approvals: [
    { id: 1, type: 'Leave Request', requester: 'John Doe', date: '2025-11-22', status: 'pending', urgency: 'high' },
    { id: 2, type: 'Resignation', requester: 'Jane Smith', date: '2025-11-20', status: 'pending', urgency: 'medium' },
    { id: 3, type: 'Reward Nomination', requester: 'Mike Johnson', date: '2025-11-19', status: 'pending', urgency: 'low' }
  ],
  leaveRequests: [
    { id: 1, type: 'Annual Leave', startDate: '2025-12-01', endDate: '2025-12-05', status: 'pending', days: 5 },
    { id: 2, type: 'Sick Leave', startDate: '2025-11-25', endDate: '2025-11-26', status: 'approved', days: 2 }
  ],
  resignations: [
    { id: 1, employee: 'Jane Smith', lastDay: '2025-12-15', status: 'manager_pending', submittedAt: '2025-11-20' }
  ],
  notices: [
    { id: 1, title: 'Company Holiday - Thanksgiving', date: '2025-11-25', read: false, priority: 'high' },
    { id: 2, title: 'New HR Policies Updated', date: '2025-11-20', read: false, priority: 'medium' },
    { id: 3, title: 'Team Building Event', date: '2025-11-18', read: true, priority: 'low' }
  ],
  events: [
    { id: 1, title: 'Year-End Party', date: '2025-12-20', time: '6:00 PM', location: 'Main Office' },
    { id: 2, title: 'Department Meeting', date: '2025-11-23', time: '2:00 PM', location: 'Conference Room A' }
  ],
  emails: {
    unread: 12,
    recent: [
      { id: 1, from: 'hr@company.com', subject: 'Benefits Enrollment Open', date: '2025-11-21' },
      { id: 2, from: 'manager@company.com', subject: 'Q4 Review Meeting', date: '2025-11-21' }
    ]
  }
};

const MyWork = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const handleApprove = (approvalId: number) => {
    console.log('Approving request:', approvalId);
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #10b981;z-index:9999;"><p style="margin:0;font-weight:600;color:#065f46;font-size:14px;">✓ Request approved successfully</p></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  const handleReject = (approvalId: number) => {
    console.log('Rejecting request:', approvalId);
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #ef4444;z-index:9999;"><p style="margin:0;font-weight:600;color:#991b1b;font-size:14px;">✗ Request rejected</p></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any, icon: any, label: string }> = {
      pending: { variant: 'outline', icon: Clock, label: 'Pending' },
      approved: { variant: 'default', icon: CheckCircle, label: 'Approved' },
      rejected: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
      manager_pending: { variant: 'outline', icon: AlertCircle, label: 'Manager Review' },
      hr_pending: { variant: 'outline', icon: AlertCircle, label: 'HR Review' }
    };
    
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
      case 'medium': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      case 'low': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
      default: return 'text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-600';
    }
  };

  const totalPending = mockData.approvals.filter(a => a.status === 'pending').length +
                       mockData.leaveRequests.filter(l => l.status === 'pending').length +
                       mockData.notices.filter(n => !n.read).length;

  return (
    <DashboardLayout title="My Work" subtitle="Your unified inbox">
      <div className="flex-1 p-3 sm:p-4 md:p-6 bg-blue-50 dark:bg-slate-900 min-h-screen overflow-x-hidden max-w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl">
                <Inbox className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-slate-100">My Work</h1>
                <p className="text-blue-600 dark:text-slate-400">All your pending tasks and notifications in one place</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-lg px-3 py-1 dark:bg-slate-700 dark:text-slate-200">
                {totalPending} pending
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <Tabs defaultValue="all" className="w-full max-w-full overflow-x-hidden" onValueChange={setActiveFilter}>
          <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
            <TabsList className="inline-grid grid-flow-col auto-cols-fr sm:grid w-full sm:grid-cols-3 md:grid-cols-7 gap-2 mb-6 bg-white/50 dark:bg-slate-800/50 p-2 min-w-max sm:min-w-0">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>All</span>
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Approvals</span>
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Leave</span>
            </TabsTrigger>
            <TabsTrigger value="resignations" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Resignations</span>
            </TabsTrigger>
            <TabsTrigger value="notices" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span>Notices</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
              <span className="sm:hidden">Mail</span>
            </TabsTrigger>
          </TabsList>
          </div>

          <TabsContent value="all" className="space-y-4">
            {/* Approvals Card */}
            <Card className="shadow-lg hover:shadow-xl transition-all dark:bg-slate-800 dark:border-slate-700">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-b dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Pending Approvals
                    <Badge variant="secondary" className="dark:bg-slate-700 dark:text-slate-200">{mockData.approvals.filter(a => a.status === 'pending').length}</Badge>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/approvals')} className="dark:text-slate-300 dark:hover:bg-slate-700">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {mockData.approvals.filter(a => a.status === 'pending').length === 0 ? (
                  <div className="text-center py-8 text-blue-500 dark:text-slate-400">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-blue-300 dark:text-slate-600" />
                    <p>No pending approvals</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockData.approvals.filter(a => a.status === 'pending').slice(0, 3).map((approval) => (
                      <div key={approval.id} className={`p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${getPriorityColor(approval.urgency)} dark:border-slate-600`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold dark:text-slate-100">{approval.type}</h4>
                              <Badge variant="outline" className="text-xs dark:border-slate-600 dark:text-slate-300">{approval.urgency}</Badge>
                            </div>
                            <p className="text-sm text-blue-600 dark:text-slate-300">Requested by: {approval.requester}</p>
                            <p className="text-xs text-blue-500 dark:text-slate-400">Date: {approval.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 dark:border-slate-600"
                              onClick={() => handleApprove(approval.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 dark:border-slate-600"
                              onClick={() => handleReject(approval.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leave Requests Card */}
            <Card className="shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    My Leave Requests
                    <Badge variant="secondary">{mockData.leaveRequests.length}</Badge>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/app')}>
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {mockData.leaveRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No leave requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockData.leaveRequests.slice(0, 3).map((leave) => (
                      <div key={leave.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{leave.type}</h4>
                              {getStatusBadge(leave.status)}
                            </div>
                            <p className="text-sm text-gray-600">{leave.startDate} to {leave.endDate}</p>
                            <p className="text-xs text-gray-500">{leave.days} day{leave.days > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resignations Card */}
            {mockData.resignations.length > 0 && (
              <Card className="shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      Resignations
                      <Badge variant="secondary">{mockData.resignations.length}</Badge>
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/resignations')}>
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {mockData.resignations.map((resignation) => (
                      <div key={resignation.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{resignation.employee}</h4>
                              {getStatusBadge(resignation.status)}
                            </div>
                            <p className="text-sm text-gray-600">Last working day: {resignation.lastDay}</p>
                            <p className="text-xs text-gray-500">Submitted: {resignation.submittedAt}</p>
                          </div>
                          <Button size="sm" onClick={() => navigate('/resignations')}>
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notices Card */}
            <Card className="shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-green-600" />
                    Unread Notices
                    <Badge variant="secondary">{mockData.notices.filter(n => !n.read).length}</Badge>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/notices')}>
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {mockData.notices.filter(n => !n.read).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No unread notices</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockData.notices.filter(n => !n.read).slice(0, 3).map((notice) => (
                      <div key={notice.id} className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${getPriorityColor(notice.priority)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{notice.title}</h4>
                              <Badge variant="outline" className="text-xs">{notice.priority}</Badge>
                            </div>
                            <p className="text-xs text-gray-500">{notice.date}</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => navigate('/notices')}>
                            Read
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Events Card */}
            <Card className="shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-indigo-600" />
                    Upcoming Events
                    <Badge variant="secondary">{mockData.events.length}</Badge>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/events')}>
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {mockData.events.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarDays className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No upcoming events</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockData.events.slice(0, 3).map((event) => (
                      <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold mb-1">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                        <p className="text-xs text-gray-500">{event.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card className="shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-cyan-100 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-cyan-600" />
                    Unread Emails
                    <Badge variant="secondary">{mockData.emails.unread}</Badge>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/email')}>
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {mockData.emails.recent.map((email) => (
                    <div key={email.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold mb-1">{email.subject}</h4>
                      <p className="text-sm text-gray-600">From: {email.from}</p>
                      <p className="text-xs text-gray-500">{email.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-4">
            <Card className="shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    Pending Approvals
                    <Badge variant="secondary">{mockData.approvals.filter(a => a.status === 'pending').length}</Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {mockData.approvals.filter(a => a.status === 'pending').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No pending approvals</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockData.approvals.filter(a => a.status === 'pending').map((approval) => (
                      <div key={approval.id} className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${getPriorityColor(approval.urgency)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{approval.type}</h4>
                              <Badge variant="outline" className="text-xs">{approval.urgency}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">Requested by: {approval.requester}</p>
                            <p className="text-xs text-gray-500">Date: {approval.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleApprove(approval.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleReject(approval.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Tab */}
          <TabsContent value="leave" className="space-y-4">
            <Card className="shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    My Leave Requests
                    <Badge variant="secondary">{mockData.leaveRequests.length}</Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {mockData.leaveRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No leave requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockData.leaveRequests.map((leave) => (
                      <div key={leave.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{leave.type}</h4>
                              {getStatusBadge(leave.status)}
                            </div>
                            <p className="text-sm text-gray-600">{leave.startDate} to {leave.endDate}</p>
                            <p className="text-xs text-gray-500">{leave.days} day{leave.days > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resignations Tab */}
          <TabsContent value="resignations" className="space-y-4">
            {mockData.resignations.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No resignations to review</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      Resignations
                      <Badge variant="secondary">{mockData.resignations.length}</Badge>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {mockData.resignations.map((resignation) => (
                      <div key={resignation.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{resignation.employee}</h4>
                              {getStatusBadge(resignation.status)}
                            </div>
                            <p className="text-sm text-gray-600">Last working day: {resignation.lastDay}</p>
                            <p className="text-xs text-gray-500">Submitted: {resignation.submittedAt}</p>
                          </div>
                          <Button size="sm" onClick={() => navigate('/resignations')}>
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Notices Tab */}
          <TabsContent value="notices" className="space-y-4">
            <Card className="shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-green-600" />
                    Unread Notices
                    <Badge variant="secondary">{mockData.notices.filter(n => !n.read).length}</Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {mockData.notices.filter(n => !n.read).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No unread notices</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockData.notices.filter(n => !n.read).map((notice) => (
                      <div key={notice.id} className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${getPriorityColor(notice.priority)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{notice.title}</h4>
                              <Badge variant="outline" className="text-xs">{notice.priority}</Badge>
                            </div>
                            <p className="text-xs text-gray-500">{notice.date}</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => navigate('/notices')}>
                            Read
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <Card className="shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-indigo-600" />
                    Upcoming Events
                    <Badge variant="secondary">{mockData.events.length}</Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {mockData.events.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarDays className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No upcoming events</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockData.events.map((event) => (
                      <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold mb-1">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                        <p className="text-xs text-gray-500">{event.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email" className="space-y-4">
            <Card className="shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-cyan-100 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-cyan-600" />
                    Unread Emails
                    <Badge variant="secondary">{mockData.emails.unread}</Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {mockData.emails.recent.map((email) => (
                    <div key={email.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold mb-1">{email.subject}</h4>
                      <p className="text-sm text-gray-600">From: {email.from}</p>
                      <p className="text-xs text-gray-500">{email.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MyWork;
