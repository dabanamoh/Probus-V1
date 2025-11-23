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
  Calendar,
  FileText,
  Download,
  BookOpen,
  Shield,
  LogOut,
  Key,
  Bell,
  Palette,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plug,
  Plus
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import EmailSetup from '../../shared/forms/EmailSetup';

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

interface Policy {
  id: string;
  title: string;
  category: string;
  version: string;
  lastUpdated: string;
  status: 'active' | 'pending' | 'archived';
  requiresAcknowledgment: boolean;
  acknowledged?: boolean;
  description: string;
}

interface LeaveRequest {
  id: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'other';
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewer?: string;
  rejectionReason?: string;
}

interface ActivityRecord {
  id: string;
  date: string;
  type: 'email_sent' | 'email_received' | 'chat_message' | 'task_completed' | 'meeting_attended' | 'absent' | 'late';
  count: number;
  details?: string;
}

interface ResignationRequest {
  id: string;
  reason: string;
  lastWorkingDay: string;
  status: 'draft' | 'manager_pending' | 'hr_pending' | 'approved' | 'rejected';
  submittedAt: string;
  managerReview?: {
    status: 'pending' | 'approved' | 'rejected';
    reviewedAt?: string;
    reviewer?: string;
    comments?: string;
  };
  hrReview?: {
    status: 'pending' | 'approved' | 'rejected';
    reviewedAt?: string;
    reviewer?: string;
    comments?: string;
  };
  withdrawalReason?: string;
}

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestData, setRequestData] = useState({ name: '', useCase: '' });
  
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
  
  // Policies state
  const [policies] = useState<Policy[]>([
    {
      id: '1',
      title: 'Code of Conduct',
      category: 'General',
      version: '2.1',
      lastUpdated: '2025-09-01',
      status: 'active',
      requiresAcknowledgment: true,
      acknowledged: true,
      description: 'Our core principles and expected behaviors for all employees.'
    },
    {
      id: '2',
      title: 'Data Privacy Policy',
      category: 'Compliance',
      version: '3.0',
      lastUpdated: '2025-08-15',
      status: 'active',
      requiresAcknowledgment: true,
      acknowledged: false,
      description: 'Guidelines for handling sensitive company and customer data.'
    },
    {
      id: '3',
      title: 'Remote Work Policy',
      category: 'Workplace',
      version: '1.5',
      lastUpdated: '2025-07-22',
      status: 'active',
      requiresAcknowledgment: false,
      description: 'Rules and best practices for remote work arrangements.'
    },
    {
      id: '4',
      title: 'Anti-Harassment Policy',
      category: 'HR',
      version: '4.2',
      lastUpdated: '2025-09-10',
      status: 'active',
      requiresAcknowledgment: true,
      acknowledged: true,
      description: 'Procedures for reporting and addressing harassment in the workplace.'
    }
  ]);
  
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

  // Leave management state
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      type: 'annual',
      startDate: '2025-09-15',
      endDate: '2025-09-17',
      duration: 3,
      reason: 'Family vacation',
      status: 'approved',
      submittedAt: '2025-09-01T10:30:00Z',
      reviewedAt: '2025-09-02T14:20:00Z',
      reviewer: 'HR Manager'
    },
    {
      id: '2',
      type: 'sick',
      startDate: '2025-09-25',
      endDate: '2025-09-26',
      duration: 2,
      reason: 'Medical appointment',
      status: 'pending',
      submittedAt: '2025-09-20T09:15:00Z'
    }
  ]);

  const [newLeaveRequest, setNewLeaveRequest] = useState({
    type: 'annual' as 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'other',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Activity tracking state
  const [activityRecords] = useState<ActivityRecord[]>([
    { id: '1', date: '2025-09-01', type: 'email_sent', count: 15, details: 'Weekly email summary' },
    { id: '2', date: '2025-09-01', type: 'email_received', count: 23, details: 'Daily email intake' },
    { id: '3', date: '2025-09-01', type: 'chat_message', count: 42, details: 'Team communication' },
    { id: '4', date: '2025-09-01', type: 'task_completed', count: 3, details: 'Project milestones' },
    { id: '5', date: '2025-09-02', type: 'meeting_attended', count: 2, details: 'Team sync and client call' },
    { id: '6', date: '2025-09-03', type: 'email_sent', count: 18, details: 'Project updates' },
    { id: '7', date: '2025-09-03', type: 'email_received', count: 31, details: 'Client communications' },
    { id: '8', date: '2025-09-03', type: 'chat_message', count: 28, details: 'Support requests' },
    { id: '9', date: '2025-09-04', type: 'task_completed', count: 2, details: 'Bug fixes' },
    { id: '10', date: '2025-09-04', type: 'meeting_attended', count: 1, details: 'Sprint planning' },
    { id: '11', date: '2025-09-05', type: 'email_sent', count: 12, details: 'Status reports' },
    { id: '12', date: '2025-09-05', type: 'email_received', count: 19, details: 'Internal communications' },
    { id: '13', date: '2025-09-05', type: 'chat_message', count: 35, details: 'Team collaboration' },
    { id: '14', date: '2025-09-05', type: 'absent', count: 1, details: 'Annual leave' },
    { id: '15', date: '2025-09-06', type: 'email_sent', count: 8, details: 'Weekend summary' },
    { id: '16', date: '2025-09-06', type: 'email_received', count: 14, details: 'Weekend messages' },
    { id: '17', date: '2025-09-06', type: 'chat_message', count: 12, details: 'Weekend support' },
  ]);

  // Resignation state
  const [resignationRequest, setResignationRequest] = useState<ResignationRequest | null>(null);
  const [newResignation, setNewResignation] = useState({
    reason: '',
    lastWorkingDay: ''
  });

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated."
    });
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLeaveRequest.startDate || !newLeaveRequest.endDate || !newLeaveRequest.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const startDate = new Date(newLeaveRequest.startDate);
    const endDate = new Date(newLeaveRequest.endDate);
    
    if (startDate > endDate) {
      toast({
        title: "Error",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const leaveRequest: LeaveRequest = {
      id: `leave-${Date.now()}`,
      ...newLeaveRequest,
      duration,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    setLeaveRequests([leaveRequest, ...leaveRequests]);
    setNewLeaveRequest({
      type: 'annual',
      startDate: '',
      endDate: '',
      reason: ''
    });

    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted for approval."
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <div className="w-2 h-2 rounded-full bg-green-500"></div>;
      case 'pending': return <div className="w-2 h-2 rounded-full bg-yellow-500"></div>;
      default: return <div className="w-2 h-2 rounded-full bg-gray-500"></div>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      default: return 'Archived';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Approved
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" /> Rejected
        </span>;
      case 'manager_pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" /> Manager Review
        </span>;
      case 'hr_pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <AlertCircle className="w-3 h-3 mr-1" /> HR Review
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" /> Pending
        </span>;
    }
  };

  const handleAcknowledge = (id: string) => {
    toast({
      title: "Policy Acknowledged",
      description: "You have acknowledged this policy."
    });
    // In a real app, this would send a request to the backend
    console.log(`Acknowledged policy ${id}`);
  };

  const handleViewPolicy = (id: string) => {
    // In a real app, this would open the policy document
    console.log(`Viewing policy ${id}`);
  };

  const handleResignationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newResignation.reason || !newResignation.lastWorkingDay) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const resignation: ResignationRequest = {
      id: `resignation-${Date.now()}`,
      reason: newResignation.reason,
      lastWorkingDay: newResignation.lastWorkingDay,
      status: 'manager_pending',
      submittedAt: new Date().toISOString(),
      managerReview: {
        status: 'pending'
      }
    };

    setResignationRequest(resignation);
    
    toast({
      title: "Resignation Submitted",
      description: "Your resignation has been submitted to your manager for review."
    });
  };

  const handleResignationWithdraw = (reason: string) => {
    if (resignationRequest) {
      const updatedResignation = {
        ...resignationRequest,
        status: 'draft' as const,
        withdrawalReason: reason
      };
      
      setResignationRequest(updatedResignation);
      
      toast({
        title: "Resignation Withdrawn",
        description: "Your resignation has been withdrawn."
      });
    }
  };

  // Standardized tab order across all roles
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'policies', label: 'Policies', icon: BookOpen },
    { id: 'leave', label: 'Leave Management', icon: Calendar },
    { id: 'resignation', label: 'Resignation', icon: FileText },
    { id: 'signout', label: 'Sign Out', icon: LogOut }
  ];
  
  const handleRequestApp = () => {
    if (!requestData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an integration name",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Request Submitted",
      description: `Your request for ${requestData.name} has been sent to the Admin team. You'll be notified once it's reviewed.`,
    });
    setRequestData({ name: '', useCase: '' });
    setShowRequestDialog(false);
  };

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

          {/* Leave Management Tab */}
          {activeTab === 'leave' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Leave Management</CardTitle>
                  <p className="text-gray-600 text-sm">Apply for leave and track your leave history</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <Calendar className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm text-blue-700">Annual Leave</p>
                          <p className="text-2xl font-bold text-blue-900">15 days</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <Clock className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                          <p className="text-sm text-green-700">Used</p>
                          <p className="text-2xl font-bold text-green-900">3 days</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-lg border border-amber-200">
                      <div className="flex items-center">
                        <Calendar className="w-8 h-8 text-amber-600 mr-3" />
                        <div>
                          <p className="text-sm text-amber-700">Remaining</p>
                          <p className="text-2xl font-bold text-amber-900">12 days</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 mb-6">
                    <nav className="flex space-x-8">
                      <button className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                        Apply for Leave
                      </button>
                    </nav>
                  </div>

                  <form onSubmit={handleLeaveSubmit} className="max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label htmlFor="leaveType" className="text-sm font-medium">Leave Type</Label>
                        <select
                          id="leaveType"
                          value={newLeaveRequest.type}
                          onChange={(e) => setNewLeaveRequest({...newLeaveRequest, type: e.target.value as any})}
                          className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="annual">Annual Leave</option>
                          <option value="sick">Sick Leave</option>
                          <option value="personal">Personal Leave</option>
                          <option value="maternity">Maternity Leave</option>
                          <option value="paternity">Paternity Leave</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="duration" className="text-sm font-medium">Leave Duration</Label>
                        <Input
                          id="duration"
                          type="text"
                          value={`${newLeaveRequest.startDate && newLeaveRequest.endDate ? 
                            Math.ceil((new Date(newLeaveRequest.endDate).getTime() - new Date(newLeaveRequest.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0} days`}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newLeaveRequest.startDate}
                          onChange={(e) => setNewLeaveRequest({...newLeaveRequest, startDate: e.target.value})}
                          className="mt-1"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newLeaveRequest.endDate}
                          onChange={(e) => setNewLeaveRequest({...newLeaveRequest, endDate: e.target.value})}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <Label htmlFor="reason" className="text-sm font-medium">Reason for Leave</Label>
                      <Textarea
                        id="reason"
                        rows={4}
                        value={newLeaveRequest.reason}
                        onChange={(e) => setNewLeaveRequest({...newLeaveRequest, reason: e.target.value})}
                        className="mt-1"
                        placeholder="Please provide a detailed reason for your leave request..."
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                      Submit Leave Request
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Leave History</CardTitle>
                  <p className="text-gray-600 text-sm">View your past and pending leave requests</p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leaveRequests.map((request) => (
                          <tr key={request.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                              {request.type} Leave
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {request.duration} day{request.duration > 1 ? 's' : ''}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {getStatusBadge(request.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(request.submittedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Analytics section has been moved to the Dashboard page */}
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Policies</CardTitle>
                  <p className="text-gray-600 text-sm">Review and acknowledge company policies</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {policies.map(policy => (
                      <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
                              <div>
                                <h3 className="font-semibold text-base">{policy.title}</h3>
                                <p className="text-gray-600 text-sm mt-1">{policy.description}</p>
                                <div className="flex flex-wrap items-center mt-2 text-xs gap-3">
                                  <span className="flex items-center gap-1 text-gray-500">
                                    Category: <span className="font-medium">{policy.category}</span>
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-500">
                                    Version: <span className="font-medium">{policy.version}</span>
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-500">
                                    Updated: <span className="font-medium">{policy.lastUpdated}</span>
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-500">
                                    Status: 
                                    <span className="font-medium flex items-center gap-1">
                                      {getStatusIcon(policy.status)}
                                      {getStatusText(policy.status)}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewPolicy(policy.id)}
                              className="text-xs"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            {policy.requiresAcknowledgment && !policy.acknowledged && (
                              <Button 
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-xs"
                                onClick={() => handleAcknowledge(policy.id)}
                              >
                                Acknowledge
                              </Button>
                            )}
                            {policy.requiresAcknowledgment && policy.acknowledged && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled
                                className="text-xs"
                              >
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                                Acknowledged
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <p className="text-gray-600 text-sm">Customize the look and feel of your dashboard</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-xl">
                  <div>
                    <h3 className="font-medium mb-2">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border-2 border-blue-500 rounded-lg p-4 cursor-pointer">
                        <div className="bg-white h-8 rounded mb-2"></div>
                        <p className="text-sm font-medium">Light</p>
                      </div>
                      <div className="border rounded-lg p-4 cursor-pointer">
                        <div className="bg-gray-800 h-8 rounded mb-2"></div>
                        <p className="text-sm font-medium">Dark</p>
                      </div>
                      <div className="border rounded-lg p-4 cursor-pointer">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-8 rounded mb-2"></div>
                        <p className="text-sm font-medium">System</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Language</h3>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resignation Tab */}
          {activeTab === 'resignation' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resignation</CardTitle>
                  <p className="text-gray-600 text-sm">Submit your resignation request</p>
                </CardHeader>
                <CardContent>
                  {!resignationRequest ? (
                    <form onSubmit={handleResignationSubmit} className="max-w-2xl">
                      <div className="mb-6">
                        <Label htmlFor="reason" className="text-sm font-medium">Reason for Resignation *</Label>
                        <Textarea
                          id="reason"
                          rows={5}
                          value={newResignation.reason}
                          onChange={(e) => setNewResignation({...newResignation, reason: e.target.value})}
                          className="mt-1"
                          placeholder="Please provide a detailed reason for your resignation..."
                          required
                        />
                      </div>
                      
                      <div className="mb-6">
                        <Label htmlFor="lastWorkingDay" className="text-sm font-medium">Last Working Day *</Label>
                        <Input
                          id="lastWorkingDay"
                          type="date"
                          value={newResignation.lastWorkingDay}
                          onChange={(e) => setNewResignation({...newResignation, lastWorkingDay: e.target.value})}
                          className="mt-1"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Please note that a standard notice period of 30 days is required</p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Shield className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Resignation Process</h3>
                            <div className="mt-2 text-sm text-blue-700">
                              <p>Your resignation will follow this approval workflow:</p>
                              <ol className="list-decimal list-inside mt-2 space-y-1">
                                <li>Submission to your direct manager for initial review</li>
                                <li>HR department review after manager approval</li>
                                <li>Final confirmation of resignation status</li>
                              </ol>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button type="submit" className="bg-red-500 hover:bg-red-600">
                        Submit Resignation
                      </Button>
                    </form>
                  ) : (
                    <div className="max-w-3xl">
                      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Resignation Request</h3>
                            <p className="text-sm text-gray-500">Submitted on {new Date(resignationRequest.submittedAt).toLocaleDateString()}</p>
                          </div>
                          {getStatusBadge(resignationRequest.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <Label className="text-xs text-gray-500">Reason</Label>
                            <p className="text-sm mt-1">{resignationRequest.reason}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Last Working Day</Label>
                            <p className="text-sm mt-1">{new Date(resignationRequest.lastWorkingDay).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        {/* Manager Review Status */}
                        <div className="border-t border-gray-200 pt-4 mb-4">
                          <h4 className="font-medium text-gray-900 mb-3">Manager Review</h4>
                          {resignationRequest.managerReview?.status === 'pending' ? (
                            <div className="flex items-center text-yellow-800 bg-yellow-50 px-3 py-2 rounded-md">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              <span className="text-sm">Pending manager review</span>
                            </div>
                          ) : resignationRequest.managerReview?.status === 'approved' ? (
                            <div className="flex items-center text-green-800 bg-green-50 px-3 py-2 rounded-md">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              <div>
                                <span className="text-sm font-medium">Approved</span>
                                {resignationRequest.managerReview.reviewedAt && (
                                  <span className="text-xs block">Reviewed on {new Date(resignationRequest.managerReview.reviewedAt).toLocaleDateString()}</span>
                                )}
                                {resignationRequest.managerReview.reviewer && (
                                  <span className="text-xs block">By {resignationRequest.managerReview.reviewer}</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-800 bg-red-50 px-3 py-2 rounded-md">
                              <XCircle className="w-4 h-4 mr-2" />
                              <div>
                                <span className="text-sm font-medium">Rejected</span>
                                {resignationRequest.managerReview?.reviewedAt && (
                                  <span className="text-xs block">Reviewed on {new Date(resignationRequest.managerReview.reviewedAt).toLocaleDateString()}</span>
                                )}
                                {resignationRequest.managerReview?.reviewer && (
                                  <span className="text-xs block">By {resignationRequest.managerReview.reviewer}</span>
                                )}
                                {resignationRequest.managerReview?.comments && (
                                  <p className="text-xs mt-1">Comments: {resignationRequest.managerReview.comments}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* HR Review Status */}
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-medium text-gray-900 mb-3">HR Review</h4>
                          {resignationRequest.status === 'manager_pending' ? (
                            <div className="flex items-center text-gray-800 bg-gray-50 px-3 py-2 rounded-md">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              <span className="text-sm">Waiting for manager approval</span>
                            </div>
                          ) : resignationRequest.hrReview?.status === 'pending' ? (
                            <div className="flex items-center text-yellow-800 bg-yellow-50 px-3 py-2 rounded-md">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              <span className="text-sm">Pending HR review</span>
                            </div>
                          ) : resignationRequest.hrReview?.status === 'approved' ? (
                            <div className="flex items-center text-green-800 bg-green-50 px-3 py-2 rounded-md">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              <div>
                                <span className="text-sm font-medium">Approved</span>
                                {resignationRequest.hrReview.reviewedAt && (
                                  <span className="text-xs block">Reviewed on {new Date(resignationRequest.hrReview.reviewedAt).toLocaleDateString()}</span>
                                )}
                                {resignationRequest.hrReview.reviewer && (
                                  <span className="text-xs block">By {resignationRequest.hrReview.reviewer}</span>
                                )}
                              </div>
                            </div>
                          ) : resignationRequest.hrReview?.status === 'rejected' ? (
                            <div className="flex items-center text-red-800 bg-red-50 px-3 py-2 rounded-md">
                              <XCircle className="w-4 h-4 mr-2" />
                              <div>
                                <span className="text-sm font-medium">Rejected</span>
                                {resignationRequest.hrReview?.reviewedAt && (
                                  <span className="text-xs block">Reviewed on {new Date(resignationRequest.hrReview.reviewedAt).toLocaleDateString()}</span>
                                )}
                                {resignationRequest.hrReview?.reviewer && (
                                  <span className="text-xs block">By {resignationRequest.hrReview.reviewer}</span>
                                )}
                                {resignationRequest.hrReview?.comments && (
                                  <p className="text-xs mt-1">Comments: {resignationRequest.hrReview.comments}</p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-800 bg-gray-50 px-3 py-2 rounded-md">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              <span className="text-sm">Not yet reviewed</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {resignationRequest.status !== 'approved' && resignationRequest.status !== 'rejected' && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Withdraw Resignation</h3>
                          <p className="text-sm text-gray-600 mb-4">If you wish to withdraw your resignation, please provide a reason below:</p>
                          
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            const reason = formData.get('withdrawalReason') as string;
                            handleResignationWithdraw(reason);
                          }}>
                            <div className="mb-4">
                              <Label htmlFor="withdrawalReason" className="text-sm font-medium">Reason for Withdrawal</Label>
                              <Textarea
                                id="withdrawalReason"
                                name="withdrawalReason"
                                rows={3}
                                className="mt-1"
                                placeholder="Please explain why you are withdrawing your resignation..."
                                required
                              />
                            </div>
                            <Button type="submit" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                              Withdraw Resignation
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {resignationRequest && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resignation Process Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <h4 className="text-gray-900">Next Steps</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Your manager will review your resignation within 3-5 business days</li>
                        <li>If approved by your manager, HR will conduct a final review</li>
                        <li>You will receive official confirmation of your resignation status</li>
                        <li>Schedule an exit interview with HR if your resignation is approved</li>
                        <li>Complete all necessary handover documentation</li>
                      </ul>
                      
                      <h4 className="text-gray-900 mt-4">Important Notes</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Your last working day must be at least 30 days from your submission date</li>
                        <li>All company property must be returned before your last working day</li>
                        <li>Your final paycheck will be processed according to company policy</li>
                        <li>Health benefits will end on your last day of employment</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Email Setup Tab */}
          {activeTab === 'email' && (
            <EmailSetup />
          )}
          
          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <Card>
              <CardHeader>
                <CardTitle>Integration Requests</CardTitle>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                  Request new integrations or apps to be added to the system. Your requests will be reviewed by the Admin team.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-6 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-center">
                    <Plug className="w-12 h-12 mx-auto text-gray-400 dark:text-slate-500 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                      Need a New Integration?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                      Can't find the integration you need? Request it from the Admin team.
                    </p>
                    <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Request Integration
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="dark:bg-slate-800 dark:border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="dark:text-slate-100">Request New Integration</DialogTitle>
                          <DialogDescription className="dark:text-slate-400">
                            Can't find the integration you need? Request it here and the Admin team will review your request.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label className="dark:text-slate-200">Integration Name *</Label>
                            <Input 
                              placeholder="e.g., Asana, Trello, Jira, Monday.com"
                              value={requestData.name}
                              onChange={(e) => setRequestData({ ...requestData, name: e.target.value })}
                              className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="dark:text-slate-200">Use Case (Optional)</Label>
                            <Textarea 
                              placeholder="How will you use this integration? What problem will it solve?"
                              value={requestData.useCase}
                              onChange={(e) => setRequestData({ ...requestData, useCase: e.target.value })}
                              className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button onClick={handleRequestApp} className="flex-1">
                              Submit Request
                            </Button>
                            <Button variant="outline" onClick={() => setShowRequestDialog(false)} className="dark:border-slate-600">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-3">Your Requests</h4>
                    <div className="text-sm text-gray-500 dark:text-slate-400 text-center py-8">
                      No integration requests yet. Submit one above to get started.
                    </div>
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
