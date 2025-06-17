
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageSquare, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notification settings
  const { data: notificationSettings, isLoading } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('setting_key', 'notification_settings')
        .single();
      if (error) throw error;
      return data.setting_value;
    }
  });

  // Update notification settings
  const updateNotificationMutation = useMutation({
    mutationFn: async (updatedSettings: any) => {
      const { error } = await supabase
        .from('app_settings')
        .update({ 
          setting_value: updatedSettings, 
          updated_at: new Date().toISOString() 
        })
        .eq('setting_key', 'notification_settings');
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedSettings = {
      email_notifications: formData.get('email_notifications') === 'on',
      push_notifications: formData.get('push_notifications') === 'on',
      sms_notifications: formData.get('sms_notifications') === 'on',
    };
    updateNotificationMutation.mutate(updatedSettings);
  };

  if (isLoading) {
    return <div>Loading notification settings...</div>;
  }

  const notificationTypes = [
    {
      id: 'leave_requests',
      title: 'Leave Requests',
      description: 'Notifications for new leave requests and approvals',
      icon: AlertTriangle,
    },
    {
      id: 'employee_updates',
      title: 'Employee Updates',
      description: 'New employee registrations and profile changes',
      icon: Bell,
    },
    {
      id: 'kpi_submissions',
      title: 'KPI Submissions',
      description: 'New KPI submissions and reviews',
      icon: MessageSquare,
    },
    {
      id: 'system_alerts',
      title: 'System Alerts',
      description: 'Important system notifications and maintenance',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Global Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Global Notification Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label htmlFor="email_notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  id="email_notifications"
                  name="email_notifications"
                  defaultChecked={notificationSettings?.email_notifications || false}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label htmlFor="push_notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive browser push notifications</p>
                  </div>
                </div>
                <Switch
                  id="push_notifications"
                  name="push_notifications"
                  defaultChecked={notificationSettings?.push_notifications || false}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label htmlFor="sms_notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via SMS (requires setup)</p>
                  </div>
                </div>
                <Switch
                  id="sms_notifications"
                  name="sms_notifications"
                  defaultChecked={notificationSettings?.sms_notifications || false}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={updateNotificationMutation.isPending}>
            {updateNotificationMutation.isPending ? 'Saving...' : 'Save Notification Settings'}
          </Button>
        </form>
      </div>

      {/* Notification Types */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Notification Types</h3>
        <div className="grid gap-4">
          {notificationTypes.map((type) => (
            <Card key={type.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <type.icon className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">{type.title}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Coming Soon
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Notification Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-600">Sent Today</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-gray-600">Delivery Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
