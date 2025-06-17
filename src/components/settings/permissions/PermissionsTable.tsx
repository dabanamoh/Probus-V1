
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

type AppRole = 'admin' | 'manager' | 'hr' | 'employee';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermission {
  id: string;
  permission_id: string;
  permissions?: Permission;
}

interface PermissionsTableProps {
  permissions: Permission[];
  rolePermissions: { [key in AppRole]: RolePermission[] };
  onPermissionToggle: (role: AppRole, permissionId: string, hasPermission: boolean) => void;
  isLoading?: boolean;
}

const PermissionsTable = ({ 
  permissions, 
  rolePermissions, 
  onPermissionToggle, 
  isLoading = false 
}: PermissionsTableProps) => {
  const roles: AppRole[] = ['admin', 'manager', 'hr', 'employee'];
  
  const hasPermission = (role: AppRole, permissionId: string) => {
    return rolePermissions[role]?.some(rp => rp.permission_id === permissionId) || false;
  };

  const formatPermissionName = (name: string) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'KPI Management': 'bg-blue-100 text-blue-800',
      'Leave Management': 'bg-green-100 text-green-800',
      'Employee Management': 'bg-purple-100 text-purple-800',
      'Department Management': 'bg-orange-100 text-orange-800',
      'HR Management': 'bg-red-100 text-red-800',
      'Feedback Management': 'bg-yellow-100 text-yellow-800',
      'Notice Management': 'bg-indigo-100 text-indigo-800',
      'Event Management': 'bg-pink-100 text-pink-800',
      'System Settings': 'bg-gray-100 text-gray-800',
      'Reports': 'bg-teal-100 text-teal-800',
      'Finance': 'bg-emerald-100 text-emerald-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

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

  if (!permissions || permissions.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-yellow-800 font-semibold mb-2">No Permissions Found</h3>
        <p className="text-yellow-600 text-sm">
          No permissions are configured in the system. You may need admin privileges to view this data.
        </p>
      </div>
    );
  }

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
        <div key={category} className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <Badge className={getCategoryColor(category)}>
                {category}
              </Badge>
              <span className="text-sm text-gray-600">
                {categoryPermissions.length} permission{categoryPermissions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Permission</TableHead>
                <TableHead className="w-1/3">Description</TableHead>
                <TableHead className="text-center">Admin</TableHead>
                <TableHead className="text-center">Manager</TableHead>
                <TableHead className="text-center">HR</TableHead>
                <TableHead className="text-center">Employee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryPermissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">
                    {formatPermissionName(permission.name)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {permission.description}
                  </TableCell>
                  {roles.map((role) => {
                    const hasCurrentPermission = hasPermission(role, permission.id);
                    return (
                      <TableCell key={role} className="text-center">
                        <Switch
                          checked={hasCurrentPermission}
                          onCheckedChange={() => 
                            onPermissionToggle(role, permission.id, hasCurrentPermission)
                          }
                          disabled={role === 'admin'} // Admin always has all permissions
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default PermissionsTable;
