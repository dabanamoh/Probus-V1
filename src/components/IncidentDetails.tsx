
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, AlertTriangle } from 'lucide-react';

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

interface Incident {
  id: string;
  incident_type: string;
  description: string;
  date_reported: string;
  location: string | null;
  status: 'pending' | 'resolved' | 'invalid';
  employee: Employee;
}

interface IncidentDetailsProps {
  incident: Incident;
}

const IncidentDetails = ({ incident }: IncidentDetailsProps) => {
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
      case 'resolved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'invalid':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Reporter Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Reporter Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <img
              src={incident.employee?.profile_image_url || '/placeholder.svg'}
              alt={incident.employee?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {incident.employee?.name}
              </h3>
              <p className="text-gray-600">{incident.employee?.position}</p>
              <p className="text-sm text-gray-500">
                {incident.employee?.department?.name || 'No Department'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Incident Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Incident Type</label>
              <p className="text-gray-800 capitalize">{incident.incident_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <span className={getStatusBadge(incident.status)}>
                  {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date Reported</label>
              <p className="text-gray-800 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(incident.date_reported)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="text-gray-800 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {incident.location || 'Not specified'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Incident Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{incident.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentDetails;
