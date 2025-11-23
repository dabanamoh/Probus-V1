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
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/table";

const HRApprovals = () => {
  const [activeTab, setActiveTab] = useState('pending');

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
      department: 'Engineering'
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
      department: 'Marketing'
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
      department: 'HR'
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
      department: 'Finance'
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
    console.log('View details:', approvalId);
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #3b82f6;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#dbeafe;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.5 10C2.5 10 5 4.167 10 4.167C15 4.167 17.5 10 17.5 10C17.5 10 15 15.833 10 15.833C5 15.833 2.5 10 2.5 10Z" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#1e3a8a;font-size:14px;">Viewing Details</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">Request ${approvalId}</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 2500);
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
    </div>
  );
};

export default HRApprovals;
