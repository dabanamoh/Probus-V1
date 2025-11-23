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
  Briefcase
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
      estimatedCompletion: '2024-11-18'
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
      approvedDate: '2024-11-12'
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
      rejectionReason: 'Budget constraints for Q4. Please resubmit in Q1 2025.'
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
      approvedDate: '2024-11-01'
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
    console.log('Viewing request:', requestId);
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #3b82f6;z-index:9999;"><p style="margin:0;font-weight:600;color:#1e3a8a;font-size:14px;">Viewing request ${requestId}</p></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 2000);
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
    </div>
  );
};

export default EmployeeApprovals;
