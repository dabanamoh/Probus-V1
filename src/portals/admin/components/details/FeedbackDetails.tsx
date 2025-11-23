import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Badge } from '../../../shared/ui/badge';
import { Button } from '../../../shared/ui/button';
import { Textarea } from '../../../shared/ui/textarea';
import { Label } from '../../../shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select';
import { MessageSquare, User, Calendar, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db/client';
import { toast } from '@/hooks/use-toast';

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

interface FeedbackDetailsProps {
  feedback: Feedback;
}

const FeedbackDetails = ({ feedback }: FeedbackDetailsProps) => {
  const [status, setStatus] = useState(feedback.status);
  const [adminResponse, setAdminResponse] = useState('');
  const queryClient = useQueryClient();

  const updateFeedback = useMutation({
    mutationFn: async ({ status: newStatus, response }: { status: string; response?: string }) => {
      const result = await localDb
        .from('feedbacks')
        .eq('id', feedback.id)
        .update({ status: newStatus });

      if (result.error) throw result.error;

      // Create notification for employee if there's a response
      if (response && response.trim()) {
        await localDb.from('notifications').insert({
          title: `Response to your feedback: ${feedback.subject}`,
          message: response,
          type: 'feedback_response',
          user_id: feedback.employee.id,
          read: false
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast({
        title: "Success",
        description: "Feedback updated successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update feedback",
        variant: "destructive"
      });
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'complaint':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'suggestion':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'memo':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleStatusUpdate = () => {
    updateFeedback.mutate({
      status,
      response: adminResponse
    });
  };

  return (
    <div className="space-y-6">
      {/* Employee Info Header */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <img
            src={feedback.employee.profile_image_url || '/placeholder.svg'}
            alt={feedback.employee.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{feedback.employee.name}</h2>
            <p className="text-gray-700">{feedback.employee.position || 'No Position'}</p>
            <p className="text-sm text-gray-600">
              <strong>Department:</strong> {feedback.department?.name || 'No Department'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${getStatusBadge(feedback.status)} text-sm px-3 py-1`}>
              {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
            </Badge>
            <Badge className={`${getPriorityBadge(feedback.priority)} text-xs px-2 py-1`}>
              {feedback.priority} priority
            </Badge>
          </div>
        </div>
      </div>

      {/* Feedback Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getTypeIcon(feedback.type)}
              Feedback Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Type</Label>
              <p className="text-gray-800 capitalize">{feedback.type}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Subject</Label>
              <p className="text-gray-800">{feedback.subject}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Submitted</Label>
              <p className="text-gray-800">{formatDate(feedback.created_at)}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Priority Level</Label>
              <p className="text-gray-800 capitalize">{feedback.priority}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 whitespace-pre-wrap">{feedback.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Response Section */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Response</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Update Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="admin-response">Response to Employee (Optional)</Label>
            <Textarea
              id="admin-response"
              placeholder="Type your response to the employee. This will be sent as a notification..."
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>
          
          <Button
            onClick={handleStatusUpdate}
            disabled={updateFeedback.isPending}
            className="w-full"
          >
            {updateFeedback.isPending ? 'Updating...' : 'Update Feedback'}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatus('reviewed');
                setAdminResponse('Thank you for your feedback. We have reviewed your concerns and will take appropriate action.');
              }}
            >
              Mark as Reviewed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatus('resolved');
                setAdminResponse('Your feedback has been addressed and resolved. Thank you for bringing this to our attention.');
              }}
            >
              Mark as Resolved
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAdminResponse('We appreciate your suggestion and will consider implementing it in our future plans.');
              }}
            >
              Standard Response
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackDetails;
