
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
      console.log('Fetching permissions...');
      try {
        const { data, error } = await supabase
          .from('permissions')
          .select('*')
          .order('category', { ascending: true })
          .order('name', { ascending: true });
        
        console.log('Permissions query result:', { data, error });
        
        if (error) {
          console.error('Permissions query error:', error);
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error('Error in permissions query:', err);
        throw err;
      }
    }
  });

  // Fetch all role permissions at once
  const allRolePermissionsQuery = useQuery({
    queryKey: ['all-role-permissions'],
    queryFn: async () => {
      console.log('Fetching all role permissions...');
      try {
        const { data, error } = await supabase
          .from('role_permissions')
          .select(`
            id,
            role,
            permission_id,
            permissions (
              id,
              name,
              description,
              category
            )
          `);
        
        console.log('All role permissions query result:', { data, error });
        
        if (error) {
          console.error('All role permissions query error:', error);
          throw error;
        }
        
        // Group by role
        const groupedByRole: { [key in AppRole]: any[] } = {
          admin: [],
          manager: [],
          hr: [],
          employee: []
        };
        
        data?.forEach((rolePermission) => {
          if (rolePermission.role && groupedByRole[rolePermission.role as AppRole]) {
            groupedByRole[rolePermission.role as AppRole].push(rolePermission);
          }
        });
        
        console.log('Grouped role permissions:', groupedByRole);
        return groupedByRole;
      } catch (err) {
        console.error('Error in all role permissions query:', err);
        throw err;
      }
    }
  });

  // Fetch role permissions for specific role (kept for compatibility)
  const getRolePermissionsQuery = (selectedRole: AppRole) => useQuery({
    queryKey: ['role-permissions', selectedRole],
    queryFn: async () => {
      console.log('Fetching role permissions for:', selectedRole);
      try {
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
        
        console.log('Role permissions query result:', { data, error, role: selectedRole });
        
        if (error) {
          console.error('Role permissions query error:', error);
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error('Error in role permissions query:', err);
        throw err;
      }
    }
  });

  // Toggle permission for role
  const togglePermissionMutation = useMutation({
    mutationFn: async ({ permissionId, hasPermission, role }: { 
      permissionId: string; 
      hasPermission: boolean; 
      role: AppRole;
    }) => {
      console.log('Toggle permission mutation:', { permissionId, hasPermission, role });
      
      if (hasPermission) {
        // Remove permission
        console.log('Removing permission...');
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role', role)
          .eq('permission_id', permissionId);
        if (error) {
          console.error('Error removing permission:', error);
          throw error;
        }
      } else {
        // Add permission
        console.log('Adding permission...');
        const { error } = await supabase
          .from('role_permissions')
          .insert({ role, permission_id: permissionId });
        if (error) {
          console.error('Error adding permission:', error);
          throw error;
        }
      }
    },
    onSuccess: () => {
      console.log('Permission toggle successful');
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['all-role-permissions'] });
      toast({
        title: "Permission updated",
        description: "Role permissions have been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Permission toggle error:', error);
      toast({
        title: "Error",
        description: "Failed to update permission. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    permissionsQuery,
    allRolePermissionsQuery,
    getRolePermissionsQuery,
    togglePermissionMutation
  };
};
