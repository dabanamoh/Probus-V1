
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db';
import type { Json } from '@/integrations/local-db/types';
import { useToast } from "@/hooks/use-toast";

interface SecuritySettingsType {
  password_min_length?: number;
  require_2fa?: boolean;
  session_timeout?: number;
}

export const useSecuritySettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch security settings
  const securityQuery = useQuery({
    queryKey: ['security-settings'],
    queryFn: async () => {
      const { data, error } = await localDb
        .from('app_settings')
        .select('*')
        .eq('setting_key', 'security_settings')
        .maybeSingle();
      if (error) throw error;
      return data && data.length > 0 ? data[0].setting_value as SecuritySettingsType : {};
    }
  });

  // Update security settings
  const updateSecurityMutation = useMutation({
    mutationFn: async (updatedSettings: SecuritySettingsType) => {
      const { error } = await localDb
        .from('app_settings')
        .insert({
          setting_key: 'security_settings',
          setting_value: updatedSettings as unknown as Json,
          category: 'security',
          description: 'Security configuration settings'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-settings'] });
      toast({
        title: "Security settings updated",
        description: "Your security preferences have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    securityQuery,
    updateSecurityMutation
  };
};
