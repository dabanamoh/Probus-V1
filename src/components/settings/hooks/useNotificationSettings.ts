
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface NotificationSettingsType {
  email_notifications?: boolean;
  push_notifications?: boolean;
  sms_notifications?: boolean;
}

export const useNotificationSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notification settings
  const notificationQuery = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('setting_key', 'notification_settings')
        .maybeSingle();
      if (error) throw error;
      return data?.setting_value as NotificationSettingsType || {};
    }
  });

  // Update notification settings
  const updateNotificationMutation = useMutation({
    mutationFn: async (updatedSettings: NotificationSettingsType) => {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ 
          setting_key: 'notification_settings',
          setting_value: updatedSettings,
          category: 'notifications',
          description: 'Notification preferences',
          updated_at: new Date().toISOString() 
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    notificationQuery,
    updateNotificationMutation
  };
};
