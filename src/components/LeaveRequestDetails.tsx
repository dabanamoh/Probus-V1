
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Calendar, User, Clock, FileText } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string | null;
  profile_image_url: string | null;
  department: {
    id: string;
    name: string;
  } | null;
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
}

interface LeaveRequestDetailsProps {
  leaveRequest: LeaveRequest;
  onStatusUpdate: (data: { id: string; status: string; notes?: string }) => void;
  isUpdating: boolean;
}

const LeaveRequestDetails = ({ leaveRequest, onStatusUpdate, isUpdating }: LeaveRequestDetailsProps) => {
  const [adminNotes, setAdminNotes] = useState(leaveRequest.admin_notes || '');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  };

  const calculateWorkingDays = () => {
    const start = new Date(leaveRequest.start_date);
    const end = new Date(leaveRequest.end_date);
    let workingDays = 0;
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) { // Exclude weekends
        workingDays++;
      }
    }
    
    return workingDays;
  };

  const handleApprove = () => {
    onStatusUpdate({
      id: leaveRequest.id,
      status: 'approved',
      notes: adminNotes
    });
  };

  const handleReject = () => {
    onStatusUpdate({
      id: leaveRequest.id,
      status: 'rejected',
      notes: adminNotes
    });
  };

  return (
    <div className="space-y-6">
      {/* Employee Info Header */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <img
            src={leaveRequest.employee.profile_image_url || '/placeholder.svg'}
            alt={leaveRequest.employee.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{leaveRequest.employee.name}</h2>
            <p className="text-gray-700">{leaveRequest.employee.position || 'No Position'}</p>
            <p className="text-sm text-gray-600">
              <strong>Department:</strong> {leaveRequest.employee.department?.name || 'No Department'}
            </p>
          </div>
          <Badge className={`${getStatusBadge(leaveRequest.status)} text-sm px-3 py-1`}>
            {leaveRequest.status.charAt(0).toUpperCase() + leaveRequest.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Leave Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Leave Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Leave Type</Label>
              <p className="text-gray-800 capitalize">{leaveRequest.leave_type}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Start Date</Label>
              <p className="text-gray-800">{formatDate(leaveRequest.start_date)}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">End Date</Label>
              <p className="text-gray-800">{formatDate(leaveRequest.end_date)}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Duration</Label>
              <p className="text-gray-800">{leaveRequest.days_requested} days requested</p>
              <p className="text-sm text-gray-600">{calculateWorkingDays()} working days</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Request Date</Label>
              <p className="text-gray-800">{formatDate(leaveRequest.created_at)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Reason
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800 whitespace-pre-wrap">{leaveRequest.reason}</p>
          </CardContent>
        </Card>
      </div>

      {/* Review Section */}
      {leaveRequest.status === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="admin-notes">Admin Notes (Optional)</Label>
              <Textarea
                id="admin-notes"
                placeholder="Add any notes or comments about this leave request..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleApprove}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isUpdating ? 'Processing...' : 'Approve Request'}
              </Button>
              <Button
                onClick={handleReject}
                disabled={isUpdating}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                {isUpdating ? 'Processing...' : 'Reject Request'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review History */}
      {leaveRequest.status !== 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Review Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-500">Reviewed Date</Label>
              <p className="text-gray-800">
                {leaveRequest.reviewed_at ? formatDate(leaveRequest.reviewed_at) : 'Not available'}
              </p>
            </div>
            
            {leaveRequest.admin_notes && (
              <div>
                <Label className="text-sm font-medium text-gray-500">Admin Notes</Label>
                <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                  {leaveRequest.admin_notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeaveRequestDetails;
