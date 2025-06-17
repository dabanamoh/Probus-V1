
import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import RoleSelector from './permissions/RoleSelector';
import PermissionCard from './permissions/PermissionCard';
import RoleOverview from './permissions/RoleOverview';
import { usePermissions } from './permissions/usePermissions';

type AppRole = 'admin' | 'manager' | 'hr' | 'employee';

const PermissionsSettings = () => {
  const [selectedRole, setSelectedRole] = useState<AppRole>('manager');
  const { permissionsQuery, getRolePermissionsQuery, togglePermissionMutation } = usePermissions();

  const { data: permissions, isLoading: permissionsLoading } = permissionsQuery;
  const { data: rolePermissions, isLoading: rolePermissionsLoading } = getRolePermissionsQuery(selectedRole);

  const groupedPermissions = permissions?.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>) || {};

  const handlePermissionToggle = (permissionId: string, hasPermission: boolean) => {
    togglePermissionMutation.mutate({
      permissionId,
      hasPermission,
      role: selectedRole
    });
  };

  if (permissionsLoading || rolePermissionsLoading) {
    return <div>Loading permissions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Role Permission Management */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Role-Based Permissions
            </h3>
            <p className="text-sm text-gray-600">Configure what each role can access and manage</p>
          </div>
          <RoleSelector 
            selectedRole={selectedRole} 
            onRoleChange={setSelectedRole} 
          />
        </div>

        <div className="grid gap-4">
          {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
            <PermissionCard
              key={category}
              category={category}
              permissions={categoryPermissions}
              rolePermissions={rolePermissions}
              onPermissionToggle={handlePermissionToggle}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Quick Role Overview */}
      <RoleOverview 
        selectedRole={selectedRole} 
        onRoleSelect={setSelectedRole} 
      />
    </div>
  );
};

export default PermissionsSettings;
