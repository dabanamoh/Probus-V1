import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  FileText, 
  Send, 
  Eye, 
  Search,
  Filter,
  CalendarDays,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Building2,
  DollarSign,
  Briefcase,
  Bell,
  ArrowRight,
  Timer,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Textarea } from "../../shared/ui/textarea";
import { Badge } from "../../shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../shared/ui/dialog";

const EmployeeApprovals = () => {
  const [activeTab, setActiveTab] = useState('my-requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<any>(null);
  const [newRequest, setNewRequest] = useState({
    type: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    amount: '',
    urgency: 'normal'
  });

  // Mock data for employee's own approval requests
  const myRequests = [
    {
      id: 'REQ001',
      type: 'leave_request',
      title: 'Annual Leave Request',
      description: 'Family vacation to Europe for 7 days',
      status: 'pending',
      requestDate: '2024-11-15',
      startDate: '2024-12-20',
      endDate: '2024-12-27',
      urgency: 'normal',
      currentApprover: 'John Smith (Manager)',
      estimatedCompletion: '2024-11-18',
      approvalFlow: [
        {
          id: '1',
          approverName: 'John Smith',
          approverRole: 'Direct Manager',
          approverDepartment: 'Engineering',
          status: 'pending',
          order: 1,
          assignedDate: '2024-11-15T09:00:00',
          timeTaken: null,
          comments: ''
        },
        {
          id: '2',
          approverName: 'Lisa Brown',
          approverRole: 'HR Manager',
          approverDepartment: 'Human Resources',
          status: 'waiting',
          order: 2,
          assignedDate: null,
          timeTaken: null,
          comments: ''
        },
        {
          id: '3',
          approverName: 'Robert Davis',
          approverRole: 'Department Head',
          approverDepartment: 'Engineering',
          status: 'waiting',
          order: 3,
          assignedDate: null,
          timeTaken: null,
          comments: ''
        }
      ]
    },
    {
      id: 'REQ002', 
      type: 'expense_reimbursement',
      title: 'Training Course Expense',
      description: 'Reimbursement for React certification course',
      status: 'approved',
      requestDate: '2024-11-10',
      amount: '$299',
      urgency: 'low',
      approvedBy: 'Lisa Brown (HR)',
      approvedDate: '2024-11-12',
      approvalFlow: [
        {
          id: '1',
          approverName: 'John Smith',
          approverRole: 'Direct Manager',
          approverDepartment: 'Engineering',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-10T09:00:00',
          approvedDate: '2024-11-10T14:30:00',
          timeTaken: '5 hours 30 minutes',
          comments: 'Good investment in professional development'
        },
        {
          id: '2',
          approverName: 'Lisa Brown',
          approverRole: 'HR Manager',
          approverDepartment: 'Human Resources',
          status: 'approved',
          order: 2,
          assignedDate: '2024-11-10T14:30:00',
          approvedDate: '2024-11-12T10:15:00',
          timeTaken: '1 day 19 hours 45 minutes',
          comments: 'Approved. This aligns with our upskilling initiative.'
        }
      ]
    },
    {
      id: 'REQ003',
      type: 'equipment_request',
      title: 'New Laptop Request',
      description: 'Current laptop is 4 years old and running slowly, affecting productivity',
      status: 'rejected',
      requestDate: '2024-11-05',
      urgency: 'high',
      rejectedBy: 'David Kim (IT Manager)',
      rejectedDate: '2024-11-07',
      rejectionReason: 'Budget constraints for Q4. Please resubmit in Q1 2025.',
      approvalFlow: [
        {
          id: '1',
          approverName: 'John Smith',
          approverRole: 'Direct Manager',
          approverDepartment: 'Engineering',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-05T09:00:00',
          approvedDate: '2024-11-05T11:20:00',
          timeTaken: '2 hours 20 minutes',
          comments: 'Endorsed. Employee needs better equipment.'
        },
        {
          id: '2',
          approverName: 'David Kim',
          approverRole: 'IT Manager',
          approverDepartment: 'Information Technology',
          status: 'rejected',
          order: 2,
          assignedDate: '2024-11-05T11:20:00',
          rejectedDate: '2024-11-07T15:45:00',
          timeTaken: '2 days 4 hours 25 minutes',
          comments: 'Budget constraints for Q4. Please resubmit in Q1 2025.'
        }
      ]
    },
    {
      id: 'REQ004',
      type: 'time_off',
      title: 'Sick Leave',
      description: 'Medical appointment and recovery time',
      status: 'approved',
      requestDate: '2024-11-01',
      startDate: '2024-11-08',
      endDate: '2024-11-08',
      urgency: 'high',
      approvedBy: 'John Smith (Manager)',
      approvedDate: '2024-11-01',
      approvalFlow: [
        {
          id: '1',
          approverName: 'John Smith',
          approverRole: 'Direct Manager',
          approverDepartment: 'Engineering',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-01T08:00:00',
          approvedDate: '2024-11-01T08:45:00',
          timeTaken: '45 minutes',
          comments: 'Approved. Hope you feel better soon.'
        }
      ]
    }
  ];

  const requestTypes = [
    { value: 'leave_request', label: 'Annual Leave', icon: CalendarDays },
    { value: 'time_off', label: 'Time Off / Sick Leave', icon: Clock },
    { value: 'expense_reimbursement', label: 'Expense Reimbursement', icon: DollarSign },
    { value: 'equipment_request', label: 'Equipment Request', icon: Briefcase },
    { value: 'policy_exception', label: 'Policy Exception', icon: FileText },
    { value: 'promotion_request', label: 'Promotion Request', icon: User },
    { value: 'transfer_request', label: 'Department Transfer', icon: Building2 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Pending
        </Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Approved
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Rejected
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'normal':
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{urgency}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = requestTypes.find(t => t.value === type);
    if (typeConfig) {
      const IconComponent = typeConfig.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const filteredRequests = myRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateRequest = () => {
    // In a real app, this would send the request to the backend
    console.log('Creating new request:', newRequest);
    setIsCreateDialogOpen(false);
    setNewRequest({
      type: '',
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      amount: '',
      urgency: 'normal'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setNewRequest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewRequest = (requestId: string) => {
    const request = myRequests.find(r => r.id === requestId);
    if (request) {
      setViewingRequest(request);
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
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Approval Requests</h1>
            <p className="text-gray-600">Submit and track your approval requests</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Approval Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Request Type</label>
                  <Select value={newRequest.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      {requestTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={newRequest.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Brief title for your request"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={newRequest.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide details about your request"
                    rows={4}
                  />
                </div>

                {(newRequest.type === 'leave_request' || newRequest.type === 'time_off') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date</label>
                      <Input
                        type="date"
                        value={newRequest.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">End Date</label>
                      <Input
                        type="date"
                        value={newRequest.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {newRequest.type === 'expense_reimbursement' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <Input
                      value={newRequest.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="$0.00"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Urgency</label>
                  <Select value={newRequest.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateRequest} className="bg-blue-500 hover:bg-blue-600">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{myRequests.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {myRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {myRequests.filter(r => r.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {myRequests.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>My Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(request.type)}
                          <span className="font-medium">{request.title}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{request.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">
                        {requestTypes.find(t => t.value === request.type)?.label || request.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      {getUrgencyBadge(request.urgency)}
                    </TableCell>
                    <TableCell>
                      {new Date(request.requestDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewRequest(request.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRequests.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters.' : 'Start by creating your first approval request.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Request Details Dialog */}
      {viewingRequest && (
        <Dialog open={!!viewingRequest} onOpenChange={() => setViewingRequest(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {getTypeIcon(viewingRequest.type)}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white mb-2">
                      {viewingRequest.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        {viewingRequest.id}
                      </Badge>
                      {getStatusBadge(viewingRequest.status)}
                      {getUrgencyBadge(viewingRequest.urgency)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
              <div className="space-y-6">
                {/* Request Type Card */}
                <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTypeIcon(viewingRequest.type)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Request Type</p>
                        <p className="font-semibold text-gray-900">
                          {requestTypes.find(t => t.value === viewingRequest.type)?.label || viewingRequest.type}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description Card */}
                <Card className="border-gray-200">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-2 mb-3">
                      <FileText className="w-4 h-4 text-gray-600 mt-1" />
                      <h3 className="font-semibold text-gray-900">Description</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{viewingRequest.description}</p>
                  </CardContent>
                </Card>

                {/* Date Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <p className="text-xs font-medium text-gray-600">Request Date</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {new Date(viewingRequest.requestDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </CardContent>
                  </Card>

                  {viewingRequest.startDate && (
                    <Card className="border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarDays className="w-4 h-4 text-green-600" />
                          <p className="text-xs font-medium text-gray-600">Start Date</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {new Date(viewingRequest.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {viewingRequest.endDate && (
                    <Card className="border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarDays className="w-4 h-4 text-orange-600" />
                          <p className="text-xs font-medium text-gray-600">End Date</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {new Date(viewingRequest.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Amount Card */}
                {viewingRequest.amount && (
                  <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-xl">
                          <DollarSign className="w-6 h-6 text-green-700" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Requested Amount</p>
                          <p className="text-3xl font-bold text-green-700">{viewingRequest.amount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Current Approver */}
                {viewingRequest.status === 'pending' && viewingRequest.currentApprover && (
                  <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <User className="w-5 h-5 text-yellow-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-600 mb-1">Currently With</p>
                          <p className="font-semibold text-gray-900 mb-2">{viewingRequest.currentApprover}</p>
                          {viewingRequest.estimatedCompletion && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>Expected by: {new Date(viewingRequest.estimatedCompletion).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Approval Flow Visualization */}
                {viewingRequest.approvalFlow && viewingRequest.approvalFlow.length > 0 && (
                  <div className="border-t-2 border-gray-200 pt-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-5 h-5 text-blue-700" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Approval Journey</h3>
                    </div>
                    <div className="space-y-3">
                      {viewingRequest.approvalFlow.map((approver: any, index: number) => {
                        const isLast = index === viewingRequest.approvalFlow.length - 1;
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
                            case 'approved': return <CheckCircle className="w-6 h-6 text-green-600" />;
                            case 'rejected': return <XCircle className="w-6 h-6 text-red-600" />;
                            case 'pending': return <Clock className="w-6 h-6 text-yellow-600 animate-pulse" />;
                            case 'waiting': return <Clock className="w-6 h-6 text-gray-400" />;
                            default: return <AlertCircle className="w-6 h-6 text-gray-400" />;
                          }
                        };

                        return (
                          <div key={approver.id}>
                            <Card className={`bg-gradient-to-br ${getStatusColor()} border-2 hover:shadow-lg transition-all`}>
                              <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-4 flex-1">
                                    <div className="flex-shrink-0">
                                      {getStatusIcon()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      {/* Approver Info */}
                                      <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <h4 className="font-bold text-lg text-gray-900">{approver.approverName}</h4>
                                        <Badge variant="outline" className="font-medium">
                                          {approver.approverRole}
                                        </Badge>
                                        {approver.status === 'approved' && (
                                          <Badge className="bg-green-600 text-white border-0">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Approved
                                          </Badge>
                                        )}
                                        {approver.status === 'rejected' && (
                                          <Badge className="bg-red-600 text-white border-0">
                                            <XCircle className="w-3 h-3 mr-1" />
                                            Rejected
                                          </Badge>
                                        )}
                                        {approver.status === 'pending' && (
                                          <Badge className="bg-yellow-600 text-white border-0 animate-pulse">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Reviewing Now
                                          </Badge>
                                        )}
                                        {approver.status === 'waiting' && (
                                          <Badge className="bg-gray-400 text-white border-0">
                                            Waiting
                                          </Badge>
                                        )}
                                      </div>
                                      
                                      <p className="text-sm text-gray-600 mb-3">{approver.approverDepartment}</p>

                                      {/* Timeline */}
                                      {approver.assignedDate && (
                                        <div className="bg-white/70 rounded-lg p-3 space-y-2">
                                          <div className="flex items-center gap-2 text-xs text-gray-700">
                                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                            <span className="font-medium">Assigned:</span>
                                            <span>{new Date(approver.assignedDate).toLocaleString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}</span>
                                          </div>
                                          {approver.approvedDate && (
                                            <div className="flex items-center gap-2 text-xs text-gray-700">
                                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                              <span className="font-medium">Completed:</span>
                                              <span>{new Date(approver.approvedDate).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              })}</span>
                                            </div>
                                          )}
                                          {approver.rejectedDate && (
                                            <div className="flex items-center gap-2 text-xs text-gray-700">
                                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                                              <span className="font-medium">Rejected:</span>
                                              <span>{new Date(approver.rejectedDate).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              })}</span>
                                            </div>
                                          )}
                                          {approver.timeTaken && (
                                            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 rounded px-2 py-1">
                                              <Timer className="w-3.5 h-3.5" />
                                              <span>{approver.timeTaken}</span>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Comments */}
                                      {approver.comments && (
                                        <div className="mt-3 bg-white rounded-lg border border-gray-200 p-3">
                                          <div className="flex items-start gap-2">
                                            <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                              <p className="text-xs font-semibold text-gray-700 mb-1">Comments:</p>
                                              <p className="text-sm text-gray-600 italic">"{approver.comments}"</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Remind Button */}
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

                            {/* Flow Connector */}
                            {!isLast && (
                              <div className="flex justify-center my-2">
                                <div className="flex flex-col items-center">
                                  <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Legacy Approval Details (fallback) */}
                {viewingRequest.status === 'approved' && !viewingRequest.approvalFlow && (
                  <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-900 mb-1">Approved by {viewingRequest.approvedBy}</p>
                          <p className="text-sm text-gray-600">
                            On {new Date(viewingRequest.approvedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {viewingRequest.status === 'rejected' && !viewingRequest.approvalFlow && (
                  <Card className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <XCircle className="w-6 h-6 text-red-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-red-900 mb-1">Rejected by {viewingRequest.rejectedBy}</p>
                          <p className="text-sm text-gray-600 mb-3">
                            On {new Date(viewingRequest.rejectedDate).toLocaleDateString()}
                          </p>
                          {viewingRequest.rejectionReason && (
                            <div className="bg-white rounded-lg border border-red-200 p-3">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Reason:</p>
                              <p className="text-sm text-gray-700">{viewingRequest.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <Button 
                variant="outline"
                onClick={() => setViewingRequest(null)}
                className="border-gray-300 hover:bg-gray-100"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeeApprovals;
