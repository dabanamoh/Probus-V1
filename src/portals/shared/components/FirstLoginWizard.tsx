import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Key,
  CheckCircle,
  ChevronRight,
  Upload
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface WizardStepProps {
  currentStep: number;
  totalSteps: number;
}

const FirstLoginWizard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    phone: '',
    address: '',
    bio: '',
    emergencyContact: '',
    emergencyPhone: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const totalSteps = 4;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
      toast({
        title: "Profile Picture Uploaded",
        description: "Your profile picture has been selected"
      });
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Validate password change
    if (profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    // Save profile data
    localStorage.setItem('profileCompleted', 'true');
    localStorage.setItem(`profile_${user?.email}`, JSON.stringify(profileData));

    toast({
      title: "Profile Complete!",
      description: "Your profile has been set up successfully"
    });

    // Navigate to appropriate dashboard based on role
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'hr') {
      navigate('/hr');
    } else if (user?.role === 'manager') {
      navigate('/manager');
    } else {
      navigate('/app');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('profileCompleted', 'true');
    toast({
      title: "Profile Setup Skipped",
      description: "You can complete your profile later in Settings"
    });

    // Navigate to appropriate dashboard
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'hr') {
      navigate('/hr');
    } else if (user?.role === 'manager') {
      navigate('/manager');
    } else {
      navigate('/app');
    }
  };

  const StepIndicator = ({ currentStep, totalSteps }: WizardStepProps) => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            index + 1 <= currentStep 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {index + 1 < currentStep ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          {index < totalSteps - 1 && (
            <div className={`w-16 h-1 ${
              index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Probus! 🎉</h1>
          <p className="text-gray-600">Let's complete your profile to get started</p>
        </div>

        <StepIndicator currentStep={step} totalSteps={totalSteps} />

        <Card>
          {/* Step 1: Change Password */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Change Your Password
                </CardTitle>
                <CardDescription>
                  For security, please set a new password for your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password *</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={profileData.newPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Password Requirements:</strong>
                  </p>
                  <ul className="text-sm text-blue-600 list-disc pl-5 mt-2">
                    <li>At least 8 characters long</li>
                    <li>Include uppercase and lowercase letters</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Profile Picture */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Add Profile Picture
                </CardTitle>
                <CardDescription>
                  Upload a professional photo to personalize your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    {profilePicture ? (
                      <img 
                        src={URL.createObjectURL(profilePicture)} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="profilePicture"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="profilePicture">
                    <Button type="button" variant="outline" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </span>
                    </Button>
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG or GIF (max. 5MB)
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Contact Information */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Help us stay in touch with you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      className="pl-10"
                      value={profileData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <Textarea
                      id="address"
                      placeholder="Your address"
                      className="pl-10"
                      value={profileData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Emergency Contact & Bio */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Emergency Contact & Bio
                </CardTitle>
                <CardDescription>
                  Final step - Add emergency contact and a brief bio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Contact name"
                    value={profileData.emergencyContact}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="emergencyPhone"
                      placeholder="+1 (555) 000-0000"
                      className="pl-10"
                      value={profileData.emergencyPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </CardContent>
            </>
          )}

          <div className="p-6 border-t flex justify-between">
            <div>
              {step > 1 && (
                <Button onClick={handlePrevious} variant="outline">
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSkip} variant="ghost">
                Skip for Now
              </Button>
              {step < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="bg-gradient-to-r from-blue-500 to-blue-700">
                  Complete Profile
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FirstLoginWizard;
