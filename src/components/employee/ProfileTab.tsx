
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileTabProps {
  formData: {
    profileImageUrl: string;
    position: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const ProfileTab = ({ formData, onInputChange }: ProfileTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={formData.profileImageUrl || '/placeholder.svg'}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
          />
          <div className="flex-1">
            <Label htmlFor="profileImageUrl">Profile Image URL</Label>
            <Input
              id="profileImageUrl"
              placeholder="Profile image URL"
              value={formData.profileImageUrl}
              onChange={(e) => onInputChange('profileImageUrl', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            placeholder="Employee position"
            value={formData.position}
            onChange={(e) => onInputChange('position', e.target.value)}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
