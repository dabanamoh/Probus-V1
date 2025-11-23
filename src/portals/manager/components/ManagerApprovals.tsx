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
  const [selectedApproval, setSelectedApproval] = useState<ApprovalWithDetails | null>(null);
  const [isFlowchartOpen, setIsFlowchartOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    type: 'all'
  });

  // Fetch approvals data - manager specific (only team approvals)
  const { data: approvalsData, isLoading: approvalsLoading, isError: approvalsError, error: approvalsErrorDetails, refetch: refetchApprovals } = useQuery({
    queryKey: ['manager-approvals'],
    queryFn: async () => {
      try {
        console.log('Fetching manager approvals data...');
        // In a real app, this would filter by the manager's team members
        const { data, error } = await localDb
          .from('approvals')
          .select(`
            *,
            employee:employees(name, position),
            department:departments(name)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Manager approvals data fetch error:', error);
          throw error;
        }
        console.log('Manager approvals data fetched:', data);
        return data as unknown as ApprovalWithDetails[];
      } catch (error) {
        console.error('Error fetching manager approvals data:', error);
        throw error;
      }
    },
    retry: false
  });

  // Fetch employees with full details for approver information
  const { data: employeesData } = useQuery({
    queryKey: ['employees-for-approvers'],
    queryFn: async () => {
      try {
        const { data, error } = await localDb
          .from('employees')
          .select(`
            id, 
            name, 
            position, 
            department_id,
            profile_image_url,
            departments (name)
          `)
          .order('name');

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
    },
    retry: false
  });

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

  // Check if there are any errors
  if (approvalsError) {
    return (
      <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manager Approvals</h1>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Approvals Data</h2>
            <p className="text-red-700 mb-4">
              There was an error loading the approvals data. Please try refreshing the page.
            </p>
            {approvalsErrorDetails && (
              <div className="text-left bg-red-100 p-3 rounded mb-4">
                <p className="font-medium text-red-800">Error Details:</p>
                <p className="text-red-700 text-sm">{approvalsErrorDetails?.message || 'Unknown error'}</p>
              </div>
            )}
            <Button onClick={() => refetchApprovals()} className="bg-red-600 hover:bg-red-700">
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                      filteredApprovals.map((approval: ApprovalWithDetails) => (
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
