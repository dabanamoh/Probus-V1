
import React from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Scale, 
  Users, 
  Heart, 
  Lock, 
  AlertTriangle,
  FileText,
  Gavel
} from 'lucide-react';

const RulesEthics = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Rules & Ethics</h1>
                <p className="text-gray-600">Company policies, ethical guidelines, and compliance standards</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="code-of-conduct" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="code-of-conduct">Code of Conduct</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="reporting">Reporting</TabsTrigger>
            </TabsList>

            <TabsContent value="code-of-conduct" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Core Values & Principles
                  </CardTitle>
                  <CardDescription>
                    Fundamental principles that guide our behavior and decision-making
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Integrity</h3>
                        <p className="text-blue-700 text-sm">
                          We act with honesty, transparency, and ethical behavior in all our interactions.
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2">Respect</h3>
                        <p className="text-green-700 text-sm">
                          We treat all individuals with dignity, fairness, and consideration.
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h3 className="font-semibold text-purple-900 mb-2">Excellence</h3>
                        <p className="text-purple-700 text-sm">
                          We strive for the highest standards in everything we do.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h3 className="font-semibold text-orange-900 mb-2">Accountability</h3>
                        <p className="text-orange-700 text-sm">
                          We take responsibility for our actions and their consequences.
                        </p>
                      </div>
                      <div className="p-4 bg-teal-50 rounded-lg">
                        <h3 className="font-semibold text-teal-900 mb-2">Innovation</h3>
                        <p className="text-teal-700 text-sm">
                          We embrace change and continuously seek to improve and innovate.
                        </p>
                      </div>
                      <div className="p-4 bg-indigo-50 rounded-lg">
                        <h3 className="font-semibold text-indigo-900 mb-2">Collaboration</h3>
                        <p className="text-indigo-700 text-sm">
                          We work together to achieve common goals and support each other.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Workplace Conduct
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">Required</Badge>
                      <div>
                        <p className="font-medium">Professional Communication</p>
                        <p className="text-sm text-gray-600">Maintain respectful and professional communication in all interactions</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">Required</Badge>
                      <div>
                        <p className="font-medium">Harassment-Free Environment</p>
                        <p className="text-sm text-gray-600">Zero tolerance for harassment, discrimination, or bullying of any kind</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">Required</Badge>
                      <div>
                        <p className="font-medium">Confidentiality</p>
                        <p className="text-sm text-gray-600">Protect sensitive company and customer information</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="policies" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-gray-500" />
                      Data Protection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">Guidelines for handling personal and sensitive data</p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        GDPR compliance requirements
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        Data minimization principles
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        Secure data handling procedures
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      Information Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">Protecting company information and systems</p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Password requirements
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Access control policies
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Incident reporting procedures
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-500" />
                      Intellectual Property
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">Protection of company and third-party IP</p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        Copyright and trademark respect
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        Patent considerations
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        Trade secret protection
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gavel className="w-5 h-5 text-orange-500" />
                      Anti-Corruption
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">Preventing bribery and corruption</p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        Gift and entertainment limits
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        Conflict of interest disclosure
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        Fair dealing practices
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-blue-500" />
                    Regulatory Compliance
                  </CardTitle>
                  <CardDescription>
                    Our commitment to meeting all applicable laws and regulations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Employment Law</h3>
                      <p className="text-sm text-gray-600">Fair hiring, workplace safety, and labor standards</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Environmental</h3>
                      <p className="text-sm text-gray-600">Sustainable practices and environmental protection</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Financial</h3>
                      <p className="text-sm text-gray-600">Accurate reporting and financial transparency</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Compliance Monitoring</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="font-medium text-sm">Regular Audits</p>
                        <p className="text-sm text-gray-600">Quarterly compliance assessments and reviews</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-sm">Training Programs</p>
                        <p className="text-sm text-gray-600">Ongoing education on regulatory requirements</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reporting" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Ethics Reporting
                  </CardTitle>
                  <CardDescription>
                    How to report ethical concerns or violations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">Report Concerns Immediately</h3>
                    <p className="text-red-700 text-sm">
                      If you witness or suspect any violation of our ethics policies, please report it immediately through one of the channels below.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Reporting Channels</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm">Direct Supervisor</p>
                          <p className="text-xs text-gray-600">Speak directly with your immediate manager</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm">HR Department</p>
                          <p className="text-xs text-gray-600">Contact Human Resources at hr@company.com</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm">Ethics Hotline</p>
                          <p className="text-xs text-gray-600">Call 1-800-ETHICS (24/7 confidential)</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm">Anonymous Portal</p>
                          <p className="text-xs text-gray-600">Submit reports online anonymously</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Protection & Support</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">No Retaliation</p>
                            <p className="text-xs text-gray-600">Protection against retaliation for good faith reporting</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Lock className="w-4 h-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Confidentiality</p>
                            <p className="text-xs text-gray-600">Your identity will be protected to the extent possible</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Heart className="w-4 h-4 text-red-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Support Services</p>
                            <p className="text-xs text-gray-600">Counseling and support available if needed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RulesEthics;
