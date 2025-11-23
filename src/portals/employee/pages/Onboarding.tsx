import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { 
  User, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  Building2,
  Users
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { localDb } from '@/integrations/local-db';

const Onboarding = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password || !registerData.confirmPassword) {
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
    
    try {
      // Create a pending employee registration in the local database
      const { data, error } = await localDb
        .from('pending_employees')
        .insert([{
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          email: registerData.email,
          password: registerData.password, // In a real app, this would be hashed
          status: 'pending', // pending, approved, rejected
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted for admin approval. You will receive an email once approved.",
      });
      
      // Redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred while submitting your registration. Please try again.",
        variant: "destructive",
      });
    }
  };

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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Probus</h1>
          <p className="text-sm text-gray-600">Employee Productivity Suite</p>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Employee Onboarding</h1>
          <p className="text-gray-600">
            Register for access to the Probus Employee Productivity Suite
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              New Employee Registration
            </CardTitle>
            <CardDescription>
              Please fill in your personal details. Your registration will be sent to the admin for approval.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="first-name"
                      type="text"
                      placeholder="John"
                      className="pl-10"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="last-name"
                      type="text"
                      placeholder="Doe"
                      className="pl-10"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Work Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your.email@company.com"
                    className="pl-10"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
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
                <Label htmlFor="confirm-password">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
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
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Onboarding Process</h4>
                <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                  <li>Fill in your personal details and create your account</li>
                  <li>Admin will review and approve your registration</li>
                  <li>Once approved, you'll gain access to the employee dashboard</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                Submit for Approval
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/register')}
              >
                Enhanced Registration Form
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
};

export default Onboarding;
