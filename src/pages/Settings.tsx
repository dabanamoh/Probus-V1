
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Users, Palette, Building, Shield, Bell } from 'lucide-react';
import PermissionsSettings from '@/components/settings/PermissionsSettings';
import ThemeSettings from '@/components/settings/ThemeSettings';
import CompanySettings from '@/components/settings/CompanySettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';

const Settings = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-600">Manage your application settings and configurations</p>
            </div>
          </div>

          <Tabs defaultValue="permissions" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="permissions" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="permissions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Access & Permissions Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PermissionsSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="theme" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Theme Customization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ThemeSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CompanySettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SecuritySettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NotificationSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
