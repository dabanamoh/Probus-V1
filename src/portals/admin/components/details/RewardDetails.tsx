
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Badge } from '../../../shared/ui/badge';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Textarea } from '../../../shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select';
import { Calendar, Award, User, DollarSign, FileText, Users, AlertTriangle, MessageSquare } from 'lucide-react';

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

interface Reward {
  id: string;
  type: 'reward' | 'punishment';
  category: string;
  description: string;
  amount: number | null;
  date_awarded: string;
  status: 'pending' | 'approved' | 'rejected';
  awarded_by: string | null;
  employee: Employee;
  incident: {
    id: string;
    description: string;
  } | null;
}

interface RewardDetailsProps {
  reward: Reward;
}

const RewardDetails = ({ reward }: RewardDetailsProps) => {
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
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'reward' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (!reward) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reward data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with Employee Info */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={reward.employee?.profile_image_url || '/placeholder.svg'}
            alt={reward.employee?.name || 'Unknown'}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {reward.employee?.name || 'Unknown Employee'}
            </h2>
            <p className="text-lg text-gray-700">{reward.employee?.position || 'No Position'}</p>
            <p className="text-sm text-gray-600">
              <strong>Department:</strong> {reward.employee?.department?.name || 'No Department'}
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
            <p className="text-gray-600">Date of Birth</p>
            <p className="font-medium">Not Available</p>
          </div>
          <div>
            <p className="text-gray-600">Job Description</p>
            <p className="font-medium">Employee Role Details</p>
          </div>
          <div>
            <p className="text-gray-600">Date of Resumption</p>
            <p className="font-medium">Not Available</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <span className={getStatusBadge(reward.status)}>
              {reward.status ? reward.status.charAt(0).toUpperCase() + reward.status.slice(1) : 'Unknown'}
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
                value={reward.description || 'No description available.'}
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
                {/* Repeat for multiple parties - showing sample structure */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={reward.employee?.profile_image_url || '/placeholder.svg'}
                      alt="Party member"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{reward.employee?.name}</p>
                      <p className="text-sm text-gray-600">Level: Employee</p>
                      <p className="text-sm text-gray-600">Position: {reward.employee?.position}</p>
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
          {/* Reward Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Reward Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <div className="mt-1">
                  <Badge className={getTypeBadge(reward.type)}>
                    {reward.type ? reward.type.charAt(0).toUpperCase() + reward.type.slice(1) : 'Unknown'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-gray-800">{reward.category || 'No Category'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="text-gray-800 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {reward.amount ? `$${Number(reward.amount).toFixed(2)}` : 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Date Awarded</label>
                <p className="text-gray-800 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(reward.date_awarded)}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Awarded By</label>
                <p className="text-gray-800">{reward.awarded_by || 'N/A'}</p>
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

          {/* Related Incident */}
          {reward.incident && (
            <Card>
              <CardHeader>
                <CardTitle>Related Incident</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {reward.incident.description || 'No incident description available.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardDetails;
