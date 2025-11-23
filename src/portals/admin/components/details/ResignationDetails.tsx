import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Badge } from '../../../shared/ui/badge';
import { Button } from '../../../shared/ui/button';
import { FileText, Download, Calendar, User, Clock, Mail, Phone } from 'lucide-react';

interface ResignationDetailsProps {
  resignation: {
    id: string;
    employee_id: string;
    type: 'resignation' | 'termination';
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'terminated';
    requested_date: string;
    effective_date: string | null;
    created_at: string;
    updated_at: string;
    employee: {
      id: string;
      name: string;
      position: string;
      profile_image_url: string;
      department: {
        name: string;
      } | null;
      date_of_resumption: string;
      email?: string;
      phone?: string;
    } | null;
    years_of_service?: number;
  };
}

const ResignationDetails = ({ resignation }: ResignationDetailsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'terminated':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'rejected':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    return type === 'resignation' 
      ? `${baseClasses} bg-blue-100 text-blue-800` 
      : `${baseClasses} bg-purple-100 text-purple-800`;
  };

  // Calculate years of service if not provided
  const calculateYearsOfService = () => {
    if (resignation.years_of_service !== undefined) {
      return resignation.years_of_service;
    }
    
    if (!resignation.employee || !resignation.employee.date_of_resumption) return 0;
    
    const startDate = new Date(resignation.employee.date_of_resumption);
    const currentDate = new Date();
    return currentDate.getFullYear() - startDate.getFullYear();
  };

  return (
    <div className="space-y-6">
      {/* Employee Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Employee Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <img
              src={resignation.employee?.profile_image_url || '/placeholder.svg'}
              alt={resignation.employee?.name || 'Unknown Employee'}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {resignation.employee?.name || 'Unknown Employee'}
              </h3>
              <p className="text-gray-600">{resignation.employee?.position || 'Unknown Position'}</p>
              <p className="text-sm text-gray-500">
                {resignation.employee?.department?.name || 'No Department'}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {resignation.employee?.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-1" />
                    {resignation.employee.email}
                  </div>
                )}
                {resignation.employee?.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-1" />
                    {resignation.employee.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Request Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Request Type</label>
              <div className="mt-1">
                <span className={getTypeBadge(resignation.type)}>
                  {resignation.type.charAt(0).toUpperCase() + resignation.type.slice(1)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <span className={getStatusBadge(resignation.status)}>
                  {resignation.status.charAt(0).toUpperCase() + resignation.status.slice(1)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Request Date & Time</label>
              <p className="text-gray-800 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDateTime(resignation.requested_date)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Effective Date</label>
              <p className="text-gray-800 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {resignation.effective_date ? formatDateTime(resignation.effective_date) : 'Not set'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Years of Service</label>
              <p className="text-gray-800 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {calculateYearsOfService()} {calculateYearsOfService() === 1 ? 'year' : 'years'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-800 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDateTime(resignation.updated_at)}
              </p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Reason</label>
            <p className="text-gray-800 mt-1 whitespace-pre-wrap">
              {resignation.reason || 'No reason provided'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Supporting Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Supporting Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No documents attached to this request
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResignationDetails;
