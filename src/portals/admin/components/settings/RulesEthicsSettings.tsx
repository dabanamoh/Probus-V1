import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/ui/tabs";
import { Badge } from "../../../shared/ui/badge";
import { Separator } from "../../../shared/ui/separator";
import { Button } from "../../../shared/ui/button";
import { Textarea } from "../../../shared/ui/textarea";
import { Input } from "../../../shared/ui/input";
import { 
  Shield, 
  Scale, 
  Users, 
  Heart, 
  Lock, 
  AlertTriangle,
  FileText,
  Gavel,
  Edit,
  Save,
  Plus,
  X,
  BookOpen
} from 'lucide-react';
import PolicyEditor from '../../../shared/components/policy/PolicyEditor';

const RulesEthicsSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyValues, setCompanyValues] = useState([
    { title: "Integrity", description: "We act with honesty, transparency, and ethical behavior in all our interactions.", color: "blue" },
    { title: "Respect", description: "We treat all individuals with dignity, fairness, and consideration.", color: "green" },
    { title: "Excellence", description: "We strive for the highest standards in everything we do.", color: "purple" },
    { title: "Accountability", description: "We take responsibility for our actions and their consequences.", color: "orange" },
    { title: "Innovation", description: "We embrace change and continuously seek to improve and innovate.", color: "teal" },
    { title: "Collaboration", description: "We work together to achieve common goals and support each other.", color: "indigo" }
  ]);
  
  const [customPolicies, setCustomPolicies] = useState([
    { title: "Remote Work Policy", description: "Guidelines for working from home and flexible arrangements" },
    { title: "Social Media Policy", description: "Professional conduct on social media platforms" }
  ]);

  const [ethicsHotline, setEthicsHotline] = useState("1-800-ETHICS");
  const [hrEmail, setHrEmail] = useState("hr@company.com");
  const [companyMission, setCompanyMission] = useState("Enter your company mission statement here...");

  const addNewValue = () => {
    setCompanyValues([...companyValues, { title: "New Value", description: "Enter description...", color: "gray" }]);
  };

  const updateValue = (index: number, field: string, value: string) => {
    const updated = [...companyValues];
    updated[index] = { ...updated[index], [field]: value };
    setCompanyValues(updated);
  };

  const removeValue = (index: number) => {
    setCompanyValues(companyValues.filter((_, i) => i !== index));
  };

  const addNewPolicy = () => {
    setCustomPolicies([...customPolicies, { title: "New Policy", description: "Enter policy description..." }]);
  };

  const updatePolicy = (index: number, field: string, value: string) => {
    const updated = [...customPolicies];
    updated[index] = { ...updated[index], [field]: value };
    setCustomPolicies(updated);
  };

  const removePolicy = (index: number) => {
    setCustomPolicies(customPolicies.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Rules & Ethics</h2>
        <p className="text-gray-600">Company policies, ethical guidelines, and compliance standards</p>
      </div>

      {/* Editable Company Mission */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Company Mission & Values Statement</CardTitle>
          <CardDescription>Customize your organization's mission and values</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={companyMission}
              onChange={(e) => setCompanyMission(e.target.value)}
              placeholder="Enter your company mission statement..."
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-gray-700 italic bg-gray-50 p-4 rounded-lg">
              {companyMission}
            </p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="policy-editor" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="policy-editor">Policy Editor</TabsTrigger>
          <TabsTrigger value="code-of-conduct">Code of Conduct</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="policy-editor" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Policy Document Management
              </CardTitle>
              <CardDescription>
                Create, edit, publish, and manage all company policy documents
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <PolicyEditor userRole="admin" userId="admin-001" userName="Admin User" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code-of-conduct" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Core Values & Principles
                  </CardTitle>
                  <CardDescription>
                    Fundamental principles that guide our behavior and decision-making
                  </CardDescription>
                </div>
                {isEditing && (
                  <Button onClick={addNewValue} size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {companyValues.map((value, index) => (
                  <div key={index} className={`p-4 bg-${value.color}-50 rounded-lg relative`}>
                    {isEditing && (
                      <Button
                        onClick={() => removeValue(index)}
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={value.title}
                          onChange={(e) => updateValue(index, 'title', e.target.value)}
                          className="font-semibold"
                        />
                        <Textarea
                          value={value.description}
                          onChange={(e) => updateValue(index, 'description', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className={`font-semibold text-${value.color}-900 mb-2`}>{value.title}</h3>
                        <p className={`text-${value.color}-700 text-sm`}>{value.description}</p>
                      </>
                    )}
                  </div>
                ))}
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
              
              {isEditing && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Admin Note:</strong> You can customize these workplace conduct rules by editing this section. 
                    Consider adding company-specific policies like dress code, attendance requirements, or technology usage guidelines.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6 mt-6">
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

          {/* Custom Policies Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Custom Company Policies</CardTitle>
                  <CardDescription>Add your organization-specific policies</CardDescription>
                </div>
                {isEditing && (
                  <Button onClick={addNewPolicy} size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {customPolicies.map((policy, index) => (
                <div key={index} className="p-4 border rounded-lg relative">
                  {isEditing && (
                    <Button
                      onClick={() => removePolicy(index)}
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={policy.title}
                        onChange={(e) => updatePolicy(index, 'title', e.target.value)}
                        className="font-semibold"
                      />
                      <Textarea
                        value={policy.description}
                        onChange={(e) => updatePolicy(index, 'description', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold mb-2">{policy.title}</h3>
                      <p className="text-sm text-gray-600">{policy.description}</p>
                    </>
                  )}
                </div>
              ))}
              
              {customPolicies.length === 0 && !isEditing && (
                <p className="text-gray-500 italic text-center py-8">
                  No custom policies added yet. Click "Edit Content" to add company-specific policies.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6 mt-6">
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
              
              {isEditing && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Admin Note:</strong> Customize this section with your industry-specific compliance requirements. 
                    Consider adding regulations like HIPAA (healthcare), SOX (finance), or OSHA (workplace safety).
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6 mt-6">
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
                      {isEditing ? (
                        <Input
                          value={hrEmail}
                          onChange={(e) => setHrEmail(e.target.value)}
                          className="text-xs mt-1"
                          placeholder="hr@company.com"
                        />
                      ) : (
                        <p className="text-xs text-gray-600">Contact Human Resources at {hrEmail}</p>
                      )}
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">Ethics Hotline</p>
                      {isEditing ? (
                        <Input
                          value={ethicsHotline}
                          onChange={(e) => setEthicsHotline(e.target.value)}
                          className="text-xs mt-1"
                          placeholder="1-800-ETHICS"
                        />
                      ) : (
                        <p className="text-xs text-gray-600">Call {ethicsHotline} (24/7 confidential)</p>
                      )}
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
              
              {isEditing && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Admin Note:</strong> Update the contact information above with your organization's specific details. 
                    Consider adding additional reporting channels or local compliance requirements.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RulesEthicsSettings;
