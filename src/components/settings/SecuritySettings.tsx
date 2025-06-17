
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Timer, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SecuritySettingsType {
  password_min_length?: number;
  require_2fa?: boolean;
  session_timeout?: number;
  [key: string]: any;
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
      return data.setting_value as SecuritySettingsType;
    }
  });

  // Update security settings
  const updateSecurityMutation = useMutation({
    mutationFn: async (updatedSettings: SecuritySettingsType) => {
      const { error } = await supabase
        .from('app_settings')
        .update({ 
          setting_value: updatedSettings as any, 
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
    const updatedSettings: SecuritySettingsType = {
      password_min_length: parseInt(formData.get('password_min_length') as string),
      require_2fa: securitySettings?.require_2fa || false,
      session_timeout: parseInt(formData.get('session_timeout') as string),
    };
    updateSecurityMutation.mutate(updatedSettings);
  };

  const handle2FAChange = (enabled: boolean) => {
    const updatedSettings = {
      ...securitySettings,
      require_2fa: enabled
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
        <p className="text-sm text-gray-600 mb-6">
          Configure application-wide security policies and requirements
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Requirements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password_min_length">Minimum Password Length</Label>
                <Input
                  id="password_min_length"
                  name="password_min_length"
                  type="number"
                  min="6"
                  max="20"
                  defaultValue={securitySettings?.password_min_length || 8}
                  className="w-24"
                />
                <p className="text-xs text-gray-600">Minimum number of characters required for passwords</p>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Require 2FA for all users</Label>
                  <p className="text-xs text-gray-600">Force all users to enable two-factor authentication</p>
                </div>
                <Switch
                  checked={securitySettings?.require_2fa || false}
                  onCheckedChange={handle2FAChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Session Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Session Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session_timeout"
                  name="session_timeout"
                  type="number"
                  min="30"
                  max="1440"
                  defaultValue={securitySettings?.session_timeout || 480}
                  className="w-32"
                />
                <p className="text-xs text-gray-600">Automatically log out users after this period of inactivity</p>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={updateSecurityMutation.isPending}>
            {updateSecurityMutation.isPending ? 'Saving...' : 'Save Security Settings'}
          </Button>
        </form>
      </div>

      <Separator />

      {/* Current Settings Summary */}
      <div>
        <h4 className="font-semibold mb-3">Current Security Policy</h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Minimum Password Length:</span>
            <span className="font-medium">{securitySettings?.password_min_length || 8} characters</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Two-Factor Authentication:</span>
            <span className="font-medium">{securitySettings?.require_2fa ? 'Required' : 'Optional'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Session Timeout:</span>
            <span className="font-medium">{Math.floor((securitySettings?.session_timeout || 480) / 60)} hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
