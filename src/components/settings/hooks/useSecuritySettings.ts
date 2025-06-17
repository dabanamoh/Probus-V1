
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('setting_key', 'security_settings')
        .maybeSingle();
      if (error) throw error;
      return data?.setting_value as SecuritySettingsType || {};
    }
  });

  // Update security settings
  const updateSecurityMutation = useMutation({
    mutationFn: async (updatedSettings: SecuritySettingsType) => {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ 
          setting_key: 'security_settings',
          setting_value: updatedSettings as any,
          category: 'security',
          description: 'Security configuration settings',
          updated_at: new Date().toISOString() 
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
