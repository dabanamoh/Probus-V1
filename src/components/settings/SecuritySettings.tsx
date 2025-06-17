
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Lock, Clock, Key } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SecuritySettings {
  password_min_length?: number;
  require_2fa?: boolean;
  session_timeout?: number;
}

const SecuritySettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch security settings
  const { data: securitySettings, isLoading } = useQuery({
    queryKey: ['security-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('setting_key', 'security_settings')
        .single();
      if (error) throw error;
      return data.setting_value as SecuritySettings;
    }
  });

  // Update security settings
  const updateSecurityMutation = useMutation({
    mutationFn: async (updatedSettings: SecuritySettings) => {
      const { error } = await supabase
        .from('app_settings')
        .update({ 
          setting_value: updatedSettings, 
          updated_at: new Date().toISOString() 
        })
        .eq('setting_key', 'security_settings');
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedSettings: SecuritySettings = {
      password_min_length: parseInt(formData.get('password_min_length') as string),
      require_2fa: formData.get('require_2fa') === 'on',
      session_timeout: parseInt(formData.get('session_timeout') as string),
    };
    updateSecurityMutation.mutate(updatedSettings);
  };

  if (isLoading) {
    return <div>Loading security settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Configuration
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="w-4 h-4" />
                Password Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password_min_length">Minimum Password Length</Label>
                  <Select name="password_min_length" defaultValue={securitySettings?.password_min_length?.toString() || '8'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 characters</SelectItem>
                      <SelectItem value="8">8 characters</SelectItem>
                      <SelectItem value="10">10 characters</SelectItem>
                      <SelectItem value="12">12 characters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Key className="w-4 h-4" />
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require_2fa">Require 2FA for all users</Label>
                  <p className="text-sm text-gray-600">Force all users to enable two-factor authentication</p>
                </div>
                <Switch
                  id="require_2fa"
                  name="require_2fa"
                  defaultChecked={securitySettings?.require_2fa || false}
                />
              </div>
            </CardContent>
          </Card>

          {/* Session Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4" />
                Session Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                <Select name="session_timeout" defaultValue={securitySettings?.session_timeout?.toString() || '480'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                    <SelectItem value="1440">24 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600">Users will be automatically logged out after this period of inactivity</p>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={updateSecurityMutation.isPending}>
            {updateSecurityMutation.isPending ? 'Saving...' : 'Save Security Settings'}
          </Button>
        </form>
      </div>

      {/* Security Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Security Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {securitySettings?.password_min_length || 8}
              </div>
              <div className="text-sm text-gray-600">Min Password Length</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {securitySettings?.require_2fa ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-gray-600">2FA Required</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor((securitySettings?.session_timeout || 480) / 60)}h
              </div>
              <div className="text-sm text-gray-600">Session Timeout</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
