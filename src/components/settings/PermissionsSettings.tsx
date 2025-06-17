
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

  const { data: permissions, isLoading: permissionsLoading, error: permissionsError } = permissionsQuery;
  const { data: rolePermissions, isLoading: rolePermissionsLoading, error: rolePermissionsError } = getRolePermissionsQuery(selectedRole);

  console.log('Permissions data:', permissions);
  console.log('Role permissions data:', rolePermissions);
  console.log('Permissions loading:', permissionsLoading);
  console.log('Role permissions loading:', rolePermissionsLoading);
  console.log('Permissions error:', permissionsError);
  console.log('Role permissions error:', rolePermissionsError);

  const groupedPermissions = permissions?.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>) || {};

  console.log('Grouped permissions:', groupedPermissions);

  const handlePermissionToggle = (permissionId: string, hasPermission: boolean) => {
    console.log('Toggling permission:', { permissionId, hasPermission, role: selectedRole });
    togglePermissionMutation.mutate({
      permissionId,
      hasPermission,
      role: selectedRole
    });
  };

  if (permissionsLoading || rolePermissionsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  if (permissionsError || rolePermissionsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Permissions</h3>
        <p className="text-red-600 text-sm">
          {permissionsError?.message || rolePermissionsError?.message || 'Unknown error occurred'}
        </p>
        <p className="text-red-600 text-xs mt-2">
          Note: You may need admin privileges to view permissions.
        </p>
      </div>
    );
  }

  if (!permissions || permissions.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-yellow-800 font-semibold mb-2">No Permissions Found</h3>
        <p className="text-yellow-600 text-sm">
          No permissions are configured in the system. Please contact your administrator.
        </p>
      </div>
    );
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

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            Currently configuring permissions for: <strong className="capitalize">{selectedRole}</strong>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {Object.keys(groupedPermissions).length} permission categories available
          </p>
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
