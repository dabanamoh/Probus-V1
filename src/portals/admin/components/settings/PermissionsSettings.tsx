import React, { useState, useEffect } from 'react';
import { Shield, Users, Settings, Copy, Download, Upload, FileText, Search, Filter } from 'lucide-react';
import { Separator } from "../../../shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/ui/tabs";
import { Button } from "../../../shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Switch } from "../../../shared/ui/switch";
import { useToast } from "@/hooks/use-toast";
import RoleSelector from './permissions/RoleSelector';
import PermissionCard from './permissions/PermissionCard';
import PermissionsTable from './permissions/PermissionsTable';
import RoleOverview from './permissions/RoleOverview';
import { usePermissions } from './permissions/usePermissions';
import { localDb } from '@/integrations/local-db';
import type { Tables } from '@/integrations/local-db/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "../../../shared/ui/dialog";

type Permission = Tables<'permissions'>;
type RolePermission = Tables<'role_permissions'>;

type AppRole = 'admin' | 'director' | 'hr' | 'manager' | 'supervisor' | 'employee' | string; // string for custom roles

interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Array of permission IDs
}

interface PermissionLog {
  id: string;
  permission_id: string;
  role_id: string;
  action: string;
  details: string;
  created_at: string;
}

// Permission Toggle Component
const PermissionToggle: React.FC<{ label: string; description: string; defaultEnabled?: boolean }> = ({ 
  label, 
  description, 
  defaultEnabled = false 
}) => {
  const [enabled, setEnabled] = useState(defaultEnabled);
  
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
      <div className="flex-1">
        <p className="font-medium text-sm dark:text-slate-200">{label}</p>
        <p className="text-xs text-gray-500 dark:text-slate-400">{description}</p>
      </div>
      <Switch 
        checked={enabled} 
        onCheckedChange={setEnabled}
        className="ml-4"
      />
    </div>
  );
};

