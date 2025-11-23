import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Users,
  Mail,
  Lock,
  UserPlus,
  Key,
  Eye,
  EyeOff,
  Building2
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Demo credentials validation
    const adminEmail = 'admin@probusemployee.com';
    const adminPassword = 'AdminPass123!';
    const employeeEmail = 'employee@probusemployee.com';
    const employeePassword = 'EmployeePass123!';
    const managerEmail = 'manager@probusemployee.com';
    const managerPassword = 'ManagerPass123!';
    const hrEmail = 'hr@probusemployee.com';
    const hrPassword = 'HRPass123!';

    if (!loginData.email || !loginData.password) {
      toast({
        title: "Login Failed",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Check credentials
    if (loginData.email === adminEmail && loginData.password === adminPassword) {
      login(loginData.email, 'admin');
      toast({
        title: "Login Successful",
        description: "Welcome Admin!",
      });
      navigate('/');
    } else if (loginData.email === employeeEmail && loginData.password === employeePassword) {
      login(loginData.email, 'employee');
      toast({
        title: "Login Successful",
        description: "Welcome Employee!",
      });
      navigate('/app');
    } else if (loginData.email === managerEmail && loginData.password === managerPassword) {
      login(loginData.email, 'manager');
      toast({
        title: "Login Successful",
        description: "Welcome Manager!",
      });
      navigate('/manager');
    } else if (loginData.email === hrEmail && loginData.password === hrPassword) {
      login(loginData.email, 'hr');
      toast({
        title: "Login Successful",
        description: "Welcome HR!",
      });
      navigate('/hr');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPasswordData.email) {
      // In a real app, this would be an API call
      toast({
        title: "Password Reset Sent",
        description: "Check your email for password reset instructions",
      });
      // Reset form
      setForgotPasswordData({
        email: ''
      });
    } else {
      toast({
        title: "Reset Failed",
        description: "Please enter your email address",
        variant: "destructive",
      });
    }
  };

  const handleDemoLogin = (email: string, password: string) => {
    setLoginData({ email, password });
    // Directly call the login function instead of simulating form submission
    setTimeout(() => {
      if (email === 'admin@probusemployee.com') {
        login(email, 'admin');
        toast({ title: "Login Successful", description: "Welcome Admin!" });
        navigate('/');
      } else if (email === 'employee@probusemployee.com') {
        login(email, 'employee');
        toast({ title: "Login Successful", description: "Welcome Employee!" });
        navigate('/app');
      } else if (email === 'manager@probusemployee.com') {
        login(email, 'manager');
        toast({ title: "Login Successful", description: "Welcome Manager!" });
        navigate('/manager');
      } else if (email === 'hr@probusemployee.com') {
        login(email, 'hr');
        toast({ title: "Login Successful", description: "Welcome HR!" });
        navigate('/hr');
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute top-6 left-6 flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Welcome to Probus</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Employee Productivity Suite - Streamline your workforce management and boost productivity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Employee Productivity Suite</h2>
              <p className="mb-6 opacity-90">
                Manage your workforce efficiently with our comprehensive platform designed for modern businesses.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  <span>Employee Management</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-3" />
                  <span>Department Analytics</span>
                </div>
                <div className="flex items-center">
                  <Key className="w-5 h-5 mr-3" />
                  <span>Performance Tracking</span>
                </div>
              </div>

              {/* Demo Credentials Information */}
              <div className="mt-8 pt-6 border-t border-blue-400 border-opacity-30">
                <h3 className="text-lg font-semibold mb-2">Demo Access</h3>
                <p className="text-sm opacity-90 mb-4">
                  Demo credentials are available in the project README file for authorized users.
                </p>
                <p className="text-xs opacity-75 mb-4">
                  Use the demo login buttons below with pre-configured credentials for quick access.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleDemoLogin('admin@probusemployee.com', 'AdminPass123!')}
                  >
                    Admin Demo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleDemoLogin('hr@probusemployee.com', 'HRPass123!')}
                  >
                    HR Demo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleDemoLogin('manager@probusemployee.com', 'ManagerPass123!')}
                  >
                    Manager Demo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleDemoLogin('employee@probusemployee.com', 'EmployeePass123!')}
                  >
                    Employee Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="forgot">Forgot Password</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Login to Your Account
                    </CardTitle>
                    <CardDescription>
                      Enter your credentials to access the dashboard
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@company.com"
                            className="pl-10"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                      <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                        Sign In
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate('/register')}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Employee Registration
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="forgot">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Key className="w-5 h-5 mr-2" />
                      Forgot Password
                    </CardTitle>
                    <CardDescription>
                      Enter your email to reset your password
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleForgotPassword}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="your.email@company.com"
                            className="pl-10"
                            value={forgotPasswordData.email}
                            onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                        Send Reset Link
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
