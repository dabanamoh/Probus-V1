
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, User } from 'lucide-react';

interface ResignationDetailsProps {
  resignation: {
    id: string;
    request_type: 'resignation' | 'termination';
    years_of_service: number;
    request_date: string;
    status: 'pending' | 'valid' | 'invalid';
    description: string;
    documents_url: string;
    employee: {
      id: string;
      name: string;
      position: string;
      profile_image_url: string;
      department: {
        name: string;
      } | null;
    };
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

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'valid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'invalid':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleDownload = () => {
    if (resignation.documents_url) {
      window.open(resignation.documents_url, '_blank');
    }
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
          <div className="flex items-center gap-4">
            <img
              src={resignation.employee.profile_image_url || '/placeholder.svg'}
              alt={resignation.employee.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {resignation.employee.name}
              </h3>
              <p className="text-gray-600">{resignation.employee.position}</p>
              <p className="text-sm text-gray-500">
                {resignation.employee.department?.name || 'No Department'}
              </p>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Request Type</label>
              <p className="text-gray-800 capitalize">{resignation.request_type}</p>
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
              <label className="text-sm font-medium text-gray-500">Request Date</label>
              <p className="text-gray-800 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(resignation.request_date)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Years of Service</label>
              <p className="text-gray-800">
                {resignation.years_of_service} {resignation.years_of_service === 1 ? 'year' : 'years'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {resignation.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{resignation.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      {resignation.documents_url && (
        <Card>
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-gray-600" />
                <span className="text-sm text-gray-700">Supporting Document</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResignationDetails;
