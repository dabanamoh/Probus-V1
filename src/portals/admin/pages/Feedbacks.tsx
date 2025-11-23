import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db';
import { Input } from "../../shared/ui/input";
import { Button } from "../../shared/ui/button";
import { Search, Eye, MessageSquare, Calendar, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shared/ui/table";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "../../shared/ui/dialog";
import { Badge } from "../../shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import FeedbackDetails from '../components/details/FeedbackDetails';
import LeaveRequestDetails from '../../shared/forms/LeaveRequestDetails';
import IncidentDetails from '../components/details/IncidentDetails';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';

interface Department {
  id: string;
  name: string;
}

interface EmployeeData {
  id: string;
  name: string;
  position: string | null;
  profile_image_url: string | null;
  department_id: string | null;
  department?: Department;
}

interface FeedbackData {
  id: string;
  subject: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  created_at: string;
  employee_id: string;
  employee: EmployeeData;
  department?: Department;
}

interface LeaveRequestData {
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
  employee: EmployeeData;
  department?: Department;
}

interface IncidentData {
  id: string;
  incident_type: string;
  description: string;
  status: 'pending' | 'resolved' | 'invalid';
  date_reported: string;
  location: string | null;
  created_at: string;
  reporter_id: string;
  department_id: string | null;
  employee: EmployeeData;
  department?: Department;
}

const Feedbacks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveRequestData | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries for fetching data
  const { data: feedbacks, isLoading: feedbacksLoading } = useQuery({
    queryKey: ['feedbacks', searchTerm],
    queryFn: async () => {
      let query = localDb
        .from('feedbacks')
        .select(`
          *,
          employee:employees!feedbacks_employee_id_fkey(
            id,
            name,
            position,
            profile_image_url,
            department_id,
            department:departments(id, name)
          )
        `);

      if (searchTerm) {
        query = query.or(`subject.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).filter(feedback => feedback.employee).map(feedback => ({
        ...feedback,
        department: feedback.employee?.department || null
      })) as FeedbackData[];
    },
  });

  const { data: leaveRequests, isLoading: leaveRequestsLoading } = useQuery({
    queryKey: ['leave-requests', searchTerm],
    queryFn: async () => {
      let query = localDb
        .from('leave_requests')
        .select(`
          *,
          employee:employees!leave_requests_employee_id_fkey(
            id,
            name,
            position,
            profile_image_url,
            department_id,
            department:departments(id, name)
          )
        `);

      if (searchTerm) {
        query = query.or(`reason.ilike.%${searchTerm}%,leave_type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).filter(request => request.employee).map(request => ({
        ...request,
        department: request.employee?.department || null
      })) as LeaveRequestData[];
    },
  });

  const { data: incidents, isLoading: incidentsLoading } = useQuery({
    queryKey: ['incidents', searchTerm],
    queryFn: async () => {
      let query = localDb
        .from('incidents')
        .select(`
          *,
          employee:employees!incidents_reporter_id_fkey(
            id,
            name,
            position,
            profile_image_url,
            department_id,
            department:departments(id, name)
          )
        `);

      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,incident_type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).filter(incident => incident.employee).map(incident => ({
        ...incident,
        status: incident.status as 'pending' | 'resolved' | 'invalid',
        department: incident.employee?.department || null
      })) as IncidentData[];
    },
  });

  const updateLeaveRequestMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const queryBuilder = localDb.from('leave_requests');
      queryBuilder.eq('id', id);
      const { data, error } = await queryBuilder.update({
        status
      });

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

  const updateIncidentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const queryBuilder = localDb.from('incidents');
      queryBuilder.eq('id', id);
      const { data, error } = await queryBuilder.update({ status });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      toast({
        title: "Success",
        description: "Incident status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update incident status",
        variant: "destructive",
      });
      console.error('Error updating incident:', error);
    },
  });

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'approved':
      case 'resolved':
        return 'default';
      case 'rejected':
      case 'invalid':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewFeedback = (feedback: FeedbackData) => {
    setSelectedFeedback(feedback);
    document.getElementById('feedback-details-dialog')?.click();
  };

  const handleViewLeaveRequest = (request: LeaveRequestData) => {
    setSelectedLeaveRequest(request);
    document.getElementById('leave-request-details-dialog')?.click();
  };

  const handleViewIncident = (incident: IncidentData) => {
    setSelectedIncident(incident);
    document.getElementById('incident-details-dialog')?.click();
  };

  return (
    <DashboardLayout title="Feedback & Requests" subtitle="Probus">
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Feedback & Requests</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search feedback, leave requests, or incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mb-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Employee Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedbacksLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
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
                            <TableCell className="font-medium text-gray-900 max-w-xs truncate">
                              {feedback.subject}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{feedback.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getBadgeVariant(feedback.priority)}>
                                {feedback.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-700">
                              {formatDate(feedback.created_at)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                onClick={() => handleViewFeedback(feedback)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No feedback found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leave Requests Section */}
          <div className="mb-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Leave Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
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
                            <TableCell className="text-gray-700 max-w-xs truncate">
                              {formatDate(request.start_date)} - {formatDate(request.end_date)}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                              {request.days_requested}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getBadgeVariant(request.status)}>
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                onClick={() => handleViewLeaveRequest(request)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
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
              </CardContent>
            </Card>
          </div>

          {/* Incidents Section */}
          <div className="mb-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Reported Incidents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
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
                            <TableCell className="max-w-xs truncate text-gray-700">
                              {incident.description}
                            </TableCell>
                            <TableCell className="text-gray-700">
                              {formatDate(incident.date_reported)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getBadgeVariant(incident.status)}>
                                {incident.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                onClick={() => handleViewIncident(incident)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Feedback Details Dialog */}
      <Dialog>
        <DialogTrigger id="feedback-details-dialog" className="hidden" />
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Feedback Details</DialogTitle>
          {selectedFeedback && (
            <FeedbackDetails feedback={{ ...selectedFeedback, department: selectedFeedback.department || { id: '', name: '' } }} />
          )}
        </DialogContent>
      </Dialog>

      {/* Leave Request Details Dialog */}
      <Dialog>
        <DialogTrigger id="leave-request-details-dialog" className="hidden" />
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Leave Request Details</DialogTitle>
          {selectedLeaveRequest && (
            <LeaveRequestDetails
              leaveRequest={{ ...selectedLeaveRequest, department: selectedLeaveRequest.department || { id: '', name: '' } }}
              onStatusUpdate={(data) =>
                updateLeaveRequestMutation.mutate(data)
              }
              isUpdating={updateLeaveRequestMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Incident Details Dialog */}
      <Dialog>
        <DialogTrigger id="incident-details-dialog" className="hidden" />
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Incident Details</DialogTitle>
          {selectedIncident && (
            <IncidentDetails incident={{ ...selectedIncident, employee: { ...selectedIncident.employee, department: selectedIncident.employee.department || { id: '', name: '' } } }} />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Feedbacks;
