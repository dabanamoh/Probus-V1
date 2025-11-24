
import React, { useState } from 'react';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Users, Building, Shield, Bell, LogOut, UserCog } from 'lucide-react';
import PermissionsSettings from '../components/settings/PermissionsSettings';
import CompanySettings from '../components/settings/CompanySettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import UserManagement from '../components/UserManagement';
import { useNavigate } from 'react-router-dom';

const Settings = () => {

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = () => {
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out."
    });

    // Clear all authentication-related localStorage items
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('isEmployeeLoggedIn');
    localStorage.removeItem('userRole');

    // Redirect to login page after a short delay to show the toast
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <DashboardLayout title="Settings" subtitle="Probus">
      <div className="flex-1 p-4 sm:p-6 overflow-auto max-w-full bg-blue-50">
        <div className="mb-6 max-w-full overflow-x-hidden">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-blue-900">Settings</h1>
              <p className="text-sm text-blue-600 mt-1">Manage your application settings and configurations</p>
            </div>
          </div>

          <Tabs defaultValue="users" className="w-full max-w-full overflow-x-hidden">
            <TabsList className="!h-auto grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 p-2 bg-white border border-blue-200 rounded-xl shadow-sm max-w-full">
              <TabsTrigger value="users" className="flex items-center justify-center gap-2 text-sm px-3 py-3 min-h-[48px] h-auto leading-normal rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 hover:bg-blue-50">
                <UserCog className="w-4 h-4 flex-shrink-0" />
                <span className="truncate hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center justify-center gap-2 text-sm px-3 py-3 min-h-[48px] h-auto leading-normal rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 hover:bg-blue-50">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="truncate hidden sm:inline">Permissions</span>
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center justify-center gap-2 text-sm px-3 py-3 min-h-[48px] h-auto leading-normal rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 hover:bg-blue-50">
                <Building className="w-4 h-4 flex-shrink-0" />
                <span className="truncate hidden sm:inline">Company</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center justify-center gap-2 text-sm px-3 py-3 min-h-[48px] h-auto leading-normal rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 hover:bg-blue-50">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span className="truncate hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center justify-center gap-2 text-sm px-3 py-3 min-h-[48px] h-auto leading-normal rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 hover:bg-blue-50">
                <Bell className="w-4 h-4 flex-shrink-0" />
                <span className="truncate hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="signout" className="flex items-center justify-center gap-2 text-sm px-3 py-3 min-h-[48px] h-auto leading-normal rounded-lg data-[state=active]:bg-red-50 data-[state=active]:text-red-700 hover:bg-blue-50">
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span className="truncate hidden sm:inline">Sign Out</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <Card className="border border-blue-200 shadow-sm rounded-xl">
                <CardHeader className="border-b border-blue-200 bg-white rounded-t-xl p-5">
                  <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <UserCog className="w-5 h-5 text-blue-600" />
                    </div>
                    User Account Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <UserManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="mt-6">
              <Card className="border border-blue-200 shadow-sm rounded-xl">
                <CardHeader className="border-b border-blue-200 bg-white rounded-t-xl p-5">
                  <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    Access & Permissions Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <PermissionsSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="mt-6">
              <Card className="border border-blue-200 shadow-sm rounded-xl">
                <CardHeader className="border-b border-blue-200 bg-white rounded-t-xl p-5">
                  <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-3">
                    <div className="p-2 bg-sky-50 rounded-lg">
                      <Building className="w-5 h-5 text-sky-600" />
                    </div>
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <CompanySettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card className="border border-blue-200 shadow-sm rounded-xl">
                <CardHeader className="border-b border-blue-200 bg-white rounded-t-xl p-5">
                  <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-3">
                    <div className="p-2 bg-cyan-50 rounded-lg">
                      <Shield className="w-5 h-5 text-cyan-600" />
                    </div>
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <SecuritySettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card className="border border-blue-200 shadow-sm rounded-xl">
                <CardHeader className="border-b border-blue-200 bg-white rounded-t-xl p-5">
                  <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <NotificationSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signout" className="mt-6">
              <Card className="border border-blue-200 shadow-sm rounded-xl">
                <CardHeader className="border-b border-blue-200 bg-white rounded-t-xl p-5">
                  <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <LogOut className="w-5 h-5 text-red-600" />
                    </div>
                    Sign Out
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="max-w-xl">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Shield className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-red-900 mb-1">Sign Out Warning</h3>
                          <p className="text-sm text-red-700 leading-relaxed">
                            You will be signed out of all devices. Make sure you're finished with your work before proceeding.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSignOut}
                      className="bg-red-600 hover:bg-red-700 rounded-xl shadow-sm h-10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
