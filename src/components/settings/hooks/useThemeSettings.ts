
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  foreground?: string;
}

interface CompanyLogo {
  url?: string;
  alt?: string;
}

export const useThemeSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current theme settings
  const themeQuery = useQuery({
    queryKey: ['theme-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .in('setting_key', ['theme_colors', 'company_logo']);
      if (error) throw error;
      
      const settings: { theme_colors?: ThemeColors; company_logo?: CompanyLogo } = {};
      data.forEach(setting => {
        if (setting.setting_key === 'theme_colors') {
          settings.theme_colors = setting.setting_value as ThemeColors;
        } else if (setting.setting_key === 'company_logo') {
          settings.company_logo = setting.setting_value as CompanyLogo;
        }
      });
      return settings;
    }
  });

  // Update theme settings
  const updateThemeMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: any }) => {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ 
          setting_key: key,
          setting_value: value,
          category: 'theme',
          description: `Theme setting for ${key}`,
          updated_at: new Date().toISOString() 
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme-settings'] });
      toast({
        title: "Theme updated",
        description: "Your theme settings have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update theme settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    themeQuery,
    updateThemeMutation
  };
};
