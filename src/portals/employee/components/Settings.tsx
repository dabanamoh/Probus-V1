import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Textarea } from "../../shared/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../shared/ui/dialog";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Shield,
  LogOut,
  Key,
  Bell
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  startDate: string;
  address: string;
  bio: string;
}



const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile state
  const [profile, setProfile] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    position: 'Senior Developer',
    startDate: '2020-03-15',
    address: '123 Main St, New York, NY 10001',
    bio: 'Experienced software developer with a passion for creating efficient and scalable applications.'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ProfileData>(profile);
  
  // Security state
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false
  });

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated."
    });
  };



  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (securitySettings.newPassword !== securitySettings.confirmNewPassword) {
      toast({
        title: "Password Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would send this data to your backend
    console.log('Security settings updated:', securitySettings);
    
    toast({
      title: "Security Settings Updated",
      description: "Your password has been successfully changed."
    });
    
    setSecuritySettings({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  const handleNotificationChange = (setting: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSignOut = () => {
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out."
    });
    
    // Clear all authentication-related localStorage items
    localStorage.removeItem('isEmployeeLoggedIn');
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('userRole');
    
    // Redirect to login page after a short delay to show the toast
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };



  // Standardized tab order - MVP essentials only
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'signout', label: 'Sign Out', icon: LogOut }
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Settings</h1>
        <p className="text-gray-600 text-sm md:text-base">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-2 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <CardTitle>Personal Information</CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="text-sm">
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <Button onClick={handleSaveProfile} className="bg-blue-500 hover:bg-blue-600 text-sm w-full sm:w-auto">
                        Save Changes
                      </Button>
                      <Button onClick={() => {setIsEditing(false); setEditedProfile(profile);}} variant="outline" className="text-sm w-full sm:w-auto">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex-shrink-0">
                    <Avatar className="w-20 h-20 md:w-24 md:h-24">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback className="bg-blue-500 text-white text-xl md:text-2xl">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="w-full mt-3 text-sm">
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-xs md:text-sm">First Name</Label>
                          <Input
                            id="firstName"
                            value={editedProfile.firstName}
                            onChange={(e) => setEditedProfile({...editedProfile, firstName: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-xs md:text-sm">Last Name</Label>
                          <Input
                            id="lastName"
                            value={editedProfile.lastName}
                            onChange={(e) => setEditedProfile({...editedProfile, lastName: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-xs md:text-sm">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editedProfile.email}
                            onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-xs md:text-sm">Phone</Label>
                          <Input
                            id="phone"
                            value={editedProfile.phone}
                            onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="department" className="text-xs md:text-sm">Department</Label>
                          <Input
                            id="department"
                            value={editedProfile.department}
                            onChange={(e) => setEditedProfile({...editedProfile, department: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="position" className="text-xs md:text-sm">Position</Label>
                          <Input
                            id="position"
                            value={editedProfile.position}
                            onChange={(e) => setEditedProfile({...editedProfile, position: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="startDate" className="text-xs md:text-sm">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={editedProfile.startDate}
                            onChange={(e) => setEditedProfile({...editedProfile, startDate: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="address" className="text-xs md:text-sm">Address</Label>
                          <Input
                            id="address"
                            value={editedProfile.address}
                            onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="bio" className="text-xs md:text-sm">Bio</Label>
                          <Textarea
                            id="bio"
                            rows={4}
                            value={editedProfile.bio}
                            onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <Label className="text-gray-500 text-xs md:text-sm">Full Name</Label>
                          <p className="font-medium text-sm md:text-base">{profile.firstName} {profile.lastName}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500 text-xs md:text-sm">Email</Label>
                          <p className="font-medium text-sm md:text-base">{profile.email}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500 text-xs md:text-sm">Phone</Label>
                          <p className="font-medium text-sm md:text-base">{profile.phone}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500 text-xs md:text-sm">Department</Label>
                          <p className="font-medium text-sm md:text-base">{profile.department}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500 text-xs md:text-sm">Position</Label>
                          <p className="font-medium text-sm md:text-base">{profile.position}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500 text-xs md:text-sm">Start Date</Label>
                          <p className="font-medium text-sm md:text-base">{new Date(profile.startDate).toLocaleDateString()}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-gray-500 text-xs md:text-sm">Address</Label>
                          <p className="font-medium text-sm md:text-base">{profile.address}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-gray-500 text-xs md:text-sm">Bio</Label>
                          <p className="font-medium text-sm md:text-base">{profile.bio}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <p className="text-gray-600 text-sm">Manage your password and security preferences</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSecuritySubmit} className="space-y-4 max-w-xl">
                  <div>
                    <Label htmlFor="currentPassword" className="text-gray-700">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={securitySettings.currentPassword}
                      onChange={(e) => setSecuritySettings({...securitySettings, currentPassword: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newPassword" className="text-gray-700">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={securitySettings.newPassword}
                      onChange={(e) => setSecuritySettings({...securitySettings, newPassword: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmNewPassword" className="text-gray-700">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      value={securitySettings.confirmNewPassword}
                      onChange={(e) => setSecuritySettings({...securitySettings, confirmNewPassword: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <p className="text-gray-600 text-sm">Choose how you want to be notified</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-xl">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-gray-600 text-sm">Receive notifications via email</p>
                    </div>
                    <Button
                      variant={notifications.emailNotifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationChange('emailNotifications')}
                    >
                      {notifications.emailNotifications ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-gray-600 text-sm">Receive push notifications on your devices</p>
                    </div>
                    <Button
                      variant={notifications.pushNotifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationChange('pushNotifications')}
                    >
                      {notifications.pushNotifications ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">SMS Notifications</h3>
                      <p className="text-gray-600 text-sm">Receive text messages for important updates</p>
                    </div>
                    <Button
                      variant={notifications.smsNotifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationChange('smsNotifications')}
                    >
                      {notifications.smsNotifications ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sign Out Tab */}
          {activeTab === 'signout' && (
            <Card>
              <CardHeader>
                <CardTitle>Sign Out</CardTitle>
                <p className="text-gray-600 text-sm">Securely sign out of your account</p>
              </CardHeader>
              <CardContent>
                <div className="max-w-xl">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Shield className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Sign Out Warning</h3>
                        <p className="text-sm text-red-700 mt-1">
                          You will be signed out of all devices. Make sure you're finished with your work before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSignOut}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
