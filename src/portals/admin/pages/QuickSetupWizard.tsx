import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Textarea } from "../../shared/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Users, 
  Mail, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Progress } from "../../shared/ui/progress";

const QuickSetupWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form data
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    industry: '',
    size: '',
    address: ''
  });

  const [emailSetup, setEmailSetup] = useState({
    adminEmail: '',
    domain: ''
  });

  const handleComplete = () => {
    toast({
      title: "Setup Complete!",
      description: "Your workspace is ready. Redirecting to dashboard...",
    });
    
    // Save setup completion flag
    localStorage.setItem('setupComplete', 'true');
    
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <div>
              <CardTitle className="text-2xl">Quick Setup Wizard</CardTitle>
              <p className="text-sm text-blue-100">Get your workspace ready in minutes</p>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-blue-300" />
          <p className="text-sm text-blue-100 mt-2">Step {step} of {totalSteps}</p>
        </CardHeader>

        <CardContent className="p-6">
          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Company Information</h3>
                  <p className="text-sm text-gray-600">Tell us about your organization</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Acme Corporation"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="Technology"
                    value={companyInfo.industry}
                    onChange={(e) => setCompanyInfo({...companyInfo, industry: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Company Size</Label>
                  <select
                    id="size"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={companyInfo.size}
                    onChange={(e) => setCompanyInfo({...companyInfo, size: e.target.value})}
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  placeholder="123 Main Street, City, State, ZIP"
                  rows={2}
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                />
              </div>
            </div>
          )}

          {/* Step 2: Email Setup */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Email Configuration</h3>
                  <p className="text-sm text-gray-600">Set up your communication</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Optional:</strong> You can skip this now and configure email later in Settings → Email Setup
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email Address</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@yourcompany.com"
                  value={emailSetup.adminEmail}
                  onChange={(e) => setEmailSetup({...emailSetup, adminEmail: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Company Email Domain</Label>
                <Input
                  id="domain"
                  placeholder="yourcompany.com"
                  value={emailSetup.domain}
                  onChange={(e) => setEmailSetup({...emailSetup, domain: e.target.value})}
                />
                <p className="text-xs text-gray-500">This will be used for employee email accounts</p>
              </div>
            </div>
          )}

          {/* Step 3: Departments */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Quick Start</h3>
                  <p className="text-sm text-gray-600">We'll create default departments for you</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Default Departments</h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Engineering
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Human Resources
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Sales
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Marketing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Finance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Operations
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                You can add, edit, or remove departments later from the Departments page.
              </p>
            </div>
          )}

          {/* Step 4: Policies */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <FileText className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Essential Policies</h3>
                  <p className="text-sm text-gray-600">We'll set up basic policies</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Default Policies</h4>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Code of Conduct
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Data Privacy & Security
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Anti-Harassment Policy
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Leave & Time Off
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> After setup, you can:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>• Add employees and invite them</li>
                  <li>• Configure email in Settings</li>
                  <li>• Customize policies</li>
                  <li>• Enable AI Safety monitoring</li>
                  <li>• Post your first company notice</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-6 border-t">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="ml-auto"
                disabled={step === 1 && !companyInfo.name}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="ml-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Setup
              </Button>
            )}
          </div>

          {/* Skip Option */}
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Skip setup for now
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickSetupWizard;
