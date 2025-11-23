import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Textarea } from "../../shared/ui/textarea";
import { 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Heart,
  Upload,
  FileText,
  Image,
  IdCard,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { localDb } from '@/integrations/local-db';

const Registration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form, 2: Review, 3: Success
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form data state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    qualification: '',
    certification: '',
    emailAddress: '',
    emergencyContact: '',
    homeAddress: '',
    nationality: '',
    religion: '',
    nextOfKin: '',
    password: '',
    confirmPassword: ''
  });
  
  // File upload states
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [governmentId, setGovernmentId] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [otherDocuments, setOtherDocuments] = useState<File[]>([]);
  
  // Refs for file inputs
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const governmentIdRef = useRef<HTMLInputElement>(null);
  const certificatesRef = useRef<HTMLInputElement>(null);
  const otherDocumentsRef = useRef<HTMLInputElement>(null);

  // Handle file uploads
  const handleFileUpload = (fileList: FileList | null, fileType: string) => {
    if (!fileList || fileList.length === 0) return;
    
    const files = Array.from(fileList);
    
    switch (fileType) {
      case 'profile':
        setProfilePicture(files[0]);
        break;
      case 'id':
        setGovernmentId(files[0]);
        break;
      case 'certificates':
        setCertificates(prev => [...prev, ...files]);
        break;
      case 'other':
        setOtherDocuments(prev => [...prev, ...files]);
        break;
    }
    
    toast({
      title: "File Added",
      description: `${files.length} file(s) added successfully`
    });
  };

  // Remove uploaded files
  const removeFile = (fileType: string, index?: number) => {
    switch (fileType) {
      case 'profile':
        setProfilePicture(null);
        if (profilePictureRef.current) profilePictureRef.current.value = '';
        break;
      case 'id':
        setGovernmentId(null);
        if (governmentIdRef.current) governmentIdRef.current.value = '';
        break;
      case 'certificates':
        if (index !== undefined) {
          const newCertificates = [...certificates];
          newCertificates.splice(index, 1);
          setCertificates(newCertificates);
        }
        break;
      case 'other':
        if (index !== undefined) {
          const newDocuments = [...otherDocuments];
          newDocuments.splice(index, 1);
          setOtherDocuments(newDocuments);
        }
        break;
    }
    
    toast({
      title: "File Removed",
      description: "File removed successfully"
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle registration submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!registerData.firstName || !registerData.lastName || !registerData.emailAddress || 
        !registerData.password || !registerData.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    // Move to review step
    setStep(2);
  };

  // Confirm and submit registration
  const confirmAndSubmit = async () => {
    try {
      // Create a pending employee registration in the local database
      const { data, error } = await localDb
        .from('pending_employees')
        .insert([{
          id: Math.random().toString(36).substr(2, 9), // Simple ID generation
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          email: registerData.emailAddress,
          password: registerData.password, // In a real app, this would be hashed
          status: 'pending', // pending, approved, rejected
          rejection_reason: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]);
      
      if (error) {
        throw error;
      }
      
      // Store additional information in localStorage for later use during approval
      const additionalInfo = {
        dateOfBirth: registerData.dateOfBirth,
        qualification: registerData.qualification,
        certification: registerData.certification,
        phone: registerData.emergencyContact,
        address: registerData.homeAddress,
        nationality: registerData.nationality,
        religion: registerData.religion,
        nextOfKin: registerData.nextOfKin
      };
      
      // Save additional info with the same ID as the pending employee
      if (data && data[0]) {
        localStorage.setItem(`employee_additional_info_${data[0].id}`, JSON.stringify(additionalInfo));
        
        // Store file information (in a real app, you would upload files to a server)
        const fileData = {
          hasProfilePicture: !!profilePicture,
          hasGovernmentId: !!governmentId,
          certificateCount: certificates.length,
          otherDocumentCount: otherDocuments.length
        };
        localStorage.setItem(`employee_files_${data[0].id}`, JSON.stringify(fileData));
      }
      
      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted for admin approval. You will receive an email once approved.",
      });
      
      // Move to success step
      setStep(3);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred while submitting your registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Reset form and go back to step 1
  const resetForm = () => {
    setRegisterData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      qualification: '',
      certification: '',
      emailAddress: '',
      emergencyContact: '',
      homeAddress: '',
      nationality: '',
      religion: '',
      nextOfKin: '',
      password: '',
      confirmPassword: ''
    });
    
    setProfilePicture(null);
    setGovernmentId(null);
    setCertificates([]);
    setOtherDocuments([]);
    
    if (profilePictureRef.current) profilePictureRef.current.value = '';
    if (governmentIdRef.current) governmentIdRef.current.value = '';
    if (certificatesRef.current) certificatesRef.current.value = '';
    if (otherDocumentsRef.current) otherDocumentsRef.current.value = '';
    
    setStep(1);
  };

  // Render form step
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="absolute top-6 left-6 flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/login')}>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
            <img 
              src="/Probus Logo white.svg" 
              alt="Probus Logo" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold text-gray-800">Probus</h1>
            <p className="text-sm text-gray-600">Employee Productivity Suite</p>
          </div>
        </div>

        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Employee Registration</h1>
            <p className="text-gray-600">
              Register for access to the Probus Employee Productivity Suite
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                New Employee Registration
              </CardTitle>
              <CardDescription>
                Please fill in your personal details and upload required documents. Your registration will be sent to the admin for approval.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="firstName"
                        placeholder="First Name"
                        className="pl-10"
                        value={registerData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="lastName"
                        placeholder="Last Name"
                        className="pl-10"
                        value={registerData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        className="pl-10"
                        value={registerData.dateOfBirth}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="emailAddress"
                        type="email"
                        placeholder="Email Address"
                        className="pl-10"
                        value={registerData.emailAddress}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="pl-10 pr-10"
                        value={registerData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="pl-10 pr-10"
                        value={registerData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="qualification"
                        placeholder="Qualification"
                        className="pl-10"
                        value={registerData.qualification}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certification">Certification</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="certification"
                        placeholder="Certification"
                        className="pl-10"
                        value={registerData.certification}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="emergencyContact"
                        placeholder="Phone Number"
                        className="pl-10"
                        value={registerData.emergencyContact}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="nationality"
                        placeholder="Nationality"
                        className="pl-10"
                        value={registerData.nationality}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="homeAddress">Home Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Textarea
                      id="homeAddress"
                      placeholder="Home Address"
                      className="pl-10"
                      value={registerData.homeAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <div className="relative">
                      <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="religion"
                        placeholder="Religion"
                        className="pl-10"
                        value={registerData.religion}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextOfKin">Next of Kin</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="nextOfKin"
                        placeholder="Next of Kin"
                        className="pl-10"
                        value={registerData.nextOfKin}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Document Upload Section */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Required Documents
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Picture */}
                    <div className="space-y-2">
                      <Label>Profile Picture</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          ref={profilePictureRef}
                          accept="image/*"
                          className="hidden"
                          id="profilePicture"
                          onChange={(e) => handleFileUpload(e.target.files, 'profile')}
                        />
                        <label
                          htmlFor="profilePicture"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Image className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            {profilePicture ? profilePicture.name : "Click to upload profile picture"}
                          </span>
                          {profilePicture && (
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm" 
                              className="mt-2 w-full sm:w-auto"
                              onClick={() => removeFile('profile')}
                            >
                              Remove
                            </Button>
                          )}
                        </label>
                      </div>
                    </div>
                    
                    {/* Government ID */}
                    <div className="space-y-2">
                      <Label>Government ID</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          ref={governmentIdRef}
                          accept="image/*,.pdf"
                          className="hidden"
                          id="governmentId"
                          onChange={(e) => handleFileUpload(e.target.files, 'id')}
                        />
                        <label
                          htmlFor="governmentId"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <IdCard className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            {governmentId ? governmentId.name : "Click to upload government ID"}
                          </span>
                          {governmentId && (
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm" 
                              className="mt-2 w-full sm:w-auto"
                              onClick={() => removeFile('id')}
                            >
                              Remove
                            </Button>
                          )}
                        </label>
                      </div>
                    </div>
                    
                    {/* Certificates */}
                    <div className="space-y-2">
                      <Label>Certificates</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          ref={certificatesRef}
                          accept="image/*,.pdf"
                          className="hidden"
                          id="certificates"
                          onChange={(e) => handleFileUpload(e.target.files, 'certificates')}
                          multiple
                        />
                        <label
                          htmlFor="certificates"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <FileText className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload certificates
                          </span>
                        </label>
                        {certificates.length > 0 && (
                          <div className="mt-2 text-left">
                            <p className="text-sm font-medium">Uploaded certificates:</p>
                            <ul className="text-xs text-gray-600 mt-1">
                              {certificates.map((file, index) => (
                                <li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-1">
                                  <span className="truncate">{file.name}</span>
                                  <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="sm" 
                                    className="h-6 px-2 w-full sm:w-auto"
                                    onClick={() => removeFile('certificates', index)}
                                  >
                                    Remove
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Other Documents */}
                    <div className="space-y-2">
                      <Label>Other Documents</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          ref={otherDocumentsRef}
                          accept="image/*,.pdf"
                          className="hidden"
                          id="otherDocuments"
                          onChange={(e) => handleFileUpload(e.target.files, 'other')}
                          multiple
                        />
                        <label
                          htmlFor="otherDocuments"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <FileText className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload other documents
                          </span>
                        </label>
                        {otherDocuments.length > 0 && (
                          <div className="mt-2 text-left">
                            <p className="text-sm font-medium">Uploaded documents:</p>
                            <ul className="text-xs text-gray-600 mt-1">
                              {otherDocuments.map((file, index) => (
                                <li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-1">
                                  <span className="truncate">{file.name}</span>
                                  <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="sm" 
                                    className="h-6 px-2 w-full sm:w-auto"
                                    onClick={() => removeFile('other', index)}
                                  >
                                    Remove
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Registration Process</h4>
                  <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                    <li>Fill in your personal details and upload required documents</li>
                    <li>Review your information before submission</li>
                    <li>Admin will review and approve your registration</li>
                    <li>Once approved, you'll gain access to the employee dashboard</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                  Review Registration
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Render review step
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="absolute top-6 left-6 flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/login')}>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
            <img 
              src="/Probus Logo white.svg" 
              alt="Probus Logo" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold text-gray-800">Probus</h1>
            <p className="text-sm text-gray-600">Employee Productivity Suite</p>
          </div>
        </div>

        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Review Your Registration</h1>
            <p className="text-gray-600">
              Please review your information before submitting for approval
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Registration Review
              </CardTitle>
              <CardDescription>
                Verify all your information is correct before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row">
                      <span className="font-medium w-full sm:w-32 mb-1 sm:mb-0">First Name:</span>
                      <span>{registerData.firstName}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="font-medium w-full sm:w-32 mb-1 sm:mb-0">Last Name:</span>
                      <span>{registerData.lastName}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="font-medium w-full sm:w-32 mb-1 sm:mb-0">Date of Birth:</span>
                      <span>{registerData.dateOfBirth || 'Not provided'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="font-medium w-full sm:w-32 mb-1 sm:mb-0">Email:</span>
                      <span>{registerData.emailAddress}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="font-medium w-full sm:w-32 mb-1 sm:mb-0">Nationality:</span>
                      <span>{registerData.nationality || 'Not provided'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="font-medium w-full sm:w-32 mb-1 sm:mb-0">Religion:</span>
                      <span>{registerData.religion || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact & Professional</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row">
                      <span className="font-medium w-full sm:w-32 mb-1 sm:mb-0">Phone:</span>
                      <span>{registerData.emergencyContact || 'Not provided'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="font-medium w-full sm:w-32 mb-1 sm:mb-0">Address:</span>
                      <span>{registerData.homeAddress || 'Not provided'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="font-medium w-full sm:w-32 mb-1 sm:mb-0">Next of Kin:</span>
                      <span>{registerData.nextOfKin || 'Not provided'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="font-medium w-full sm:w-32 mb-1 sm:mb-0">Qualification:</span>
                      <span>{registerData.qualification || 'Not provided'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="font-medium w-full sm:w-32 mb-1 sm:mb-0">Certification:</span>
                      <span>{registerData.certification || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center">
                      <Image className="w-5 h-5 mr-2 text-blue-500" />
                      <span className="font-medium">Profile Picture</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {profilePicture ? profilePicture.name : 'Not uploaded'}
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center">
                      <IdCard className="w-5 h-5 mr-2 text-blue-500" />
                      <span className="font-medium">Government ID</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {governmentId ? governmentId.name : 'Not uploaded'}
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-500" />
                      <span className="font-medium">Certificates</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {certificates.length > 0 ? `${certificates.length} file(s) uploaded` : 'None uploaded'}
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-500" />
                      <span className="font-medium">Other Documents</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {otherDocuments.length > 0 ? `${otherDocuments.length} file(s) uploaded` : 'None uploaded'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Important:</strong> Please verify all information is correct before submitting. 
                      Once submitted, you will not be able to make changes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row w-full gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Edit
                </Button>
                <Button 
                  type="button" 
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                  onClick={confirmAndSubmit}
                >
                  Submit for Approval
                </Button>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Cancel and Exit
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Render success step
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="absolute top-6 left-6 flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/login')}>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
            <img 
              src="/Probus Logo white.svg" 
              alt="Probus Logo" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold text-gray-800">Probus</h1>
            <p className="text-sm text-gray-600">Employee Productivity Suite</p>
          </div>
        </div>

        <div className="w-full max-w-2xl">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Registration Submitted!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for completing your registration. Your information has been submitted for admin approval.
            </p>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                <ul className="text-left text-gray-700 space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <p className="ml-3">Your registration is being reviewed by our admin team</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <p className="ml-3">You will receive an email notification once approved</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <p className="ml-3">After approval, you can log in with your credentials</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
              >
                Go to Login
              </Button>
              <Button 
                variant="outline"
                onClick={resetForm}
              >
                Register Another Employee
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Registration;
