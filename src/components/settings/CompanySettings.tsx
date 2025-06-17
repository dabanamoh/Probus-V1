
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, MapPin, Phone, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CompanyInfo {
  name?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
}

const CompanySettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch company settings
  const { data: companyInfo, isLoading } = useQuery({
    queryKey: ['company-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('setting_key', 'company_info')
        .single();
      if (error) throw error;
      return data.setting_value as CompanyInfo;
    }
  });

  // Update company settings
  const updateCompanyMutation = useMutation({
    mutationFn: async (updatedInfo: CompanyInfo) => {
      const { error } = await supabase
        .from('app_settings')
        .update({ 
          setting_value: updatedInfo, 
          updated_at: new Date().toISOString() 
        })
        .eq('setting_key', 'company_info');
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedInfo: CompanyInfo = {
      name: formData.get('name') as string,
      tagline: formData.get('tagline') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
    };
    updateCompanyMutation.mutate(updatedInfo);
  };

  if (isLoading) {
    return <div>Loading company settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building className="w-5 h-5" />
          Company Information
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={companyInfo?.name || ''}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Company Tagline</Label>
              <Input
                id="tagline"
                name="tagline"
                defaultValue={companyInfo?.tagline || ''}
                placeholder="Enter company tagline"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </Label>
            <Textarea
              id="address"
              name="address"
              defaultValue={companyInfo?.address || ''}
              placeholder="Enter company address"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={companyInfo?.phone || ''}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={companyInfo?.email || ''}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <Button type="submit" disabled={updateCompanyMutation.isPending}>
            {updateCompanyMutation.isPending ? 'Saving...' : 'Save Company Information'}
          </Button>
        </form>
      </div>

      {/* Company Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-lg">{companyInfo?.name || 'Company Name'}</h4>
              <p className="text-gray-600">{companyInfo?.tagline || 'Company Tagline'}</p>
            </div>
            {companyInfo?.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                <span className="text-sm">{companyInfo.address}</span>
              </div>
            )}
            <div className="flex gap-6">
              {companyInfo?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{companyInfo.phone}</span>
                </div>
              )}
              {companyInfo?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{companyInfo.email}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySettings;
