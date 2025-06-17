
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Smartphone, MessageSquare } from 'lucide-react';
import { useNotificationSettings } from './hooks/useNotificationSettings';

const NotificationSettings = () => {
  const { notificationQuery, updateNotificationMutation } = useNotificationSettings();
  const { data: notificationSettings, isLoading } = notificationQuery;

  const handleSettingChange = (key: string, value: boolean) => {
    const updatedSettings = {
      ...notificationSettings,
      [key]: value
    };
    updateNotificationMutation.mutate(updatedSettings);
  };

  if (isLoading) {
    return <div>Loading notification settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Global Notification Preferences
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Configure how users receive notifications across the application
        </p>

        <div className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable Email Notifications</Label>
                  <p className="text-xs text-gray-600">Send notifications via email to users</p>
                </div>
                <Switch
                  checked={notificationSettings?.email_notifications || false}
                  onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Push Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable Push Notifications</Label>
                  <p className="text-xs text-gray-600">Send real-time notifications to browsers and mobile devices</p>
                </div>
                <Switch
                  checked={notificationSettings?.push_notifications || false}
                  onCheckedChange={(checked) => handleSettingChange('push_notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                SMS Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable SMS Notifications</Label>
                  <p className="text-xs text-gray-600">Send notifications via SMS for critical updates</p>
                </div>
                <Switch
                  checked={notificationSettings?.sms_notifications || false}
                  onCheckedChange={(checked) => handleSettingChange('sms_notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
