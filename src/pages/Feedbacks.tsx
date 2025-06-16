
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Calendar, Bell, Search, Filter, CheckCircle, XCircle, Clock, BarChart3 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import LeaveChart from '@/components/LeaveChart';
import LeaveRequestDetails from '@/components/LeaveRequestDetails';
import FeedbackDetails from '@/components/FeedbackDetails';

interface Employee {
  id: string;
  name: string;
  position: string | null;
  profile_image_url: string | null;
  department_id: string | null;
}

interface Department {
  id: string;
  name: string;
}

interface Feedback {
  id: string;
  type: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  employee: Employee;
  department: Department | null;
}

interface LeaveRequest {
  id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  employee: Employee;
  department: Department | null;
}

const Feedbacks = () => {
  const [activeTab, setActiveTab] = useState('feedbacks');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const queryClient = useQueryClient();

  // Fetch feedbacks
  const { data: feedbacks = [], isLoading: feedbacksLoading } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedbacks')
        .select(`
          *,
          employee:employees(
            id,
            name,
            position,
            profile_image_url,
            department_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get department info for each employee
      const feedbacksWithDepartments = await Promise.all(
        data.map(async (feedback) => {
          if (feedback.employee?.department_id) {
            const { data: department } = await supabase
              .from('departments')
              .select('id, name')
              .eq('id', feedback.employee.department_id)
              .single();
            
            return {
              ...feedback,
              department
            };
          }
          return {
            ...feedback,
            department: null
          };
        })
      );
      
      return feedbacksWithDepartments;
    }
  });

  // Fetch leave requests
  const { data: leaveRequests = [], isLoading: leavesLoading } = useQuery({
    queryKey: ['leave_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employee:employees(
            id,
            name,
            position,
            profile_image_url,
            department_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get department info for each employee
      const leavesWithDepartments = await Promise.all(
        data.map(async (leave) => {
          if (leave.employee?.department_id) {
            const { data: department } = await supabase
              .from('departments')
              .select('id, name')
              .eq('id', leave.employee.department_id)
              .single();
            
            return {
              ...leave,
              department
            };
          }
          return {
            ...leave,
            department: null
          };
        })
      );
      
      return leavesWithDepartments;
    }
  });

  // Update leave request status
  const updateLeaveStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status,
          admin_notes: notes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin-id' // In real app, use actual admin ID
        })
        .eq('id', id);

      if (error) throw error;

      // Create notification for employee
      const leaveRequest = leaveRequests.find(l => l.id === id);
      if (leaveRequest) {
        await supabase.from('notifications').insert({
          recipient_id: leaveRequest.employee.id,
          type: 'leave_status',
          title: `Leave Request ${status}`,
          message: `Your leave request from ${leaveRequest.start_date} to ${leaveRequest.end_date} has been ${status}.${notes ? ` Admin notes: ${notes}` : ''}`
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave_requests'] });
      toast({
        title: "Success",
        description: "Leave request updated successfully"
      });
      setSelectedLeave(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update leave request",
        variant: "destructive"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      reviewed: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800"
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800"
    };
    return priorityColors[priority as keyof typeof priorityColors] || "bg-gray-100 text-gray-800";
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    const matchesType = typeFilter === 'all' || feedback.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredLeaves = leaveRequests.filter(leave => {
    const matchesSearch = leave.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.leave_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (feedbacksLoading || leavesLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading feedbacks and leave requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Feedbacks & Leave Management</h1>
              <p className="text-gray-600 mt-1">Manage employee feedbacks, memos, and leave requests</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feedbacks" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Feedbacks
              </TabsTrigger>
              <TabsTrigger value="leaves" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Leave Requests
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 flex-1 min-w-64">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {activeTab === 'feedbacks' && (
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="memo">Memo</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <TabsContent value="feedbacks" className="space-y-4">
              <div className="grid gap-4">
                {filteredFeedbacks.map((feedback) => (
                  <Card key={feedback.id} className="hover:shadow-md transition-shadow cursor-pointer" 
                        onClick={() => setSelectedFeedback(feedback)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <img
                            src={feedback.employee.profile_image_url || '/placeholder.svg'}
                            alt={feedback.employee.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{feedback.subject}</h3>
                              <Badge className={`text-xs ${getPriorityBadge(feedback.priority)}`}>
                                {feedback.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              From: {feedback.employee.name} • {feedback.department?.name || 'No Department'}
                            </p>
                            <p className="text-sm text-gray-700 line-clamp-2">{feedback.message}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={`${getStatusBadge(feedback.status)}`}>
                            {feedback.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(feedback.created_at)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leaves" className="space-y-4">
              <div className="grid gap-4">
                {filteredLeaves.map((leave) => (
                  <Card key={leave.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <img
                            src={leave.employee.profile_image_url || '/placeholder.svg'}
                            alt={leave.employee.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                                  onClick={() => {
                                    setSelectedEmployee(leave.employee.id);
                                    setShowChart(true);
                                  }}>
                                {leave.employee.name}
                              </h3>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedEmployee(leave.employee.id);
                                  setShowChart(true);
                                }}
                                className="text-xs"
                              >
                                <BarChart3 className="w-3 h-3 mr-1" />
                                View Chart
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1)} Leave • 
                              {leave.days_requested} days • 
                              {formatDate(leave.start_date)} to {formatDate(leave.end_date)}
                            </p>
                            <p className="text-sm text-gray-700">{leave.reason}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={`${getStatusBadge(leave.status)}`}>
                            {leave.status}
                          </Badge>
                          <div className="flex gap-2">
                            {leave.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedLeave(leave)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Review
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedLeave(leave)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Notification management interface coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Feedback Details Dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          {selectedFeedback && <FeedbackDetails feedback={selectedFeedback} />}
        </DialogContent>
      </Dialog>

      {/* Leave Request Details Dialog */}
      <Dialog open={!!selectedLeave} onOpenChange={() => setSelectedLeave(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <LeaveRequestDetails 
              leaveRequest={selectedLeave} 
              onStatusUpdate={updateLeaveStatus.mutate}
              isUpdating={updateLeaveStatus.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Employee Leave Chart Dialog */}
      <Dialog open={showChart} onOpenChange={setShowChart}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Employee Leave History</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <LeaveChart employeeId={selectedEmployee} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Feedbacks;