const PermissionsSettings = () => {
  const [selectedRole, setSelectedRole] = useState<AppRole>('manager');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [copyFromRole, setCopyFromRole] = useState<AppRole>('admin');
  const [bulkAction, setBulkAction] = useState<'grant' | 'revoke' | 'none'>('none');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [testRole, setTestRole] = useState<AppRole>('employee');
  const [advancedView, setAdvancedView] = useState(false);
  const { toast } = useToast();

  // Call fetchAuditLog when the audit log modal opens
  useEffect(() => {
    if (showAuditLog) {
      fetchAuditLog();
    }
  }, [showAuditLog]);

  const {
    permissionsQuery,
    allRolePermissionsQuery,
    rolePermissionsQuery,
    togglePermissionMutation,
    permissionLogsQuery
  } = usePermissions(selectedRole);

  const { data: permissions, isLoading: permissionsLoading, error: permissionsError } = permissionsQuery;
  const { data: allRolePermissions, isLoading: allRolePermissionsLoading, error: allRolePermissionsError } = allRolePermissionsQuery;
  const { data: rolePermissions, isLoading: rolePermissionsLoading, error: rolePermissionsError } = rolePermissionsQuery;
  const { data: permissionLogs, isLoading: permissionLogsLoading, error: permissionLogsError } = permissionLogsQuery;

  // Filter permissions based on search term and category
  const filteredPermissions = permissions?.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || permission.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const groupedPermissions = filteredPermissions?.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>) || {};

  const handlePermissionToggle = (role: AppRole, permissionId: string, hasPermission: boolean) => {
    // Create audit log entry
    const action = hasPermission ? 'removed' : 'added';
    const permission = permissions?.find(p => p.id === permissionId);
    const details = `${action} "${permission?.name || permissionId}" permission ${action === 'added' ? 'to' : 'from'} ${role} role`;

    createPermissionLog(permissionId, role, action, details);

    togglePermissionMutation.mutate({
      permissionId,
      hasPermission,
      role
    });
  };

  // Bulk action handlers
  const handleBulkAction = () => {
    if (bulkAction === 'none') return;

    const permissionIds = Array.from(selectedPermissions);
    if (permissionIds.length === 0) {
      toast({
        title: "No permissions selected",
        description: "Please select permissions to perform bulk action",
        variant: "destructive",
      });
      return;
    }

    // Create audit log entry
    createPermissionLog('', selectedRole, 'modified', `Bulk ${bulkAction} action performed on ${permissionIds.length} permissions for ${selectedRole} role`);

    // Apply bulk action to all selected permissions
    permissionIds.forEach(permissionId => {
      const hasPermission = allRolePermissions?.[selectedRole as keyof typeof allRolePermissions]?.some(
        (rp: RolePermission) => rp.permission_id === permissionId
      ) || false;

      // For grant action, we want to add permission if not already present
      // For revoke action, we want to remove permission if present
      const shouldToggle = bulkAction === 'grant' ? !hasPermission : hasPermission;

      if (shouldToggle) {
        handlePermissionToggle(selectedRole, permissionId, hasPermission);
      }
    });

    toast({
      title: "Bulk action completed",
      description: `${bulkAction === 'grant' ? 'Granted' : 'Revoked'} permissions for ${selectedRole}`,
    });

    // Reset selections
    setSelectedPermissions(new Set());
    setBulkAction('none');
  };

  // Copy permissions from one role to another
  const handleCopyPermissions = async () => {
    try {
      // Get permissions from source role
      const sourcePermissions = allRolePermissions?.[copyFromRole as keyof typeof allRolePermissions] || [];

      // Create audit log entry
      createPermissionLog('', selectedRole, 'modified', `Copied permissions from ${copyFromRole} role to ${selectedRole} role`);

      // Remove all current permissions for target role
      const { data: currentRolePermissions, error: currentError } = await localDb
        .from('role_permissions')
        .select('*')
        .eq('role_id', selectedRole);

      if (currentError) throw currentError;

      // Delete existing permissions for target role
      for (const perm of currentRolePermissions || []) {
        const { error: deleteError } = await localDb
          .from('role_permissions')
          .delete()
          .eq('id', perm.id);

        if (deleteError) throw deleteError;
      }

      // Add permissions from source role to target role
      for (const perm of sourcePermissions) {
        const { error: insertError } = await localDb
          .from('role_permissions')
          .insert([{
            role_id: selectedRole,
            permission_id: perm.permission_id
          }]);

        if (insertError) throw insertError;
      }

      toast({
        title: "Permissions copied",
        description: `Copied permissions from ${copyFromRole} to ${selectedRole}`,
      });
    } catch (error) {
      console.error('Error copying permissions:', error);
      toast({
        title: "Error copying permissions",
        description: "Failed to copy permissions. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Export permissions to JSON
  const handleExportPermissions = () => {
    const dataStr = JSON.stringify(allRolePermissions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `permissions-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Permissions exported",
      description: "Permissions data exported successfully",
    });
  };

  // Import permissions from JSON
  const handleImportPermissions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);

        // In a real implementation, this would process the imported data
        // and update the role_permissions table accordingly
        console.log('Imported permissions data:', importedData);

        toast({
          title: "Permissions imported",
          description: "Permissions data imported successfully",
        });
      } catch (error) {
        toast({
          title: "Error importing permissions",
          description: "Failed to import permissions. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const isLoading = permissionsLoading || allRolePermissionsLoading || rolePermissionsLoading || permissionLogsLoading;
  const hasError = permissionsError || allRolePermissionsError || rolePermissionsError || permissionLogsError;

  // Check if user is admin
  const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold mb-2">Access Denied</h3>
        <p className="text-red-600 text-sm">
          You need admin privileges to view and manage permissions.
        </p>
        <p className="text-red-600 text-xs mt-2">
          Note: Make sure you're logged in as an admin user.
        </p>
      </div>
    );
  }

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
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-semibold mb-2">No Permissions in Database</h3>
          <p className="text-yellow-600 text-sm">
            The permissions table is empty. Using default permission set below.
          </p>
        </div>

        {/* Default Permission Toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Default System Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Employee Management */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-700">Employee Management</h4>
              <div className="space-y-2">
                <PermissionToggle label="View Employee Data" description="Can view employee profiles and information" />
                <PermissionToggle label="Edit Employee Data" description="Can modify employee information" />
                <PermissionToggle label="Create Employee Records" description="Can add new employees to the system" />
                <PermissionToggle label="Delete Employee Data" description="Can remove employee records" />
              </div>
            </div>

            {/* Department Management */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-700">Department Management</h4>
              <div className="space-y-2">
                <PermissionToggle label="View Department Info" description="Can view department details" />
                <PermissionToggle label="Manage Departments" description="Can create, edit, and delete departments" />
              </div>
            </div>

            {/* Approvals & Workflow */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-700">Approvals & Workflow</h4>
              <div className="space-y-2">
                <PermissionToggle label="View Approvals" description="Can see approval requests" />
                <PermissionToggle label="Create Approvals" description="Can create approval requests" />
                <PermissionToggle label="Approve Requests" description="Can approve or reject requests" />
              </div>
            </div>

            {/* KPI & Performance */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-700">KPI & Performance</h4>
              <div className="space-y-2">
                <PermissionToggle label="View KPI Data" description="Can view performance metrics" />
                <PermissionToggle label="Edit KPI Data" description="Can modify KPI metrics" />
                <PermissionToggle label="Manage KPI Evaluations" description="Can create and manage performance evaluations" />
              </div>
            </div>

            {/* Financial */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-700">Financial</h4>
              <div className="space-y-2">
                <PermissionToggle label="View Financial Info" description="Can view financial data" />
                <PermissionToggle label="Manage Financial Data" description="Can edit financial information" />
              </div>
            </div>

            {/* Reports */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-700">Reports</h4>
              <div className="space-y-2">
                <PermissionToggle label="View Reports" description="Can view generated reports" />
                <PermissionToggle label="Generate Reports" description="Can create new reports" />
                <PermissionToggle label="Export Reports" description="Can export reports to various formats" />
              </div>
            </div>

            {/* System Settings */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-700">System Settings</h4>
              <div className="space-y-2">
                <PermissionToggle label="View Settings" description="Can view system settings" />
                <PermissionToggle label="Manage Settings" description="Can modify system configuration" />
              </div>
            </div>

            {/* User Management */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-700">User Management</h4>
              <div className="space-y-2">
                <PermissionToggle label="Create Users" description="Can add new users to the system" />
                <PermissionToggle label="Edit Users" description="Can modify user accounts" />
                <PermissionToggle label="Disable Users" description="Can deactivate user accounts" />
              </div>
            </div>

            {/* Other */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-700">Other Permissions</h4>
              <div className="space-y-2">
                <PermissionToggle label="View Dashboards" description="Can access dashboard views" />
                <PermissionToggle label="Manage Notifications" description="Can configure notification settings" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Permission templates
  const permissionTemplates: PermissionTemplate[] = [
    {
      id: 'view-only',
      name: 'View Only',
      description: 'Read-only access to all systems',
      permissions: [
        'perm-1', // view_employee_data
        'perm-5', // view_department_info
        'perm-8', // view_approvals
        'perm-10', // view_kpi_data
        'perm-13', // view_financial_info
        'perm-16', // view_reports
        'perm-18', // view_settings
        'perm-23', // view_dashboards
        'perm-24' // manage_notifications
      ]
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Can view and edit data',
      permissions: [
        'perm-1', // view_employee_data
        'perm-2', // edit_employee_data
        'perm-5', // view_department_info
        'perm-6', // manage_departments
        'perm-8', // view_approvals
        'perm-10', // view_kpi_data
        'perm-11', // edit_kpi_data
        'perm-13', // view_financial_info
        'perm-15', // generate_reports
        'perm-16', // view_reports
        'perm-18', // view_settings
        'perm-21', // edit_users
        'perm-23', // view_dashboards
        'perm-24' // manage_notifications
      ]
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Full access to team management',
      permissions: [
        'perm-1', // view_employee_data
        'perm-2', // edit_employee_data
        'perm-4', // create_employee_data
        'perm-5', // view_department_info
        'perm-6', // manage_departments
        'perm-7', // create_approvals
        'perm-8', // view_approvals
        'perm-9', // approve_requests
        'perm-10', // view_kpi_data
        'perm-11', // edit_kpi_data
        'perm-12', // manage_kpi_evaluations
        'perm-13', // view_financial_info
        'perm-15', // generate_reports
        'perm-16', // view_reports
        'perm-17', // export_reports
        'perm-18', // view_settings
        'perm-20', // create_users
        'perm-21', // edit_users
        'perm-23', // view_dashboards
        'perm-24' // manage_notifications
      ]
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access',
      permissions: [
        'perm-1', // view_employee_data
        'perm-2', // edit_employee_data
        'perm-3', // delete_employee_data
        'perm-4', // create_employee_data
        'perm-5', // view_department_info
        'perm-6', // manage_departments
        'perm-7', // create_approvals
        'perm-8', // view_approvals
        'perm-9', // approve_requests
        'perm-10', // view_kpi_data
        'perm-11', // edit_kpi_data
        'perm-12', // manage_kpi_evaluations
        'perm-13', // view_financial_info
        'perm-14', // manage_financial_data
        'perm-15', // generate_reports
        'perm-16', // view_reports
        'perm-17', // export_reports
        'perm-18', // view_settings
        'perm-19', // manage_settings
        'perm-20', // create_users
        'perm-21', // edit_users
        'perm-22', // disable_users
        'perm-23', // view_dashboards
        'perm-24' // manage_notifications
      ]
    },
  ];

  // Apply template
  const applyTemplate = async (templateId: string) => {
    try {
      const template = permissionTemplates.find(t => t.id === templateId);
      if (!template) {
        toast({
          title: "Template not found",
          description: `Template ${templateId} not found`,
          variant: "destructive",
        });
        return;
      }

      // Create audit log entry
      createPermissionLog('', selectedRole, 'modified', `Applied "${template.name}" template to ${selectedRole} role`);

      // Remove all current permissions for target role
      const { data: currentRolePermissions, error: currentError } = await localDb
        .from('role_permissions')
        .select('*')
        .eq('role_id', selectedRole);

      if (currentError) throw currentError;

      // Delete existing permissions for target role
      for (const perm of currentRolePermissions || []) {
        const { error: deleteError } = await localDb
          .from('role_permissions')
          .delete()
          .eq('id', perm.id);

        if (deleteError) throw deleteError;
      }

      // Add permissions from template to target role
      for (const permissionId of template.permissions) {
        const { error: insertError } = await localDb
          .from('role_permissions')
          .insert([{
            role_id: selectedRole,
            permission_id: permissionId
          }]);

        if (insertError) throw insertError;
      }

      toast({
        title: "Template applied",
        description: `Applied ${template.name} template to ${selectedRole}`,
      });
    } catch (error) {
      console.error('Error applying template:', error);
      toast({
        title: "Error applying template",
        description: "Failed to apply template. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Test permissions for a role
  const testPermissions = async (roleId: string) => {
    try {
      // Get permissions for the test role
      const { data: rolePermissions, error } = await localDb
        .from('role_permissions')
        .select(`
          permission_id,
          permissions (name, description)
        `)
        .eq('role_id', roleId);

      if (error) throw error;

      // Display permissions in a toast
      const permissionNames = rolePermissions?.map(rp => rp.permissions?.name).filter(Boolean) || [];

      toast({
        title: `Permissions for ${testRole}`,
        description: permissionNames.length > 0
          ? `This role has ${permissionNames.length} permissions: ${permissionNames.slice(0, 5).join(', ')}${permissionNames.length > 5 ? '...' : ''}`
          : `This role has no permissions`,
      });
    } catch (error) {
      console.error('Error testing permissions:', error);
      toast({
        title: "Error testing permissions",
        description: "Failed to test permissions. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch audit log data
  const fetchAuditLog = async () => {
    try {
      // In a real implementation, this would fetch from the permission_logs table
      // For now, we'll just show the mock data in the UI
      console.log('Fetching audit log data...');
      // This would be implemented when we have actual audit log data
    } catch (error) {
      console.error('Error fetching audit log:', error);
    }
  };

  // Create a permission log entry
  const createPermissionLog = async (permissionId: string, roleId: string, action: 'added' | 'removed' | 'modified', details: string) => {
    try {
      // In a real implementation, this would insert into the permission_logs table
      console.log('Creating permission log entry:', { permissionId, roleId, action, details });
      // This would be implemented when we have actual audit log data
    } catch (error) {
      console.error('Error creating permission log:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-full overflow-x-hidden">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Role-Based Permissions Management
          </h3>
          <p className="text-sm text-gray-600">Configure what each role can access and manage</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdvancedView(!advancedView)}
          >
            {advancedView ? 'Simple View' : 'Advanced View'}
          </Button>
        </div>
      </div>

      {/* Permission Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Permission Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3 max-w-full">
            {permissionTemplates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                size="sm"
                onClick={() => applyTemplate(template.id)}
              >
                {template.name}
              </Button>
            ))}
          </div>

          {advancedView && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
              <span className="text-sm">Test permissions for:</span>
              <RoleSelector
                selectedRole={testRole}
                onRoleChange={setTestRole}
              />
              <Button
                size="sm"
                onClick={() => testPermissions(testRole)}
              >
                Test
              </Button>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Apply predefined permission sets to quickly configure roles
          </p>
        </CardContent>
      </Card>

      {/* Bulk Actions and Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permission Management Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-w-full overflow-x-hidden">
          <div className="flex flex-wrap gap-2 sm:gap-4 max-w-full">
            {/* Copy Permissions */}
            <div className="flex flex-wrap items-center gap-2 max-w-full">
              <span className="text-sm">Copy from:</span>
              <RoleSelector
                selectedRole={copyFromRole}
                onRoleChange={setCopyFromRole}
              />
              <Button
                size="sm"
                onClick={handleCopyPermissions}
                className="flex items-center gap-1"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>

            {/* Bulk Actions */}
            <div className="flex flex-wrap items-center gap-2 max-w-full">
              <span className="text-sm">Bulk action:</span>
              <select
                className="px-2 py-1 border border-gray-300 rounded text-sm max-w-full"
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value as 'grant' | 'revoke' | 'none')}
              >
                <option value="none">Select action</option>
                <option value="grant">Grant permissions</option>
                <option value="revoke">Revoke permissions</option>
              </select>
              <Button
                size="sm"
                onClick={handleBulkAction}
                disabled={bulkAction === 'none'}
              >
                Apply
              </Button>
            </div>

            {/* Export/Import */}
            <div className="flex flex-wrap items-center gap-2 max-w-full">
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportPermissions}
                className="flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <label className="flex items-center gap-1 cursor-pointer bg-white border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportPermissions}
                />
              </label>
            </div>

            {/* Advanced Tools (only in advanced view) */}
            {advancedView && (
              <div className="flex flex-wrap items-center gap-2 max-w-full">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAuditLog(true)}
                >
                  Audit Log
                </Button>
              </div>
            )}
          </div>

          {advancedView && (
            <div className="text-xs text-gray-500 mt-2">
              Advanced tools: Audit log, permission inheritance, conflict detection
            </div>
          )}
        </CardContent>
      </Card>

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

        <TabsContent value="table" className="mt-6 max-w-full overflow-x-hidden">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Table View:</strong> Manage all permissions across all roles in one view
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {Object.keys(groupedPermissions).length} permission categories • {permissions.length} total permissions
            </p>
          </div>

          {/* Search and filter controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4 max-w-full">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search permissions..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {permissions && [...new Set(permissions.map(p => p.category))].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <PermissionsTable
            permissions={filteredPermissions}
            rolePermissions={allRolePermissions || { admin: [], director: [], manager: [], hr: [], supervisor: [], employee: [] }}
            onPermissionToggle={handlePermissionToggle}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="cards" className="mt-6 max-w-full overflow-x-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 max-w-full overflow-x-hidden">
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
                permissions={categoryPermissions as Permission[]}
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

      {/* Audit Log Modal */}
      <Dialog open={showAuditLog} onOpenChange={setShowAuditLog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Permission Audit Log</DialogTitle>
            <DialogDescription>
              Track all permission changes made in the system
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {permissionLogsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">Loading audit log...</p>
                  </div>
                </div>
              ) : permissionLogsError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-red-800 font-semibold mb-2">Error Loading Audit Log</h3>
                  <p className="text-red-600 text-sm">
                    {permissionLogsError.message || 'Unknown error occurred'}
                  </p>
                </div>
              ) : !permissionLogs || permissionLogs.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No audit log entries found</p>
              ) : (
                <div className="space-y-2">
                  {(permissionLogs as PermissionLog[]).map((log) => (
                    <div key={log.id} className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{log.details}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Action: <span className="uppercase">{log.action}</span> • Role: {log.role_id}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAuditLog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionsSettings;
