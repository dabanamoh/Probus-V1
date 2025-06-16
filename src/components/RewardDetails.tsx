
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Award, User, DollarSign } from 'lucide-react';

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
              src={reward.employee?.profile_image_url || '/placeholder.svg'}
              alt={reward.employee?.name || 'Unknown'}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {reward.employee?.name || 'Unknown Employee'}
              </h3>
              <p className="text-gray-600">{reward.employee?.position || 'No Position'}</p>
              <p className="text-sm text-gray-500">
                {reward.employee?.department?.name || 'No Department'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Reward Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Type</label>
              <div className="mt-1">
                <Badge className={getTypeBadge(reward.type)}>
                  {reward.type ? reward.type.charAt(0).toUpperCase() + reward.type.slice(1) : 'Unknown'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <span className={getStatusBadge(reward.status)}>
                  {reward.status ? reward.status.charAt(0).toUpperCase() + reward.status.slice(1) : 'Unknown'}
                </span>
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
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{reward.description || 'No description available.'}</p>
        </CardContent>
      </Card>

      {/* Related Incident */}
      {reward.incident && (
        <Card>
          <CardHeader>
            <CardTitle>Related Incident</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{reward.incident.description || 'No incident description available.'}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RewardDetails;
