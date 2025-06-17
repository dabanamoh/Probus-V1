import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Eye, MessageSquare, Calendar, Users, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackDetails from '@/components/FeedbackDetails';
import LeaveRequestDetails from '@/components/LeaveRequestDetails';
import IncidentDetails from '@/components/IncidentDetails';
import { useToast } from '@/hooks/use-toast';

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
  department?: Department;
}

interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string;
  status: string;
  created_at: string;
  admin_notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  employee: Employee;
  department: Department;
}

interface Incident {
  id: string;
  incident_type: string;
  description: string;
  status: 'pending' | 'resolved' | 'invalid';
  date_reported: string;
  location: string | null;
  created_at: string;
  reporter_id: string;
  department_id: string | null;
  employee: Employee;
  department: Department | null;
}

const Feedbacks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveRequest | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries for fetching data
  const { data: feedbacks, isLoading: feedbacksLoading } = useQuery({
    queryKey: ['feedbacks', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('feedbacks')
        .select(`
          *,
          employee:employees!feedbacks_employee_id_fkey(
            id,
            name,
            position,
            profile_image_url,
            department_id
          )
        `);

      if (searchTerm) {
        query = query.or(`subject.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data as Feedback[];
    },
  });

  const { data: leaveRequests, isLoading: leaveRequestsLoading } = useQuery({
    queryKey: ['leave-requests', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('leave_requests')
        .select(`
          *,
          employee:employees!leave_requests_employee_id_fkey(
            id,
            name,
            position,
            profile_image_url,
            department_id
          ),
          department:departments(
            id,
            name
          )
        `);

      if (searchTerm) {
        query = query.or(`reason.ilike.%${searchTerm}%,leave_type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).filter(request => request.employee && request.department) as LeaveRequest[];
    },
  });

  const { data: incidents, isLoading: incidentsLoading } = useQuery({
    queryKey: ['incidents', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('incidents')
        .select(`
          *,
          employee:employees!incidents_reporter_id_fkey(
            id,
            name,
            position,
            profile_image_url,
            department_id
          ),
          department:departments(
            id,
            name
          )
        `);

      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,incident_type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).map(incident => ({
        ...incident,
        status: incident.status as 'pending' | 'resolved' | 'invalid'
      })) as Incident[];
    },
  });

  const updateLeaveRequestMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('leave_requests')
        .update({
          status,
          admin_notes: notes || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin'
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast({
        title: "Success",
        description: "Leave request updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update leave request",
        variant: "destructive",
      });
      console.error('Error updating leave request:', error);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'resolved':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalFeedbacks = feedbacks?.length || 0;
  const totalLeaveRequests = leaveRequests?.length || 0;
  const totalIncidents = incidents?.length || 0;

  const pendingFeedbacks = feedbacks?.filter(f => f.status === 'pending').length || 0;
  const pendingLeaveRequests = leaveRequests?.filter(lr => lr.status === 'pending').length || 0;
  const pendingIncidents = incidents?.filter(i => i.status === 'pending').length || 0;

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Communications</h1>
          <p className="text-gray-600">Manage feedback, leave requests, and incidents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFeedbacks}</div>
              <p className="text-xs text-muted-foreground">
                {pendingFeedbacks} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLeaveRequests}</div>
              <p className="text-xs text-muted-foreground">
                {pendingLeaveRequests} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalIncidents}</div>
              <p className="text-xs text-muted-foreground">
                {pendingIncidents} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <form onSubmit={handleSearch} className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search communications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Feedback
            </h2>
          </div>
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
                    Loading feedback...
                  </TableCell>
                </TableRow>
              ) : feedbacks && feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={feedback.employee?.profile_image_url || '/placeholder.svg'}
                          alt={feedback.employee?.name || 'Employee'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {feedback.employee?.name || 'Unknown Employee'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {feedback.employee?.position || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">{feedback.subject}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{feedback.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={feedback.priority === 'high' ? 'destructive' : 'secondary'}>
                        {feedback.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(feedback.status)}>
                        {feedback.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatDate(feedback.created_at)}
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
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    No feedback found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Leave Requests Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Leave Requests
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Employee</TableHead>
                <TableHead className="font-semibold text-gray-700">Leave Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Duration</TableHead>
                <TableHead className="font-semibold text-gray-700">Start Date</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequestsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading leave requests...
                  </TableCell>
                </TableRow>
              ) : leaveRequests && leaveRequests.length > 0 ? (
                leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={request.employee?.profile_image_url || '/placeholder.svg'}
                          alt={request.employee?.name || 'Employee'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {request.employee?.name || 'Unknown Employee'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.employee?.position || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.leave_type}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {request.days_requested} days
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatDate(request.start_date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(request.status)}>
                        {request.status}
                      </Badge>
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
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogTitle>Leave Request Details</DialogTitle>
                          {selectedLeaveRequest && (
                            <LeaveRequestDetails 
                              leaveRequest={selectedLeaveRequest}
                              onStatusUpdate={(data) => 
                                updateLeaveRequestMutation.mutate(data)
                              }
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
        </div>

        {/* Incidents Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Incidents
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Reporter</TableHead>
                <TableHead className="font-semibold text-gray-700">Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Department</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Date</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidentsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading incidents...
                  </TableCell>
                </TableRow>
              ) : incidents && incidents.length > 0 ? (
                incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={incident.employee?.profile_image_url || '/placeholder.svg'}
                          alt={incident.employee?.name || 'Employee'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {incident.employee?.name || 'Unknown Employee'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {incident.employee?.position || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{incident.incident_type}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {incident.department?.name || 'No Department'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(incident.status)}>
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatDate(incident.date_reported)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedIncident(incident)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogTitle>Incident Details</DialogTitle>
                          {selectedIncident && (
                            <IncidentDetails incident={selectedIncident} />
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No incidents found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;
