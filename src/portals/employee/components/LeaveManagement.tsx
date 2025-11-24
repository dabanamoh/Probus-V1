import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Textarea } from "../../shared/ui/textarea";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LeaveRequest {
  id: string;
  type: 'annual' | 'sick' | 'study' | 'casual' | 'maternity' | 'paternity' | 'other';
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewer?: string;
  rejectionReason?: string;
}

const LeaveManagement = () => {
  const { toast } = useToast();
  
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      type: 'annual',
      startDate: '2025-12-20',
      endDate: '2025-12-27',
      duration: 8,
      reason: 'Family vacation',
      status: 'approved',
      submittedAt: '2025-11-15T10:30:00Z',
      reviewedAt: '2025-11-16T14:20:00Z',
      reviewer: 'HR Manager'
    },
    {
      id: '2',
      type: 'sick',
      startDate: '2025-11-25',
      endDate: '2025-11-26',
      duration: 2,
      reason: 'Medical appointment',
      status: 'pending',
      submittedAt: '2025-11-20T09:15:00Z'
    }
  ]);

  const [newLeaveRequest, setNewLeaveRequest] = useState({
    type: 'annual' as 'annual' | 'sick' | 'study' | 'casual' | 'maternity' | 'paternity' | 'other',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLeaveRequest.startDate || !newLeaveRequest.endDate || !newLeaveRequest.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const startDate = new Date(newLeaveRequest.startDate);
    const endDate = new Date(newLeaveRequest.endDate);
    
    if (startDate > endDate) {
      toast({
        title: "Error",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const leaveRequest: LeaveRequest = {
      id: `leave-${Date.now()}`,
      ...newLeaveRequest,
      duration,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    setLeaveRequests([leaveRequest, ...leaveRequests]);
    setNewLeaveRequest({
      type: 'annual',
      startDate: '',
      endDate: '',
      reason: ''
    });

    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted for approval."
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Approved
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" /> Rejected
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" /> Pending
        </span>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Leave Management</CardTitle>
          <p className="text-gray-600 text-sm">Apply for leave and track your leave history</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-700">Annual Leave</p>
                  <p className="text-2xl font-bold text-blue-900">20 days</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-700">Used</p>
                  <p className="text-2xl font-bold text-green-900">8 days</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-lg border border-amber-200">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-amber-600 mr-3" />
                <div>
                  <p className="text-sm text-amber-700">Remaining</p>
                  <p className="text-2xl font-bold text-amber-900">12 days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <h3 className="py-4 text-blue-600 font-medium text-sm">Apply for Leave</h3>
          </div>

          <form onSubmit={handleLeaveSubmit} className="max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="leaveType" className="text-sm font-medium text-gray-700">Leave Type</Label>
                <select
                  id="leaveType"
                  value={newLeaveRequest.type}
                  onChange={(e) => setNewLeaveRequest({...newLeaveRequest, type: e.target.value as any})}
                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="study">Study Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="duration" className="text-sm font-medium text-gray-700">Leave Duration</Label>
                <Input
                  id="duration"
                  type="text"
                  value={`${newLeaveRequest.startDate && newLeaveRequest.endDate ? 
                    Math.ceil((new Date(newLeaveRequest.endDate).getTime() - new Date(newLeaveRequest.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0} days`}
                  readOnly
                  className="mt-1 bg-gray-50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newLeaveRequest.startDate}
                  onChange={(e) => setNewLeaveRequest({...newLeaveRequest, startDate: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newLeaveRequest.endDate}
                  onChange={(e) => setNewLeaveRequest({...newLeaveRequest, endDate: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="reason" className="text-sm font-medium text-gray-700">Reason for Leave</Label>
              <Textarea
                id="reason"
                rows={4}
                value={newLeaveRequest.reason}
                onChange={(e) => setNewLeaveRequest({...newLeaveRequest, reason: e.target.value})}
                className="mt-1"
                placeholder="Please provide a detailed reason for your leave request..."
                required
              />
            </div>
            
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              Submit Leave Request
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Leave History</CardTitle>
          <p className="text-gray-600 text-sm">View your past and pending leave requests</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {request.type} Leave
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.duration} day{request.duration > 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveManagement;
