
import React, { useState } from 'react';
import { Shield, Users, Settings } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleSelector from './permissions/RoleSelector';
import PermissionCard from './permissions/PermissionCard';
import PermissionsTable from './permissions/PermissionsTable';
import RoleOverview from './permissions/RoleOverview';
import { usePermissions } from './permissions/usePermissions';

type AppRole = 'admin' | 'manager' | 'hr' | 'employee';

const PermissionsSettings = () => {
  const [selectedRole, setSelectedRole] = useState<AppRole>('manager');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  const { 
    permissionsQuery, 
    allRolePermissionsQuery,
    getRolePermissionsQuery, 
    togglePermissionMutation 
  } = usePermissions();

  const { data: permissions, isLoading: permissionsLoading, error: permissionsError } = permissionsQuery;
  const { data: allRolePermissions, isLoading: allRolePermissionsLoading, error: allRolePermissionsError } = allRolePermissionsQuery;
  const { data: rolePermissions, isLoading: rolePermissionsLoading, error: rolePermissionsError } = getRolePermissionsQuery(selectedRole);

  console.log('Permissions data:', permissions);
  console.log('All role permissions data:', allRolePermissions);
  console.log('Role permissions data:', rolePermissions);
  console.log('Permissions loading:', permissionsLoading);
  console.log('All role permissions loading:', allRolePermissionsLoading);
  console.log('Role permissions loading:', rolePermissionsLoading);
  console.log('Permissions error:', permissionsError);
  console.log('All role permissions error:', allRolePermissionsError);
  console.log('Role permissions error:', rolePermissionsError);

  const groupedPermissions = permissions?.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>) || {};

  console.log('Grouped permissions:', groupedPermissions);

  const handlePermissionToggle = (role: AppRole, permissionId: string, hasPermission: boolean) => {
    console.log('Toggling permission:', { permissionId, hasPermission, role });
    togglePermissionMutation.mutate({
      permissionId,
      hasPermission,
      role
    });
  };

  const isLoading = permissionsLoading || allRolePermissionsLoading || rolePermissionsLoading;
  const hasError = permissionsError || allRolePermissionsError || rolePermissionsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Permissions</h3>
          <p className="text-red-600 text-sm">
            {permissionsError?.message || allRolePermissionsError?.message || rolePermissionsError?.message || 'Unknown error occurred'}
          </p>
          <p className="text-red-600 text-xs mt-2">
            Note: You may need admin privileges to view permissions.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-800 font-semibold mb-2">Troubleshooting Steps:</h4>
          <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
            <li>Make sure you're logged in as an admin user</li>
            <li>Check that the permissions table has been populated with data</li>
            <li>Verify your database connection is working</li>
            <li>Ensure Row Level Security policies allow admin access</li>
          </ul>
        </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Role-Based Permissions Management
          </h3>
          <p className="text-sm text-gray-600">Configure what each role can access and manage</p>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'cards')}>
        <TabsList>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Table View
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Card View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Table View:</strong> Manage all permissions across all roles in one view
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {Object.keys(groupedPermissions).length} permission categories • {permissions.length} total permissions
            </p>
          </div>

          <PermissionsTable
            permissions={permissions}
            rolePermissions={allRolePermissions || { admin: [], manager: [], hr: [], employee: [] }}
            onPermissionToggle={handlePermissionToggle}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex-1 mr-4">
              <p className="text-sm text-blue-700">
                Currently configuring permissions for: <strong className="capitalize">{selectedRole}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {Object.keys(groupedPermissions).length} permission categories available
              </p>
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
                onPermissionToggle={(permissionId, hasPermission) => 
                  handlePermissionToggle(selectedRole, permissionId, hasPermission)
                }
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <RoleOverview 
        selectedRole={selectedRole} 
        onRoleSelect={setSelectedRole} 
      />
    </div>
  );
};

export default PermissionsSettings;
