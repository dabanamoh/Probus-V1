
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Eye, Filter, Users, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import FeedbackDetails from '@/components/FeedbackDetails';
import LeaveRequestDetails from '@/components/LeaveRequestDetails';
import { toast } from 'sonner';

interface Employee {
  id: string;
  name: string;
  position: string;
  profile_image_url: string;
  department_id: string;
}

interface Department {
  id: string;
  name: string;
}

interface Feedback {
  id: string;
  subject: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  created_at: string;
  employee_id: string;
  employee: Employee;
}

interface LeaveRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason: string;
  status: string;
  days_requested: number;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  admin_notes: string | null;
  updated_at: string;
  employee: Employee;
  department: Department;
}

const Feedbacks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'feedbacks' | 'leaves'>('feedbacks');

  const queryClient = useQueryClient();

  // Fetch feedbacks with proper employee relationship
  const { data: feedbacks, isLoading: feedbacksLoading } = useQuery({
    queryKey: ['feedbacks', searchTerm, statusFilter, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('feedbacks')
        .select(`
          *,
          employee:employee_id(id, name, position, profile_image_url, department_id)
        `);

      if (searchTerm) {
        query = query.or(`subject.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      
      // Filter out any feedbacks where employee data failed to load
      return (data || []).filter(feedback => 
        feedback.employee && 
        typeof feedback.employee === 'object' && 
        'id' in feedback.employee
      ) as Feedback[];
    },
  });

  // Fetch leave requests with proper relationships
  const { data: leaveRequests, isLoading: leavesLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employee:employees!leave_requests_employee_id_fkey(id, name, position, profile_image_url, department_id),
          department:employees!leave_requests_employee_id_fkey(departments!employees_department_id_fkey(id, name))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform and filter the data properly
      const validRequests = (data || []).filter(request => 
        request.employee && 
        typeof request.employee === 'object' && 
        'id' in request.employee
      ).map(request => ({
        ...request,
        department: request.department?.departments || { id: '', name: 'No Department' },
        employee: request.employee as Employee
      }));

      return validRequests as LeaveRequest[];
    },
  });

  // Update leave request status mutation
  const updateLeaveRequestMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('leave_requests')
        .update({
          status,
          admin_notes: notes || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin' // This should be the actual admin user ID in a real app
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave request updated successfully');
    },
    onError: (error) => {
      console.error('Error updating leave request:', error);
      toast.error('Failed to update leave request');
    },
  });

  // Fetch departments for filtering
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');
      if (error) throw error;
      return data as Department[];
    },
  });

  // Calculate statistics
  const feedbackStats = {
    total: feedbacks?.length || 0,
    pending: feedbacks?.filter(f => f.status === 'pending').length || 0,
    resolved: feedbacks?.filter(f => f.status === 'resolved').length || 0,
    highPriority: feedbacks?.filter(f => f.priority === 'high').length || 0,
  };

  const leaveStats = {
    total: leaveRequests?.length || 0,
    pending: leaveRequests?.filter(l => l.status === 'pending').length || 0,
    approved: leaveRequests?.filter(l => l.status === 'approved').length || 0,
    rejected: leaveRequests?.filter(l => l.status === 'rejected').length || 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (data: { id: string; status: string; notes?: string }) => {
    updateLeaveRequestMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Employee Feedback & Leave Management
          </h1>
          <p className="text-gray-600">Manage employee feedback and leave requests</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('feedbacks')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'feedbacks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="h-4 w-4 inline mr-2" />
                Feedbacks
              </button>
              <button
                onClick={() => setActiveTab('leaves')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leaves'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                Leave Requests
              </button>
            </nav>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {activeTab === 'feedbacks' ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feedbackStats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feedbackStats.pending}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feedbackStats.resolved}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feedbackStats.highPriority}</div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leaveStats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leaveStats.pending}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leaveStats.approved}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leaveStats.rejected}</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {activeTab === 'feedbacks' && (
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          {activeTab === 'feedbacks' ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Employee</TableHead>
                  <TableHead className="font-semibold text-gray-700">Subject</TableHead>
                  <TableHead className="font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Priority</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacksLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading feedbacks...
                    </TableCell>
                  </TableRow>
                ) : feedbacks && feedbacks.length > 0 ? (
                  feedbacks.map((feedback, index) => (
                    <TableRow 
                      key={feedback.id} 
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={feedback.employee?.profile_image_url || '/placeholder.svg'}
                            alt={feedback.employee?.name || 'Employee'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {feedback.employee?.name || 'Unknown Employee'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {feedback.employee?.position || 'No Position'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        <div className="max-w-xs truncate" title={feedback.subject}>
                          {feedback.subject}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {feedback.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${getPriorityColor(feedback.priority)}`}>
                          {feedback.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${getStatusColor(feedback.status)}`}>
                          {feedback.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedFeedback(feedback)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogTitle>Feedback Details</DialogTitle>
                            {selectedFeedback && (
                              <FeedbackDetails feedback={selectedFeedback} />
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No feedbacks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Employee</TableHead>
                  <TableHead className="font-semibold text-gray-700">Leave Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Duration</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Requested Date</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leavesLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading leave requests...
                    </TableCell>
                  </TableRow>
                ) : leaveRequests && leaveRequests.length > 0 ? (
                  leaveRequests.map((request, index) => (
                    <TableRow 
                      key={request.id} 
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={request.employee?.profile_image_url || '/placeholder.svg'}
                            alt={request.employee?.name || 'Employee'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {request.employee?.name || 'Unknown Employee'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.department?.name || 'No Department'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {request.leave_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {request.days_requested} days
                        <div className="text-sm text-gray-500">
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${getStatusColor(request.status)}`}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {new Date(request.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLeaveRequest(request)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogTitle>Leave Request Details</DialogTitle>
                            {selectedLeaveRequest && (
                              <LeaveRequestDetails 
                                leaveRequest={selectedLeaveRequest}
                                onStatusUpdate={handleStatusUpdate}
                                isUpdating={updateLeaveRequestMutation.isPending}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No leave requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;
