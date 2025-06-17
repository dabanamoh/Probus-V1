
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Users, Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type AppRole = 'admin' | 'manager' | 'hr' | 'employee';

const PermissionsSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<AppRole>('manager');

  // Fetch permissions
  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  // Fetch role permissions
  const { data: rolePermissions, isLoading: rolePermissionsLoading } = useQuery({
    queryKey: ['role-permissions', selectedRole],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          id,
          permission_id,
          permissions (
            id,
            name,
            description,
            category
          )
        `)
        .eq('role', selectedRole);
      if (error) throw error;
      return data;
    }
  });

  // Fetch employees for role assignment
  const { data: employees } = useQuery({
    queryKey: ['employees-for-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Toggle permission for role
  const togglePermissionMutation = useMutation({
    mutationFn: async ({ permissionId, hasPermission }: { permissionId: string, hasPermission: boolean }) => {
      if (hasPermission) {
        // Remove permission
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role', selectedRole)
          .eq('permission_id', permissionId);
        if (error) throw error;
      } else {
        // Add permission
        const { error } = await supabase
          .from('role_permissions')
          .insert({ role: selectedRole, permission_id: permissionId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      toast({
        title: "Permission updated",
        description: "Role permissions have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update permission. Please try again.",
        variant: "destructive",
      });
    }
  });

  const groupedPermissions = permissions?.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>) || {};

  const hasPermission = (permissionId: string) => {
    return rolePermissions?.some(rp => rp.permission_id === permissionId);
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
          <Select value={selectedRole} onValueChange={(value: AppRole) => setSelectedRole(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryPermissions.map((permission) => {
                  const hasCurrentPermission = hasPermission(permission.id);
                  return (
                    <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                        <div className="text-sm text-gray-600">{permission.description}</div>
                      </div>
                      <Switch
                        checked={hasCurrentPermission}
                        onCheckedChange={() => 
                          togglePermissionMutation.mutate({
                            permissionId: permission.id,
                            hasPermission: hasCurrentPermission
                          })
                        }
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Quick Role Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Role Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['admin', 'manager', 'hr', 'employee'] as AppRole[]).map((role) => (
            <Card key={role} className={`cursor-pointer transition-all ${selectedRole === role ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setSelectedRole(role)}>
              <CardContent className="p-4">
                <div className="font-semibold capitalize mb-2">{role}</div>
                <div className="text-sm text-gray-600">
                  {role === 'admin' && 'Full system access'}
                  {role === 'manager' && 'Team management & approvals'}
                  {role === 'hr' && 'Employee & policy management'}
                  {role === 'employee' && 'Basic access & self-service'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionsSettings;
