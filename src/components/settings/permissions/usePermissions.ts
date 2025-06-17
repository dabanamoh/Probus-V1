
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

type AppRole = 'admin' | 'manager' | 'hr' | 'employee';

export const usePermissions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch permissions
  const permissionsQuery = useQuery({
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
  const getRolePermissionsQuery = (selectedRole: AppRole) => useQuery({
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
  const employeesQuery = useQuery({
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
    mutationFn: async ({ permissionId, hasPermission, role }: { 
      permissionId: string; 
      hasPermission: boolean; 
      role: AppRole;
    }) => {
      if (hasPermission) {
        // Remove permission
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role', role)
          .eq('permission_id', permissionId);
        if (error) throw error;
      } else {
        // Add permission
        const { error } = await supabase
          .from('role_permissions')
          .insert({ role, permission_id: permissionId });
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

  return {
    permissionsQuery,
    getRolePermissionsQuery,
    employeesQuery,
    togglePermissionMutation
  };
};
