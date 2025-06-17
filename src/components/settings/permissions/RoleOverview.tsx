
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users } from 'lucide-react';

type AppRole = 'admin' | 'manager' | 'hr' | 'employee';

interface RoleOverviewProps {
  selectedRole: AppRole;
  onRoleSelect: (role: AppRole) => void;
}

const RoleOverview = ({ selectedRole, onRoleSelect }: RoleOverviewProps) => {
  const roles: AppRole[] = ['admin', 'manager', 'hr', 'employee'];

  const getRoleDescription = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'Full system access';
      case 'manager':
        return 'Team management & approvals';
      case 'hr':
        return 'Employee & policy management';
      case 'employee':
        return 'Basic access & self-service';
      default:
        return '';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Role Overview
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <Card 
            key={role} 
            className={`cursor-pointer transition-all ${selectedRole === role ? 'ring-2 ring-blue-500' : ''}`} 
            onClick={() => onRoleSelect(role)}
          >
            <CardContent className="p-4">
              <div className="font-semibold capitalize mb-2">{role}</div>
              <div className="text-sm text-gray-600">
                {getRoleDescription(role)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleOverview;
