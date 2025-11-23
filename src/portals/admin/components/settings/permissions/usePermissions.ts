import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db';
import { useToast } from "@/hooks/use-toast";

type AppRole = 'admin' | 'director' | 'hr' | 'manager' | 'supervisor' | 'employee' | string; // string for custom roles

// Check if user is admin (based on localStorage for demo purposes)
const isAdmin = () => {
  return localStorage.getItem('isAdminLoggedIn') === 'true';
};

export const usePermissions = (selectedRole?: AppRole) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch permissions
  const permissionsQuery = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      console.log('Fetching permissions...');
      
      try {
        const { data, error } = await localDb
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
    },
    // Only fetch if user is admin
    enabled: isAdmin()
  });

  // Fetch all role permissions at once
  const allRolePermissionsQuery = useQuery({
    queryKey: ['all-role-permissions'],
    queryFn: async () => {
      console.log('Fetching all role permissions...');
      
      try {
        const { data, error } = await localDb
          .from('role_permissions')
          .select(`
            id,
            role_id,
            permission_id
          `);
        
        console.log('All role permissions query result:', { data, error });
        
        if (error) {
          console.error('All role permissions query error:', error);
          throw error;
        }
        
        // Group by role
        const groupedByRole: { [key in AppRole]: any[] } = {
          admin: [],
          director: [],
          manager: [],
          hr: [],
          supervisor: [],
          employee: []
        };
        
        // Fetch all roles to map role_id to role name
        const { data: rolesData, error: rolesError } = await localDb
          .from('roles')
          .select('id, name');
        
        if (rolesError) {
          console.error('Roles query error:', rolesError);
          throw rolesError;
        }
        
        // Create a map of role_id to role name
        const roleMap = rolesData?.reduce((acc, role) => {
          acc[role.id] = role.name.toLowerCase();
          return acc;
        }, {} as Record<string, string>) || {};
        
        data?.forEach((rolePermission) => {
          const roleName = roleMap[rolePermission.role_id];
          if (roleName && groupedByRole[roleName as AppRole]) {
            groupedByRole[roleName as AppRole].push(rolePermission);
          }
        });
        
        console.log('Grouped role permissions:', groupedByRole);
        return groupedByRole;
      } catch (err) {
        console.error('Error in all role permissions query:', err);
        throw err;
      }
    },
    // Only fetch if user is admin
    enabled: isAdmin()
  });

  // Fetch role permissions for specific role
  const rolePermissionsQuery = useQuery({
    queryKey: ['role-permissions', selectedRole],
    queryFn: async () => {
      console.log('Fetching role permissions for:', selectedRole);
      
      // Return early if no role selected
      if (!selectedRole) {
        return [];
      }
      
      try {
        // First get the role name from the roles table
        const { data: roleData, error: roleError } = await localDb
          .from('roles')
          .select('id')
          .eq('name', selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)); // Capitalize first letter
        
        if (roleError) {
          console.error('Role query error:', roleError);
          throw roleError;
        }
        
        if (!roleData || roleData.length === 0) {
          return [];
        }
        
        const roleId = roleData[0].id;
        
        const { data, error } = await localDb
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
          .eq('role_id', roleId);
        
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
    },
    // Only fetch if user is admin and selectedRole is provided
    enabled: isAdmin() && !!selectedRole
  });

  // Fetch permission logs
  const permissionLogsQuery = useQuery({
    queryKey: ['permission-logs'],
    queryFn: async () => {
      console.log('Fetching permission logs...');
      
      try {
        const { data, error } = await localDb
          .from('permission_logs')
          .select(`
            id,
            permission_id,
            role_id,
            action,
            changed_by,
            changed_at,
            details
          `)
          .order('changed_at', { ascending: false });
        
        console.log('Permission logs query result:', { data, error });
        
        if (error) {
          console.error('Permission logs query error:', error);
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error('Error in permission logs query:', err);
        throw err;
      }
    },
    // Only fetch if user is admin
    enabled: isAdmin()
  });

  // Toggle permission for role
  const togglePermissionMutation = useMutation({
    mutationFn: async ({ permissionId, hasPermission, role }: { 
      permissionId: string; 
      hasPermission: boolean; 
      role: AppRole;
    }) => {
      console.log('Toggle permission mutation:', { permissionId, hasPermission, role });
      
      // Check if user is admin
      if (!isAdmin()) {
        throw new Error('Unauthorized: Admin privileges required');
      }
      
      if (hasPermission) {
        // Remove permission
        console.log('Removing permission...');
        const queryBuilder = localDb.from('role_permissions');
        (queryBuilder as any).filters = { role_id: role, permission_id: permissionId };
        const { error } = await (queryBuilder as any).delete();
        if (error) {
          console.error('Error removing permission:', error);
          throw error;
        }
      } else {
        // Add permission
        console.log('Adding permission...');
        const { error } = await localDb
          .from('role_permissions')
          .insert([{ role_id: role, permission_id: permissionId }]);
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
    rolePermissionsQuery,
    togglePermissionMutation,
    permissionLogsQuery
  };
};