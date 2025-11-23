
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/ui/card";
import { Switch } from "../../../../shared/ui/switch";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermission {
  id: string;
  permission_id: string;
}

interface PermissionCardProps {
  category: string;
  permissions: Permission[];
  rolePermissions: RolePermission[] | undefined;
  onPermissionToggle: (permissionId: string, hasPermission: boolean) => void;
}

const PermissionCard = ({ category, permissions, rolePermissions, onPermissionToggle }: PermissionCardProps) => {
  const hasPermission = (permissionId: string) => {
    return rolePermissions?.some(rp => rp.permission_id === permissionId);
  };

  // Check if permission is inherited (simplified logic)
  const isPermissionInherited = (permissionId: string) => {
    // For demo purposes, we'll consider permissions as inherited if they follow a pattern
    // In a real implementation, this would check the role hierarchy
    return false; // Simplified for now
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{category}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {permissions.map((permission) => {
          const hasCurrentPermission = hasPermission(permission.id);
          const isInherited = isPermissionInherited(permission.id);
          return (
            <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg relative">
              <div>
                <div className="font-medium">{permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div className="text-sm text-gray-600">{permission.description}</div>
              </div>
              <div className="relative">
                <Switch
                  checked={hasCurrentPermission}
                  onCheckedChange={() => 
                    onPermissionToggle(permission.id, hasCurrentPermission)
                  }
                />
                {isInherited && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" title="Inherited permission"></div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PermissionCard;
