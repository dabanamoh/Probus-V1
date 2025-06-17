
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface CompanyInfo {
  name?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export const useCompanySettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch company settings
  const companyQuery = useQuery({
    queryKey: ['company-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('setting_key', 'company_info')
        .maybeSingle();
      if (error) throw error;
      return data?.setting_value as CompanyInfo || {};
    }
  });

  // Update company settings
  const updateCompanyMutation = useMutation({
    mutationFn: async (updatedInfo: CompanyInfo) => {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ 
          setting_key: 'company_info',
          setting_value: updatedInfo as any,
          category: 'company',
          description: 'Company information settings',
          updated_at: new Date().toISOString() 
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-settings'] });
      toast({
        title: "Company information updated",
        description: "Your company details have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update company information. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    companyQuery,
    updateCompanyMutation
  };
};
