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
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../shared/ui/dialog";

const HRApprovals = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [viewingApproval, setViewingApproval] = useState<any>(null);

  // Mock approval data
  const approvals = [
    {
      id: 'APP001',
      type: 'leave',
      employee: 'Sarah Johnson',
      title: 'Annual Leave Request',
      description: 'Vacation leave from Dec 20 - Jan 3',
      requestDate: '2024-11-15',
      requestedDates: 'Dec 20, 2024 - Jan 3, 2025',
      status: 'pending',
      priority: 'medium',
      department: 'Engineering',
      approvalFlow: [
        {
          id: '1',
          approverName: 'John Smith',
          approverRole: 'Direct Manager',
          approverDepartment: 'Engineering',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-15T09:00:00',
          approvedDate: '2024-11-15T14:30:00',
          timeTaken: '5 hours 30 minutes',
          comments: 'Approved. Team coverage is arranged.'
        },
        {
          id: '2',
          approverName: 'Lisa Brown',
          approverRole: 'HR Manager',
          approverDepartment: 'Human Resources',
          status: 'pending',
          order: 2,
          assignedDate: '2024-11-15T14:30:00',
          timeTaken: null,
          comments: ''
        }
      ]
    },
    {
      id: 'APP002',
      type: 'expense',
      employee: 'Mike Chen',
      title: 'Conference Attendance',
      description: 'Tech conference registration and travel expenses',
      requestDate: '2024-11-10',
      amount: '$2,500',
      status: 'pending',
      priority: 'high',
      department: 'Marketing',
      approvalFlow: [
        {
          id: '1',
          approverName: 'Robert Davis',
          approverRole: 'Department Manager',
          approverDepartment: 'Marketing',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-10T09:00:00',
          approvedDate: '2024-11-10T11:20:00',
          timeTaken: '2 hours 20 minutes',
          comments: 'Good for professional development.'
        },
        {
          id: '2',
          approverName: 'Lisa Brown',
          approverRole: 'HR Manager',
          approverDepartment: 'Human Resources',
          status: 'pending',
          order: 2,
          assignedDate: '2024-11-10T11:20:00',
          timeTaken: null,
          comments: ''
        },
        {
          id: '3',
          approverName: 'David Kim',
          approverRole: 'Finance Manager',
          approverDepartment: 'Finance',
          status: 'waiting',
          order: 3,
          assignedDate: null,
          timeTaken: null,
          comments: ''
        }
      ]
    },
    {
      id: 'APP003',
      type: 'promotion',
      employee: 'Emily Davis',
      title: 'Promotion to Senior HR Specialist',
      description: 'Performance-based promotion with salary adjustment',
      requestDate: '2024-11-08',
      effectiveDate: 'Jan 1, 2025',
      status: 'approved',
      priority: 'high',
      department: 'HR',
      approvalFlow: [
        {
          id: '1',
          approverName: 'Lisa Brown',
          approverRole: 'HR Manager',
          approverDepartment: 'Human Resources',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-08T09:00:00',
          approvedDate: '2024-11-08T15:00:00',
          timeTaken: '6 hours',
          comments: 'Well-deserved promotion. Excellent performance.'
        },
        {
          id: '2',
          approverName: 'CEO Office',
          approverRole: 'Executive Approval',
          approverDepartment: 'Executive',
          status: 'approved',
          order: 2,
          assignedDate: '2024-11-08T15:00:00',
          approvedDate: '2024-11-09T10:30:00',
          timeTaken: '19 hours 30 minutes',
          comments: 'Approved. Update contract accordingly.'
        }
      ]
    },
    {
      id: 'APP004',
      type: 'policy_exception',
      employee: 'David Kim',
      title: 'Remote Work Exception',
      description: 'Request for permanent remote work arrangement',
      requestDate: '2024-11-05',
      status: 'pending',
      priority: 'low',
      department: 'Finance',
      approvalFlow: [
        {
          id: '1',
          approverName: 'Michael Johnson',
          approverRole: 'Department Head',
          approverDepartment: 'Finance',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-05T09:00:00',
          approvedDate: '2024-11-05T16:45:00',
          timeTaken: '7 hours 45 minutes',
          comments: 'Employee has proven remote work capability.'
        },
        {
          id: '2',
          approverName: 'Lisa Brown',
          approverRole: 'HR Manager',
          approverDepartment: 'Human Resources',
          status: 'pending',
          order: 2,
          assignedDate: '2024-11-05T16:45:00',
          timeTaken: null,
          comments: ''
        }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-200">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-sky-100 text-sky-800 border border-sky-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-cyan-100 text-cyan-800 border border-cyan-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-sky-100 text-sky-800 border border-sky-200">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return <Calendar className="w-4 h-4" />;
      case 'expense':
        return <FileText className="w-4 h-4" />;
      case 'promotion':
        return <User className="w-4 h-4" />;
      case 'policy_exception':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <ClipboardCheck className="w-4 h-4" />;
    }
  };

  const filteredApprovals = (status: string) => {
    if (status === 'all') return approvals;
    return approvals.filter(approval => approval.status === status);
  };

  const handleApprove = (approvalId: string) => {
    console.log('Approve:', approvalId);
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #10b981;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#d1fae5;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 5L7.5 14.167L3.333 10" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#065f46;font-size:14px;">Approval Successful</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">Request ${approvalId} approved</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  const handleReject = (approvalId: string) => {
    console.log('Reject:', approvalId);
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #ef4444;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#fee2e2;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 5L5 15M5 5L15 15" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#991b1b;font-size:14px;">Request Rejected</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">Request ${approvalId} declined</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  const handleViewDetails = (approvalId: string) => {
    const approval = approvals.find(a => a.id === approvalId);
    if (approval) {
      setViewingApproval(approval);
    }
  };

  const handleSendReminder = (approverName: string) => {
    // In a real app, this would send a notification/email to the approver
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #3b82f6;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#dbeafe;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6V10L13 13" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="10" r="7" stroke="#2563eb" stroke-width="2"/></svg></div><div><p style="margin:0;font-weight:600;color:#1e3a8a;font-size:14px;">Reminder Sent</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">Notified ${approverName}</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-blue-50/30 min-h-screen">
      <div className="mb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">HR Approvals</h1>
            <p className="text-blue-700">Review and manage employee requests and approvals</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-700">Pending</p>
                  <p className="text-2xl font-bold text-indigo-900">
                    {approvals.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-700">Approved</p>
                  <p className="text-2xl font-bold text-sky-900">
                    {approvals.filter(a => a.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-sky-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-blue-200 bg-gradient-to-br from-blue-100 to-indigo-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">High Priority</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {approvals.filter(a => a.priority === 'high').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-700" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">This Month</p>
                  <p className="text-2xl font-bold text-blue-900">{approvals.length}</p>
                </div>
                <ClipboardCheck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approvals Table */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-blue-50 border border-blue-200">
            <TabsTrigger value="pending">Pending ({filteredApprovals('pending').length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({filteredApprovals('approved').length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({filteredApprovals('rejected').length})</TabsTrigger>
            <TabsTrigger value="all">All ({approvals.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card className="border border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Approvals
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApprovals(activeTab).map((approval) => (
                        <TableRow key={approval.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{approval.title}</div>
                              <div className="text-sm text-gray-500">{approval.description}</div>
                              <div className="text-xs text-gray-400">{approval.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{approval.employee}</div>
                              <div className="text-sm text-gray-500">{approval.department}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(approval.type)}
                              <span className="capitalize">{approval.type.replace('_', ' ')}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(approval.priority)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(approval.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(approval.requestDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-200 hover:bg-blue-50"
                                onClick={() => handleViewDetails(approval.id)}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              {approval.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-sky-600 hover:bg-sky-700"
                                    onClick={() => handleApprove(approval.id)}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => handleReject(approval.id)}
                                  >
                                    <XCircle className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Details Dialog */}
      <Dialog open={!!viewingApproval} onOpenChange={() => setViewingApproval(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-xl font-bold text-blue-900">Approval Request Details</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setViewingApproval(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Complete information about this approval request
            </DialogDescription>
          </DialogHeader>
          
          {viewingApproval && (
            <div className="space-y-6">
              {/* Request Information */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    {getTypeIcon(viewingApproval.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{viewingApproval.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{viewingApproval.description}</p>
                    <div className="flex gap-2 mt-2">
                      {getStatusBadge(viewingApproval.status)}
                      {getPriorityBadge(viewingApproval.priority)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Request ID</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{viewingApproval.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Request Type</p>
                  <p className="text-base font-semibold text-gray-900 mt-1 capitalize">
                    {viewingApproval.type.replace('_', ' ')}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Employee</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{viewingApproval.employee}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{viewingApproval.department}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Request Date</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {new Date(viewingApproval.requestDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(viewingApproval.status)}</div>
                </div>
              </div>

              {/* Type-specific details */}
              {viewingApproval.type === 'leave' && viewingApproval.requestedDates && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-900">Requested Dates</p>
                  </div>
                  <p className="text-base font-semibold text-blue-800">{viewingApproval.requestedDates}</p>
                </div>
              )}

              {viewingApproval.type === 'expense' && viewingApproval.amount && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-green-900">Amount Requested</p>
                  </div>
                  <p className="text-2xl font-bold text-green-800">{viewingApproval.amount}</p>
                </div>
              )}

              {viewingApproval.type === 'promotion' && viewingApproval.effectiveDate && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-purple-600" />
                    <p className="text-sm font-medium text-purple-900">Effective Date</p>
                  </div>
                  <p className="text-base font-semibold text-purple-800">{viewingApproval.effectiveDate}</p>
                </div>
              )}

              {/* Action Buttons */}
              {viewingApproval.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApprove(viewingApproval.id);
                      setViewingApproval(null);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      handleReject(viewingApproval.id);
                      setViewingApproval(null);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HRApprovals;
