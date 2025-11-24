import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db';
import { Search, Filter, Eye, Calendar, User, FileText, CheckCircle, Clock, Edit, Users, Download, File, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Badge } from "../../shared/ui/badge";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shared/ui/table";
import { Tabs, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../shared/ui/dialog";
import { Tables } from '@/integrations/local-db/types';

type ApprovalWithDetails = Tables<'approvals'> & {
  employee?: { name: string; position: string | null };
  department?: { name: string };
};

const ManagerApprovals = () => {
  const [activeTab, setActiveTab] = useState('todo');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null);
  const [isFlowchartOpen, setIsFlowchartOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    type: 'all'
  });

  // Mock approvals data for manager - Team requests
  const mockApprovals = [
    {
      id: 'MGR001',
      type: 'leave',
      employee: { name: 'Sarah Johnson', position: 'Senior Developer' },
      title: 'Annual Leave Request',
      description: 'Christmas vacation - 2 weeks',
      created_at: '2024-11-20T09:00:00',
      status: 'pending',
      priority: 'medium',
      department: { name: 'Engineering' },
      employee_id: 'emp-001',
      current_approver_id: '550e8400-e29b-41d4-a716-446655440000',
      approvers_completed: [],
      requestedDates: 'Dec 23, 2024 - Jan 5, 2025',
      days: 10,
      approvalFlow: [
        {
          id: '1',
          approverName: 'You (Manager)',
          approverRole: 'Engineering Manager',
          approverDepartment: 'Engineering',
          status: 'pending',
          order: 1,
          assignedDate: '2024-11-20T09:00:00',
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
        }
      ]
    },
    {
      id: 'MGR002',
      type: 'expense',
      employee: { name: 'Mike Chen', position: 'Marketing Specialist' },
      title: 'Client Dinner Expense',
      description: 'Business dinner with key client - Project Alpha',
      created_at: '2024-11-19T14:30:00',
      status: 'pending',
      priority: 'high',
      department: { name: 'Marketing' },
      employee_id: 'emp-002',
      current_approver_id: '550e8400-e29b-41d4-a716-446655440000',
      approvers_completed: [],
      amount: '$350.00',
      receiptDate: 'Nov 18, 2024',
      approvalFlow: [
        {
          id: '1',
          approverName: 'You (Manager)',
          approverRole: 'Marketing Manager',
          approverDepartment: 'Marketing',
          status: 'pending',
          order: 1,
          assignedDate: '2024-11-19T14:30:00',
          timeTaken: null,
          comments: ''
        },
        {
          id: '2',
          approverName: 'David Kim',
          approverRole: 'Finance Manager',
          approverDepartment: 'Finance',
          status: 'waiting',
          order: 2,
          assignedDate: null,
          timeTaken: null,
          comments: ''
        }
      ]
    },
    {
      id: 'MGR003',
      type: 'overtime',
      employee: { name: 'Emily Davis', position: 'Junior Developer' },
      title: 'Weekend Overtime Request',
      description: 'Critical bug fixes required for production release',
      created_at: '2024-11-21T10:15:00',
      status: 'pending',
      priority: 'high',
      department: { name: 'Engineering' },
      employee_id: 'emp-003',
      current_approver_id: '550e8400-e29b-41d4-a716-446655440000',
      approvers_completed: [],
      requestedHours: 8,
      requestedDate: 'Nov 23, 2024',
      approvalFlow: [
        {
          id: '1',
          approverName: 'You (Manager)',
          approverRole: 'Engineering Manager',
          approverDepartment: 'Engineering',
          status: 'pending',
          order: 1,
          assignedDate: '2024-11-21T10:15:00',
          timeTaken: null,
          comments: ''
        }
      ]
    },
    {
      id: 'MGR004',
      type: 'leave',
      employee: { name: 'Robert Wilson', position: 'Sales Representative' },
      title: 'Sick Leave',
      description: 'Medical appointment and recovery',
      created_at: '2024-11-18T08:00:00',
      status: 'approved',
      priority: 'medium',
      department: { name: 'Sales' },
      employee_id: 'emp-004',
      current_approver_id: null,
      approvers_completed: ['550e8400-e29b-41d4-a716-446655440000'],
      requestedDates: 'Nov 18-19, 2024',
      days: 2,
      approvalFlow: [
        {
          id: '1',
          approverName: 'You (Manager)',
          approverRole: 'Sales Manager',
          approverDepartment: 'Sales',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-18T08:00:00',
          approvedDate: '2024-11-18T09:30:00',
          timeTaken: '1 hour 30 minutes',
          comments: 'Approved. Hope you feel better soon.'
        },
        {
          id: '2',
          approverName: 'Lisa Brown',
          approverRole: 'HR Manager',
          approverDepartment: 'Human Resources',
          status: 'approved',
          order: 2,
          assignedDate: '2024-11-18T09:30:00',
          approvedDate: '2024-11-18T11:00:00',
          timeTaken: '1 hour 30 minutes',
          comments: 'Processed. Get well soon.'
        }
      ]
    },
    {
      id: 'MGR005',
      type: 'equipment',
      employee: { name: 'Jennifer Martinez', position: 'UX Designer' },
      title: 'New MacBook Pro Request',
      description: 'Current laptop is 4 years old and performance is degraded',
      created_at: '2024-11-17T13:20:00',
      status: 'pending',
      priority: 'low',
      department: { name: 'Design' },
      employee_id: 'emp-005',
      current_approver_id: '550e8400-e29b-41d4-a716-446655440000',
      approvers_completed: [],
      estimatedCost: '$2,499',
      justification: 'Running design software is slow, affecting productivity',
      approvalFlow: [
        {
          id: '1',
          approverName: 'You (Manager)',
          approverRole: 'Design Manager',
          approverDepartment: 'Design',
          status: 'pending',
          order: 1,
          assignedDate: '2024-11-17T13:20:00',
          timeTaken: null,
          comments: ''
        },
        {
          id: '2',
          approverName: 'David Kim',
          approverRole: 'Finance Manager',
          approverDepartment: 'Finance',
          status: 'waiting',
          order: 2,
          assignedDate: null,
          timeTaken: null,
          comments: ''
        },
        {
          id: '3',
          approverName: 'IT Department',
          approverRole: 'IT Procurement',
          approverDepartment: 'IT',
          status: 'waiting',
          order: 3,
          assignedDate: null,
          timeTaken: null,
          comments: ''
        }
      ]
    },
    {
      id: 'MGR006',
      type: 'training',
      employee: { name: 'Alex Thompson', position: 'Data Analyst' },
      title: 'AWS Certification Course',
      description: 'Advanced AWS Solutions Architect certification training',
      created_at: '2024-11-16T11:00:00',
      status: 'approved',
      priority: 'medium',
      department: { name: 'Data' },
      employee_id: 'emp-006',
      current_approver_id: null,
      approvers_completed: ['550e8400-e29b-41d4-a716-446655440000'],
      courseName: 'AWS Solutions Architect - Professional',
      duration: '5 days',
      cost: '$1,500',
      approvalFlow: [
        {
          id: '1',
          approverName: 'You (Manager)',
          approverRole: 'Data Manager',
          approverDepartment: 'Data',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-16T11:00:00',
          approvedDate: '2024-11-16T15:30:00',
          timeTaken: '4 hours 30 minutes',
          comments: 'Approved. This aligns with our cloud migration strategy.'
        },
        {
          id: '2',
          approverName: 'Lisa Brown',
          approverRole: 'HR Manager',
          approverDepartment: 'Human Resources',
          status: 'approved',
          order: 2,
          assignedDate: '2024-11-16T15:30:00',
          approvedDate: '2024-11-17T09:00:00',
          timeTaken: '17 hours 30 minutes',
          comments: 'Approved for professional development.'
        }
      ]
    },
    {
      id: 'MGR007',
      type: 'remote_work',
      employee: { name: 'Chris Anderson', position: 'Content Writer' },
      title: 'Permanent Remote Work Request',
      description: 'Request to work remotely full-time from home office',
      created_at: '2024-11-15T09:45:00',
      status: 'pending',
      priority: 'low',
      department: { name: 'Marketing' },
      employee_id: 'emp-007',
      current_approver_id: '550e8400-e29b-41d4-a716-446655440000',
      approvers_completed: [],
      reason: 'Relocation to different city for family reasons',
      proposedStartDate: 'Jan 1, 2025',
      approvalFlow: [
        {
          id: '1',
          approverName: 'You (Manager)',
          approverRole: 'Marketing Manager',
          approverDepartment: 'Marketing',
          status: 'pending',
          order: 1,
          assignedDate: '2024-11-15T09:45:00',
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
        }
      ]
    },
    {
      id: 'MGR008',
      type: 'expense',
      employee: { name: 'Patricia Lee', position: 'Account Manager' },
      title: 'Travel Expense - NYC Client Visit',
      description: 'Flight, hotel, and meals for 3-day client meeting',
      created_at: '2024-11-14T16:20:00',
      status: 'approved',
      priority: 'high',
      department: { name: 'Sales' },
      employee_id: 'emp-008',
      current_approver_id: null,
      approvers_completed: ['550e8400-e29b-41d4-a716-446655440000'],
      amount: '$1,850.00',
      travelDates: 'Nov 10-12, 2024',
      approvalFlow: [
        {
          id: '1',
          approverName: 'You (Manager)',
          approverRole: 'Sales Manager',
          approverDepartment: 'Sales',
          status: 'approved',
          order: 1,
          assignedDate: '2024-11-14T16:20:00',
          approvedDate: '2024-11-14T17:00:00',
          timeTaken: '40 minutes',
          comments: 'Approved. Important client relationship.'
        },
        {
          id: '2',
          approverName: 'David Kim',
          approverRole: 'Finance Manager',
          approverDepartment: 'Finance',
          status: 'approved',
          order: 2,
          assignedDate: '2024-11-14T17:00:00',
          approvedDate: '2024-11-15T10:30:00',
          timeTaken: '17 hours 30 minutes',
          comments: 'Approved. Reimbursement processed.'
        }
      ]
    }
  ];

  // Use mock data instead of database query
  const approvalsData = mockApprovals;
  const approvalsLoading = false;
  const approvalsError = false;

  // Mock employees data
  const employeesData = [
    { id: 'emp-001', name: 'Sarah Johnson', position: 'Senior Developer', department_id: 'dept-001', departments: { name: 'Engineering' } },
    { id: 'emp-002', name: 'Mike Chen', position: 'Marketing Specialist', department_id: 'dept-002', departments: { name: 'Marketing' } },
    { id: 'emp-003', name: 'Emily Davis', position: 'Junior Developer', department_id: 'dept-001', departments: { name: 'Engineering' } },
    { id: 'emp-004', name: 'Robert Wilson', position: 'Sales Representative', department_id: 'dept-003', departments: { name: 'Sales' } },
    { id: 'emp-005', name: 'Jennifer Martinez', position: 'UX Designer', department_id: 'dept-004', departments: { name: 'Design' } },
    { id: 'emp-006', name: 'Alex Thompson', position: 'Data Analyst', department_id: 'dept-005', departments: { name: 'Data' } },
    { id: 'emp-007', name: 'Chris Anderson', position: 'Content Writer', department_id: 'dept-002', departments: { name: 'Marketing' } },
    { id: 'emp-008', name: 'Patricia Lee', position: 'Account Manager', department_id: 'dept-003', departments: { name: 'Sales' } }
  ];

  // Get employee details by ID
  const getEmployeeDetails = (employeeId: string) => {
    if (!employeesData) return null;
    return employeesData.find(emp => emp.id === employeeId) || null;
  };

  // Filter approvals based on active tab and search criteria
  const filteredApprovals = approvalsData?.filter(approval => {
    // Tab-based filtering
    switch (activeTab) {
      case 'todo': {
        // My Todo - Approvals waiting for my action
        // For demo purposes, we'll simulate a current user ID
        const currentUserId = '550e8400-e29b-41d4-a716-446655440000'; // This would be dynamic in a real app
        return approval.current_approver_id === currentUserId && approval.status === 'pending';
      }
      case 'done': {
        // My Done - Approvals I've already processed
        const currentUserIdForDone = '550e8400-e29b-41d4-a716-446655440000'; // This would be dynamic in a real app
        return approval.approvers_completed.includes(currentUserIdForDone);
      }
      case 'team': {
        // My Team Requests - all requests from team members
        // In a real app, this would filter by the manager's team members
        return approval.employee_id !== '550e8400-e29b-41d4-a716-446655440000'; // Exclude manager's own requests
      }
      default:
        // All Requests - View all approvals
        break;
    }

    // Search filter
    if (searchTerm &&
      !approval.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !approval.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !approval.id.toLowerCase().includes(searchTerm.toLowerCase()) && // Process number/RBM
      !getEmployeeDetails(approval.employee_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Advanced filters
    if (advancedFilters.dateFrom && new Date(approval.created_at) < new Date(advancedFilters.dateFrom)) {
      return false;
    }

    if (advancedFilters.dateTo && new Date(approval.created_at) > new Date(advancedFilters.dateTo)) {
      return false;
    }

    if (advancedFilters.status !== 'all' && approval.status !== advancedFilters.status) {
      return false;
    }

    if (advancedFilters.type !== 'all' && approval.type !== advancedFilters.type) {
      return false;
    }

    return true;
  }) || [];

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  // Get current approver name
  const getCurrentApproverName = (approval: ApprovalWithDetails) => {
    if (!approval.current_approver_id) return 'None';
    const employee = getEmployeeDetails(approval.current_approver_id);
    return employee ? employee.name : 'Unknown';
  };

  // Handle advanced search filter changes
  const handleAdvancedFilterChange = (field: string, value: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset advanced filters
  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      dateFrom: '',
      dateTo: '',
      status: 'all',
      type: 'all'
    });
  };

  // Handle view flowchart
  const handleViewFlowchart = (approval: ApprovalWithDetails) => {
    setSelectedApproval(approval);
    setIsFlowchartOpen(true);
  };

  // Get approval context based on type
  const getApprovalContext = (approval: ApprovalWithDetails) => {
    const employee = getEmployeeDetails(approval.employee_id);

    switch (approval.type) {
      case 'leave_request': {
        // Try to extract leave details from description or use defaults
        const leaveDetails = approval.description?.match(/(\d+) days/) ?
          { days: approval.description.match(/(\d+) days/)?.[1] || '5', type: 'Annual Leave' } :
          { days: '5', type: 'Annual Leave' };

        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Leave Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Employee</p>
                <p className="font-medium">{employee?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{employee?.position || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Leave Type</p>
                <p className="font-medium">{leaveDetails.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{leaveDetails.days} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{approval.department?.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="font-medium">{new Date(approval.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Reason</p>
              <p className="font-medium">{approval.description}</p>
            </div>
          </div>
        );
      }

      case 'promotion': {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Promotion Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Employee</p>
                <p className="font-medium">{employee?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Position</p>
                <p className="font-medium">{employee?.position || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{approval.department?.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="font-medium">{new Date(approval.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Request Details</p>
              <p className="font-medium">{approval.description}</p>
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Requester</p>
                <p className="font-medium">{employee?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{employee?.position || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{approval.department?.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="font-medium">{new Date(approval.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Request Type</p>
                <p className="font-medium">{approval.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{approval.description}</p>
            </div>
          </div>
        );
    }
  };

  // Render single approval flowchart with enhanced details
  const renderApprovalFlowchart = (approval: ApprovalWithDetails) => {
    return (
      <div className="space-y-6">
        {/* Approval Header */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold">{approval.title}</h2>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Badge variant={getStatusVariant(approval.status)}>
              {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
            </Badge>
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="w-4 h-4 mr-1" />
              Submitted: {new Date(approval.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-1" />
              Requested by: {getEmployeeDetails(approval.employee_id)?.name || 'Unknown'}
            </div>
          </div>
        </div>

        {/* Approval Context */}
        <Card>
          <CardContent className="p-4">
            {getApprovalContext(approval)}
          </CardContent>
        </Card>

        {/* Approval Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button className="bg-green-600 hover:bg-green-700">
              Approve
            </Button>
            <Button variant="destructive">
              Reject
            </Button>
            <Button variant="outline">
              Request Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Check if there are any errors - removed for mock data
  // Using mock data so no error handling needed

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manager Approvals</h1>
        </div>

        {/* Loading indicator */}
        {approvalsLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 font-medium">Loading approvals...</p>
            </div>
          </div>
        )}

        {!approvalsLoading && (
          <>
            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-3 gap-2">
                <TabsTrigger value="todo" className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>My Todo</span>
                </TabsTrigger>
                <TabsTrigger value="done" className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>My Done</span>
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>My Team Requests</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search and Advanced Search */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by title, employee, or request number"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Advanced Search
                  </Button>
                  <Button className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                </div>

                {/* Advanced Search Filters */}
                {showAdvancedSearch && (
                  <div className="border-t pt-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Date From</label>
                        <Input
                          type="date"
                          value={advancedFilters.dateFrom}
                          onChange={(e) => handleAdvancedFilterChange('dateFrom', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Date To</label>
                        <Input
                          type="date"
                          value={advancedFilters.dateTo}
                          onChange={(e) => handleAdvancedFilterChange('dateTo', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                        <Select value={advancedFilters.status} onValueChange={(value) => handleAdvancedFilterChange('status', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Approval Type</label>
                        <Select value={advancedFilters.type} onValueChange={(value) => handleAdvancedFilterChange('type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="leave_request">Leave Request</SelectItem>
                            <SelectItem value="promotion">Promotion</SelectItem>
                            <SelectItem value="incident_report">Incident Report</SelectItem>
                            <SelectItem value="reward">Reward</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={resetAdvancedFilters}>
                        Reset
                      </Button>
                      <Button>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Approvals Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Current Approver</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApprovals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                          No approvals found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApprovals.map((approval: any) => (
                        <TableRow key={approval.id}>
                          <TableCell>
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          </TableCell>
                          <TableCell className="font-medium">{approval.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {approval.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getEmployeeDetails(approval.employee_id)?.name || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {approval.department?.name || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {getCurrentApproverName(approval)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(approval.status)}>
                              {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(approval.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedApproval(approval)}>
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Approval Details</DialogTitle>
                                  </DialogHeader>
                                  {selectedApproval && renderApprovalFlowchart(selectedApproval)}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerApprovals;
