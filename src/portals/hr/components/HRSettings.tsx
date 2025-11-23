import React, { useState } from 'react';
import { Settings, Shield, Users, Bell, Lock, Mail, Globe, Database, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Switch } from "../../shared/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import { Textarea } from "../../shared/ui/textarea";

const HRSettings = () => {
  const [settings, setSettings] = useState({
    // Access Control
    hrCanApproveLeave: true,
    hrCanEditSalary: false,
    hrCanTerminate: false,
    hrCanViewPayroll: true,
    
    // Notifications
    emailNewHire: true,
    emailTermination: true,
    emailLeaveRequest: true,
    emailPolicyUpdate: false,
    dailyDigest: true,
    weeklyReport: true,
    
    // System Settings
    companyName: 'Acme Corporation',
    hrEmail: 'hr@acme.com',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    probationPeriod: '90',
    annualLeave: '15',
    
    // Data & Privacy
    dataRetention: '7',
    auditLog: true,
    encryption: true,
    twoFactor: false
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #10b981;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#d1fae5;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 5L7.5 14.167L3.333 10" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#065f46;font-size:14px;">Settings Saved</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">HR settings updated successfully</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
    console.log('Saving settings:', settings);
  };

  const handleResetSettings = () => {
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #ef4444;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#fee2e2;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 5L5 15M5 5L15 15" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#991b1b;font-size:14px;">Settings Reset</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">All settings restored to defaults</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-blue-50/30 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">HR Settings</h1>
            <p className="text-blue-700">Configure HR system settings and preferences</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleResetSettings}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Reset to Defaults
            </Button>
            <Button 
              onClick={handleSaveSettings}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="access" className="space-y-4">
        <TabsList className="bg-blue-50 border border-blue-200">
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="privacy">Data & Privacy</TabsTrigger>
        </TabsList>

        {/* Access Control Tab */}
        <TabsContent value="access" className="space-y-4">
          <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Shield className="w-5 h-5 text-blue-600" />
                HR Role Permissions
              </CardTitle>
              <CardDescription className="text-blue-700">
                Manage what HR users can access and modify in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">Approve Leave Requests</Label>
                  <p className="text-xs text-gray-500 mt-1">Allow HR to approve or reject employee leave requests</p>
                </div>
                <Switch 
                  checked={settings.hrCanApproveLeave} 
                  onCheckedChange={(checked) => handleSettingChange('hrCanApproveLeave', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">Edit Salary Information</Label>
                  <p className="text-xs text-gray-500 mt-1">Allow HR to modify employee salary and compensation</p>
                </div>
                <Switch 
                  checked={settings.hrCanEditSalary} 
                  onCheckedChange={(checked) => handleSettingChange('hrCanEditSalary', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">Terminate Employees</Label>
                  <p className="text-xs text-gray-500 mt-1">Allow HR to process employee terminations</p>
                </div>
                <Switch 
                  checked={settings.hrCanTerminate} 
                  onCheckedChange={(checked) => handleSettingChange('hrCanTerminate', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">View Payroll Data</Label>
                  <p className="text-xs text-gray-500 mt-1">Allow HR to access payroll reports and information</p>
                </div>
                <Switch 
                  checked={settings.hrCanViewPayroll} 
                  onCheckedChange={(checked) => handleSettingChange('hrCanViewPayroll', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sky-900">
                <Bell className="w-5 h-5 text-sky-600" />
                Email Notifications
              </CardTitle>
              <CardDescription className="text-sky-700">
                Configure which events trigger email notifications to HR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-sky-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">New Hire Notifications</Label>
                  <p className="text-xs text-gray-500 mt-1">Get notified when a new employee is onboarded</p>
                </div>
                <Switch 
                  checked={settings.emailNewHire} 
                  onCheckedChange={(checked) => handleSettingChange('emailNewHire', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-sky-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">Termination Notifications</Label>
                  <p className="text-xs text-gray-500 mt-1">Get notified when an employee is terminated</p>
                </div>
                <Switch 
                  checked={settings.emailTermination} 
                  onCheckedChange={(checked) => handleSettingChange('emailTermination', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-sky-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">Leave Request Notifications</Label>
                  <p className="text-xs text-gray-500 mt-1">Get notified of new leave requests requiring approval</p>
                </div>
                <Switch 
                  checked={settings.emailLeaveRequest} 
                  onCheckedChange={(checked) => handleSettingChange('emailLeaveRequest', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-sky-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">Policy Update Notifications</Label>
                  <p className="text-xs text-gray-500 mt-1">Get notified when company policies are updated</p>
                </div>
                <Switch 
                  checked={settings.emailPolicyUpdate} 
                  onCheckedChange={(checked) => handleSettingChange('emailPolicyUpdate', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-sky-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">Daily Digest</Label>
                  <p className="text-xs text-gray-500 mt-1">Receive daily summary of HR activities and pending items</p>
                </div>
                <Switch 
                  checked={settings.dailyDigest} 
                  onCheckedChange={(checked) => handleSettingChange('dailyDigest', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-sky-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">Weekly Report</Label>
                  <p className="text-xs text-gray-500 mt-1">Receive weekly HR metrics and analytics report</p>
                </div>
                <Switch 
                  checked={settings.weeklyReport} 
                  onCheckedChange={(checked) => handleSettingChange('weeklyReport', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-900">
                <Settings className="w-5 h-5 text-indigo-600" />
                General System Settings
              </CardTitle>
              <CardDescription className="text-indigo-700">
                Configure company information and system defaults
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => handleSettingChange('companyName', e.target.value)}
                    className="border-indigo-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hrEmail">HR Department Email</Label>
                  <Input 
                    id="hrEmail"
                    type="email"
                    value={settings.hrEmail}
                    onChange={(e) => handleSettingChange('hrEmail', e.target.value)}
                    className="border-indigo-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger className="border-indigo-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                    <SelectTrigger className="border-indigo-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="probation">Probation Period (days)</Label>
                  <Input 
                    id="probation"
                    type="number"
                    value={settings.probationPeriod}
                    onChange={(e) => handleSettingChange('probationPeriod', e.target.value)}
                    className="border-indigo-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualLeave">Annual Leave Days</Label>
                  <Input 
                    id="annualLeave"
                    type="number"
                    value={settings.annualLeave}
                    onChange={(e) => handleSettingChange('annualLeave', e.target.value)}
                    className="border-indigo-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card className="border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-900">
                <Lock className="w-5 h-5 text-cyan-600" />
                Data Security & Privacy
              </CardTitle>
              <CardDescription className="text-cyan-700">
                Manage data retention, security, and compliance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dataRetention">Data Retention Period (years)</Label>
                <Select value={settings.dataRetention} onValueChange={(value) => handleSettingChange('dataRetention', value)}>
                  <SelectTrigger className="border-cyan-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 year</SelectItem>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="7">7 years</SelectItem>
                    <SelectItem value="10">10 years</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">How long to retain employee records after termination</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-cyan-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">Audit Logging</Label>
                  <p className="text-xs text-gray-500 mt-1">Track all HR system activities for compliance</p>
                </div>
                <Switch 
                  checked={settings.auditLog} 
                  onCheckedChange={(checked) => handleSettingChange('auditLog', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-cyan-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">Data Encryption</Label>
                  <p className="text-xs text-gray-500 mt-1">Encrypt sensitive employee data at rest</p>
                </div>
                <Switch 
                  checked={settings.encryption} 
                  onCheckedChange={(checked) => handleSettingChange('encryption', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-cyan-100">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">Two-Factor Authentication</Label>
                  <p className="text-xs text-gray-500 mt-1">Require 2FA for all HR users</p>
                </div>
                <Switch 
                  checked={settings.twoFactor} 
                  onCheckedChange={(checked) => handleSettingChange('twoFactor', checked)}
                />
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 text-sm">GDPR & Compliance</h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      Ensure all settings comply with local data protection regulations including GDPR, CCPA, and industry-specific requirements.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRSettings;
