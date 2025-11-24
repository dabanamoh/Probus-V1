import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar,
  User,
  FileText,
  AlertTriangle,
  X,
  Bell,
  ArrowRight,
  Timer,
  Users,
  DollarSign,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../shared/ui/dialog";

const AdminApprovals = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [viewingApproval, setViewingApproval] = useState<any>(null);

  // Mock approval data - Admin level approvals (final approver in chain)
  const approvals = [
    {
      id: 'ADM001',
      type: 'budget',
      employee: 'Finance Department',
      title: 'Annual Budget Increase Request',
      description: 'Request for 15% budget increase for Q1 2025 operations',
      requestDate: '2024-11-18',
      amount: '$250,000',
      status: 'pending',
      priority: 'high',
      department: 'Finance',
      submittedBy: 'David Kim - Finance Manager',
      approvalFlow: [
        {
          id: '1',
          approverName: 'Department Head',
          approverRole: 'Finance Department Head',
          approverDepartment: 'Finance',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-18T09:00:00',
          approvedDate: '2024-11-18T10:30:00',
          timeTaken: '1 hour 30 minutes',
          comments: 'Department budget projections reviewed. Recommended for approval.'
        },
        {
          id: '2',
          approverName: 'CFO',
          approverRole: 'Chief Financial Officer',
          approverDepartment: 'Executive',
          status: 'approved',
          order: 2,
          assignedDate: '2024-11-18T10:30:00',
          approvedDate: '2024-11-18T11:30:00',
          timeTaken: '1 hour',
          comments: 'Justified based on projected growth. Financial analysis complete.'
        },
        {
          id: '3',
          approverName: 'Admin (You)',
          approverRole: 'System Administrator',
          approverDepartment: 'Administration',
          status: 'pending',
          order: 3,
          assignedDate: '2024-11-18T11:30:00',
          timeTaken: null,
          comments: ''
        }
      ]
    },
    {
      id: 'ADM002',
      type: 'department_creation',
      employee: 'HR Department',
      title: 'New Department: Customer Success',
      description: 'Proposal to create dedicated Customer Success department with 8 initial positions',
      requestDate: '2024-11-16',
      status: 'pending',
      priority: 'high',
      department: 'HR',
      submittedBy: 'Lisa Brown - HR Manager',
      headcount: '8 positions',
      estimatedCost: '$650,000/year',
      approvalFlow: [
        {
          id: '1',
          approverName: 'HR Director',
          approverRole: 'Human Resources Director',
          approverDepartment: 'Human Resources',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-16T09:00:00',
          approvedDate: '2024-11-16T11:00:00',
          timeTaken: '2 hours',
          comments: 'Strong business case presented. Aligns with company growth strategy.'
        },
        {
          id: '2',
          approverName: 'Lisa Brown',
          approverRole: 'HR Manager',
          approverDepartment: 'Human Resources',
          status: 'approved',
          order: 2,
          assignedDate: '2024-11-16T11:00:00',
          approvedDate: '2024-11-16T14:00:00',
          timeTaken: '3 hours',
          comments: 'Detailed org structure prepared. Recommended approval.'
        },
        {
          id: '3',
          approverName: 'CFO',
          approverRole: 'Chief Financial Officer',
          approverDepartment: 'Executive',
          status: 'approved',
          order: 3,
          assignedDate: '2024-11-16T14:00:00',
          approvedDate: '2024-11-16T16:30:00',
          timeTaken: '2 hours 30 minutes',
          comments: 'Budget allocation approved. ROI projections acceptable.'
        },
        {
          id: '4',
          approverName: 'Admin (You)',
          approverRole: 'System Administrator',
          approverDepartment: 'Administration',
          status: 'pending',
          order: 4,
          assignedDate: '2024-11-16T16:30:00',
          timeTaken: null,
          comments: ''
        }
      ]
    },
    {
      id: 'ADM003',
      type: 'policy_change',
      employee: 'HR Department',
      title: 'Updated Remote Work Policy',
      description: 'Comprehensive revision of remote work guidelines to allow up to 4 days remote per week',
      requestDate: '2024-11-14',
      status: 'approved',
      priority: 'medium',
      department: 'HR',
      submittedBy: 'Lisa Brown - HR Manager',
      approvalFlow: [
        {
          id: '1',
          approverName: 'HR Manager',
          approverRole: 'Human Resources Manager',
          approverDepartment: 'Human Resources',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-14T09:00:00',
          approvedDate: '2024-11-14T10:30:00',
          timeTaken: '1 hour 30 minutes',
          comments: 'Employee feedback incorporated. Ready for legal review.'
        },
        {
          id: '2',
          approverName: 'Legal Team',
          approverRole: 'Legal Review',
          approverDepartment: 'Legal',
          status: 'approved',
          order: 2,
          assignedDate: '2024-11-14T10:30:00',
          approvedDate: '2024-11-14T16:00:00',
          timeTaken: '5 hours 30 minutes',
          comments: 'Legally compliant. No issues found. Terms clearly defined.'
        },
        {
          id: '3',
          approverName: 'CEO',
          approverRole: 'Chief Executive Officer',
          approverDepartment: 'Executive',
          status: 'approved',
          order: 3,
          assignedDate: '2024-11-14T16:00:00',
          approvedDate: '2024-11-14T17:30:00',
          timeTaken: '1 hour 30 minutes',
          comments: 'Supports flexible work culture. Approved for implementation.'
        },
        {
          id: '4',
          approverName: 'Admin (You)',
          approverRole: 'System Administrator',
          approverDepartment: 'Administration',
          status: 'approved',
          order: 4,
          assignedDate: '2024-11-14T17:30:00',
          approvedDate: '2024-11-15T10:00:00',
          timeTaken: '16 hours 30 minutes',
          comments: 'Approved for implementation. Effective Dec 1, 2024.'
        }
      ]
    },
    {
      id: 'ADM004',
      type: 'system_access',
      employee: 'IT Department',
      title: 'Elevated System Access Request',
      description: 'Request for production database admin access for critical migration project',
      requestDate: '2024-11-12',
      status: 'pending',
      priority: 'high',
      department: 'IT',
      requestor: 'John Davis - Senior Developer',
      duration: '90 days (temporary)',
      approvalFlow: [
        {
          id: '1',
          approverName: 'Direct Manager',
          approverRole: 'Engineering Manager',
          approverDepartment: 'Engineering',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-12T09:00:00',
          approvedDate: '2024-11-12T09:45:00',
          timeTaken: '45 minutes',
          comments: 'Employee is lead developer on migration project. Access justified.'
        },
        {
          id: '2',
          approverName: 'IT Manager',
          approverRole: 'IT Department Head',
          approverDepartment: 'Information Technology',
          status: 'approved',
          order: 2,
          assignedDate: '2024-11-12T09:45:00',
          approvedDate: '2024-11-12T10:30:00',
          timeTaken: '45 minutes',
          comments: 'Necessary for critical database migration project. Recommend time-limited access.'
        },
        {
          id: '3',
          approverName: 'Security Officer',
          approverRole: 'Chief Security Officer',
          approverDepartment: 'Security',
          status: 'approved',
          order: 3,
          assignedDate: '2024-11-12T10:30:00',
          approvedDate: '2024-11-12T15:00:00',
          timeTaken: '4 hours 30 minutes',
          comments: 'Security audit passed. Background check verified. Recommend 90-day time limit with audit trail.'
        },
        {
          id: '4',
          approverName: 'Admin (You)',
          approverRole: 'System Administrator',
          approverDepartment: 'Administration',
          status: 'pending',
          order: 4,
          assignedDate: '2024-11-12T15:00:00',
          timeTaken: null,
          comments: ''
        }
      ]
    },
    {
      id: 'ADM005',
      type: 'major_expense',
      employee: 'Marketing Department',
      title: 'Annual Marketing Campaign Budget',
      description: 'Q1 2025 digital marketing campaign across all channels',
      requestDate: '2024-11-10',
      status: 'pending',
      priority: 'high',
      department: 'Marketing',
      submittedBy: 'Robert Davis - Marketing Director',
      amount: '$450,000',
      approvalFlow: [
        {
          id: '1',
          approverName: 'Marketing Director',
          approverRole: 'Director of Marketing',
          approverDepartment: 'Marketing',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-10T09:00:00',
          approvedDate: '2024-11-10T11:00:00',
          timeTaken: '2 hours',
          comments: 'Campaign strategy aligned with Q1 objectives. ROI projections strong.'
        },
        {
          id: '2',
          approverName: 'CFO',
          approverRole: 'Chief Financial Officer',
          approverDepartment: 'Executive',
          status: 'approved',
          order: 2,
          assignedDate: '2024-11-10T11:00:00',
          approvedDate: '2024-11-10T14:30:00',
          timeTaken: '3 hours 30 minutes',
          comments: 'Budget available. Expected ROAS of 4.5x is acceptable.'
        },
        {
          id: '3',
          approverName: 'Admin (You)',
          approverRole: 'System Administrator',
          approverDepartment: 'Administration',
          status: 'pending',
          order: 3,
          assignedDate: '2024-11-10T14:30:00',
          timeTaken: null,
          comments: ''
        }
      ]
    },
    {
      id: 'ADM006',
      type: 'headcount_increase',
      employee: 'Engineering Department',
      title: 'Engineering Team Expansion - 5 Positions',
      description: 'Hire 3 senior engineers and 2 junior engineers for new product line',
      requestDate: '2024-11-08',
      status: 'approved',
      priority: 'high',
      department: 'Engineering',
      submittedBy: 'Tech Lead - Engineering',
      positions: '5 new hires',
      estimatedCost: '$850,000/year',
      approvalFlow: [
        {
          id: '1',
          approverName: 'Engineering Manager',
          approverRole: 'Engineering Department Head',
          approverDepartment: 'Engineering',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-08T09:00:00',
          approvedDate: '2024-11-08T10:00:00',
          timeTaken: '1 hour',
          comments: 'Critical for new product development timeline. Skill gaps identified.'
        },
        {
          id: '2',
          approverName: 'HR Manager',
          approverRole: 'Human Resources Manager',
          approverDepartment: 'Human Resources',
          status: 'approved',
          order: 2,
          assignedDate: '2024-11-08T10:00:00',
          approvedDate: '2024-11-08T13:00:00',
          timeTaken: '3 hours',
          comments: 'Recruitment capacity available. Job descriptions prepared.'
        },
        {
          id: '3',
          approverName: 'CFO',
          approverRole: 'Chief Financial Officer',
          approverDepartment: 'Executive',
          status: 'approved',
          order: 3,
          assignedDate: '2024-11-08T13:00:00',
          approvedDate: '2024-11-08T16:00:00',
          timeTaken: '3 hours',
          comments: 'Budget approved. Investment justified by product revenue projections.'
        },
        {
          id: '4',
          approverName: 'CEO',
          approverRole: 'Chief Executive Officer',
          approverDepartment: 'Executive',
          status: 'approved',
          order: 4,
          assignedDate: '2024-11-08T16:00:00',
          approvedDate: '2024-11-09T09:00:00',
          timeTaken: '17 hours',
          comments: 'Strategic hire for product expansion. Approved.'
        },
        {
          id: '5',
          approverName: 'Admin (You)',
          approverRole: 'System Administrator',
          approverDepartment: 'Administration',
          status: 'approved',
          order: 5,
          assignedDate: '2024-11-09T09:00:00',
          approvedDate: '2024-11-09T10:30:00',
          timeTaken: '1 hour 30 minutes',
          comments: 'Final approval granted. Begin recruitment process.'
        }
      ]
    }
  ];

  const handleSendReminder = (approverName: string) => {
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #3b82f6;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#dbeafe;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6V10L13 13" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="10" r="7" stroke="#2563eb" stroke-width="2"/></svg></div><div><p style="margin:0;font-weight:600;color:#1e3a8a;font-size:14px;">Reminder Sent</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">Notified ${approverName}</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'budget':
        return <DollarSign className="w-6 h-6 text-green-600" />;
      case 'department_creation':
        return <Users className="w-6 h-6 text-blue-600" />;
      case 'policy_change':
        return <FileText className="w-6 h-6 text-purple-600" />;
      case 'system_access':
        return <Shield className="w-6 h-6 text-red-600" />;
      default:
        return <ClipboardCheck className="w-6 h-6 text-gray-600" />;
    }
  };

  const handleApprove = (id: string) => {
    console.log('Approving:', id);
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #10b981;z-index:9999;"><p style="margin:0;font-weight:600;color:#065f46;font-size:14px;">✓ Approval confirmed</p></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  const handleReject = (id: string) => {
    console.log('Rejecting:', id);
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #ef4444;z-index:9999;"><p style="margin:0;font-weight:600;color:#991b1b;font-size:14px;">✗ Request rejected</p></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  const filteredApprovals = approvals.filter(approval => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return approval.status === 'pending';
    if (activeTab === 'approved') return approval.status === 'approved';
    if (activeTab === 'rejected') return approval.status === 'rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Administrator Approvals</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Review and approve system-level requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {filteredApprovals.filter(a => a.status === 'pending').length} Pending
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({approvals.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({approvals.filter(a => a.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvals.filter(a => a.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({approvals.filter(a => a.status === 'rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Approval Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredApprovals.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">No {activeTab} approvals</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApprovals.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell className="font-medium">{approval.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(approval.type)}
                            <span className="capitalize">{approval.type.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="font-medium">{approval.title}</div>
                          <div className="text-sm text-gray-500 truncate">{approval.description}</div>
                        </TableCell>
                        <TableCell>{approval.department}</TableCell>
                        <TableCell>{approval.requestDate}</TableCell>
                        <TableCell>{getPriorityBadge(approval.priority)}</TableCell>
                        <TableCell>{getStatusBadge(approval.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setViewingApproval(approval)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {approval.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApprove(approval.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(approval.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      {viewingApproval && (
        <Dialog open={!!viewingApproval} onOpenChange={() => setViewingApproval(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {getTypeIcon(viewingApproval.type)}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white mb-2">
                      {viewingApproval.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        {viewingApproval.id}
                      </Badge>
                      {getStatusBadge(viewingApproval.status)}
                      {getPriorityBadge(viewingApproval.priority)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 py-6 space-y-6">
              {/* Request Details */}
              <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-sky-50/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Request Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Request Date</p>
                      <p className="text-base font-semibold text-gray-900">{viewingApproval.requestDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Department</p>
                      <p className="text-base font-semibold text-gray-900">{viewingApproval.department}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p className="text-base font-semibold text-gray-900 capitalize">
                        {viewingApproval.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                    <p className="text-base text-gray-700">{viewingApproval.description}</p>
                  </div>
                  {viewingApproval.amount && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p className="text-2xl font-bold text-green-600">{viewingApproval.amount}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Approval Flow */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Approval Flow
                </h3>
                <div className="space-y-4">
                  {viewingApproval.approvalFlow.map((approver: any, index: number) => {
                    const getStatusColor = () => {
                      switch (approver.status) {
                        case 'approved': return 'from-green-50 to-emerald-50 border-green-300';
                        case 'rejected': return 'from-red-50 to-rose-50 border-red-300';
                        case 'pending': return 'from-yellow-50 to-amber-50 border-yellow-300';
                        case 'waiting': return 'from-gray-50 to-slate-50 border-gray-300';
                        default: return 'from-gray-50 to-slate-50 border-gray-300';
                      }
                    };

                    const getStatusIcon = () => {
                      switch (approver.status) {
                        case 'approved':
                          return <CheckCircle className="w-6 h-6 text-green-600" />;
                        case 'rejected':
                          return <XCircle className="w-6 h-6 text-red-600" />;
                        case 'pending':
                          return <Clock className="w-6 h-6 text-yellow-600" />;
                        case 'waiting':
                          return <Clock className="w-6 h-6 text-gray-400" />;
                        default:
                          return <AlertTriangle className="w-6 h-6 text-gray-400" />;
                      }
                    };

                    return (
                      <Card key={approver.id} className={`bg-gradient-to-br ${getStatusColor()} border-2 hover:shadow-lg transition-all`}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="flex-shrink-0">
                                {getStatusIcon()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="font-semibold">
                                    Step {approver.order}
                                  </Badge>
                                  <span className="font-bold text-gray-900">{approver.approverName}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{approver.approverRole}</p>
                                <p className="text-sm text-gray-500">{approver.approverDepartment}</p>

                                {approver.assignedDate && (
                                  <div className="mt-3 flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4 text-gray-500" />
                                      <span>Assigned: {new Date(approver.assignedDate).toLocaleString()}</span>
                                    </div>
                                    {approver.timeTaken && (
                                      <div className="flex items-center gap-1">
                                        <Timer className="w-4 h-4 text-gray-500" />
                                        <span>Time: {approver.timeTaken}</span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {approver.comments && (
                                  <div className="mt-3 p-3 bg-white/80 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-700 italic">"{approver.comments}"</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {approver.status === 'pending' && (
                              <Button
                                size="sm"
                                className="bg-yellow-500 hover:bg-yellow-600 text-white border-0 shadow-md"
                                onClick={() => handleSendReminder(approver.approverName)}
                              >
                                <Bell className="w-4 h-4 mr-2" />
                                Remind
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            {viewingApproval.status === 'pending' && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setViewingApproval(null)}
                >
                  Close
                </Button>
                <div className="flex items-center gap-3">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleReject(viewingApproval.id);
                      setViewingApproval(null);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Request
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApprove(viewingApproval.id);
                      setViewingApproval(null);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminApprovals;
