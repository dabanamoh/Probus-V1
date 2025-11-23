
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Badge } from '../../../shared/ui/badge';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Textarea } from '../../../shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select';
import { Calendar, MapPin, User, AlertTriangle, FileText, Users, MessageSquare } from 'lucide-react';

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
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
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

  if (!incident) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No incident data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with Reporter Info */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={incident.employee?.profile_image_url || '/placeholder.svg'}
            alt={incident.employee?.name || 'Unknown'}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {incident.employee?.name || 'Unknown Employee'}
            </h2>
            <p className="text-lg text-gray-700">{incident.employee?.position || 'No Position'}</p>
            <p className="text-sm text-gray-600">
              <strong>Department:</strong> {incident.employee?.department?.name || 'No Department'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Level:</strong> Employee Level Information
            </p>
            <p className="text-sm text-gray-600">
              <strong>Qualification:</strong> Employee Qualification
            </p>
            <p className="text-sm text-gray-600">
              <strong>Certifications:</strong> Employee Certifications
            </p>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            View Profile
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Date Reported</p>
            <p className="font-medium">{formatDate(incident.date_reported)}</p>
          </div>
          <div>
            <p className="text-gray-600">Incident Type</p>
            <p className="font-medium capitalize">{incident.incident_type}</p>
          </div>
          <div>
            <p className="text-gray-600">Location</p>
            <p className="font-medium">{incident.location || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <span className={getStatusBadge(incident.status)}>
              {incident.status ? incident.status.charAt(0).toUpperCase() + incident.status.slice(1) : 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={incident.description || 'No description available.'}
                readOnly
                className="min-h-[200px] bg-gray-50"
              />
            </CardContent>
          </Card>

          {/* Parties Involved */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Parties Involved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={incident.employee?.profile_image_url || '/placeholder.svg'}
                      alt="Reporter"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{incident.employee?.name}</p>
                      <p className="text-sm text-gray-600">Level: Employee</p>
                      <p className="text-sm text-gray-600">Position: {incident.employee?.position}</p>
                      <p className="text-sm text-gray-600">Age: Not Available</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 bg-blue-100">
                    Request Statement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evidence */}
          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Create new Field
              </Button>
            </CardContent>
          </Card>

          {/* Investigation Table */}
          <Card>
            <CardContent className="p-6">
              <div className="bg-blue-500 text-white p-3 rounded-t-lg">
                <div className="grid grid-cols-6 gap-4 text-sm font-medium">
                  <div>Employee</div>
                  <div>Role (Risk) %</div>
                  <div>Comment</div>
                  <div>Investigation_Council</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
              </div>
              
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="grid grid-cols-6 gap-4 p-3 border-b text-sm items-center">
                  <Select>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee1">Employee 1</SelectItem>
                      <SelectItem value="employee2">Employee 2</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input 
                    placeholder="Type your comment about the verdict here"
                    className="h-8 text-xs"
                  />
                  
                  <div className="text-xs">Accra - Ghana</div>
                  
                  <Select>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select Verdict" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guilty">Guilty</SelectItem>
                      <SelectItem value="innocent">Innocent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              
              <div className="flex gap-2 p-3">
                <Button size="sm" variant="outline">New Investigation Report</Button>
                <Button size="sm" variant="outline">Notify Managers</Button>
              </div>
            </CardContent>
          </Card>

          {/* Give Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Give Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Enter your feedback here..."
                className="min-h-[100px]"
              />
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Save
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status and Details */}
        <div className="space-y-6">
          {/* Incident Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Incident Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Incident Type</label>
                <p className="text-gray-800 capitalize">{incident.incident_type || 'Unknown'}</p>
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
            </CardContent>
          </Card>

          {/* Incident Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Incident Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Valid</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Invalid</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
