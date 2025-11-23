import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button, buttonVariants } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Textarea } from "../../shared/ui/textarea";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  FileText,
  Download
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";

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

const Profile = () => {
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

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    
    // In a real app, you would send this data to your backend
    console.log('Profile updated:', editedProfile);
  };

  const documents = [
    { id: 1, name: 'Employee Handbook', type: 'PDF', size: '2.4 MB' },
    { id: 2, name: 'Benefits Guide', type: 'PDF', size: '1.8 MB' },
    { id: 3, name: 'Q3 Performance Review', type: 'PDF', size: '0.5 MB' },
    { id: 4, name: 'Pay Stub - September 2025', type: 'PDF', size: '0.3 MB' },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">My Profile</h1>
        <p className="text-gray-600 text-sm md:text-base">Manage your personal information and access documents</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {/* Profile Information */}
        <div className="space-y-4 md:space-y-6">
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
                    <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-sm w-full sm:w-auto">
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
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map(doc => (
                  <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 rounded-lg gap-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.type} • {doc.size}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs whitespace-nowrap">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - now stacked on mobile */}
        <div className="space-y-4 md:space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-20 h-20 md:w-24 md:h-24 mb-4">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="bg-blue-500 text-white text-xl md:text-2xl">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" className="w-full text-sm">
                Change Photo
              </Button>
              <Button variant="outline" className="w-full mt-2 text-sm">
                Remove
              </Button>
            </CardContent>
          </Card>

          {/* Employment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Employment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium text-sm">{profile.department}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Position</p>
                  <p className="font-medium text-sm">{profile.position}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="font-medium text-sm">{new Date(profile.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-sm">New York, NY</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
