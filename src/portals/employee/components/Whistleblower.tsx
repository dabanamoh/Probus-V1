import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Textarea } from "../../shared/ui/textarea";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Alert, AlertDescription } from "../../shared/ui/alert";
import { AlertCircle, Shield, FileText, Mail, Phone } from 'lucide-react';
// TODO: Re-enable when auditService is available
// import { logUserActivity } from '@/employee-app/services/auditService';

const Whistleblower = () => {
  const [report, setReport] = useState({
    subject: '',
    description: '',
    category: '',
    anonymous: true,
    contactMethod: 'email',
    contactInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setReport(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // In a real implementation, this would send to your backend
      // For now, we'll just log the event and simulate a successful submission
      console.log('Whistleblower report submitted:', report);
      
      // TODO: Re-enable when auditService is available
      // Log the whistleblower report submission
      // await logUserActivity({
      //   eventType: 'whistleblower_report_submitted',
      //   userId: 'anonymous', // Always anonymous
      //   timestamp: new Date().toISOString(),
      //   metadata: {
      //     subject: report.subject,
      //     category: report.category,
      //     anonymous: report.anonymous
      //   }
      // });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      
      // Reset form
      setReport({
        subject: '',
        description: '',
        category: '',
        anonymous: true,
        contactMethod: 'email',
        contactInfo: ''
      });
    } catch (error) {
      setSubmitError('Failed to submit report. Please try again.');
      console.error('Error submitting whistleblower report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Whistleblower Reporting</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Reporting Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Anonymous Incident Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Report any incidents, issues, or concerns within the company anonymously. 
                  Your identity will be protected, and the report will be securely handled by our compliance team.
                </p>
                
                {submitSuccess && (
                  <Alert className="mb-6 bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Report submitted successfully. Thank you for helping maintain our ethical standards.
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                {submitError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="subject" className="text-gray-700">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={report.subject}
                      onChange={handleInputChange}
                      placeholder="Briefly describe the incident"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-gray-700">Category</Label>
                    <select
                      id="category"
                      name="category"
                      value={report.category}
                      onChange={handleInputChange}
                      required
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a category</option>
                      <option value="financial">Financial Irregularities</option>
                      <option value="hr">Human Resources Issues</option>
                      <option value="safety">Safety Violations</option>
                      <option value="compliance">Compliance Violations</option>
                      <option value="discrimination">Discrimination/Harassment</option>
                      <option value="fraud">Fraud/Theft</option>
                      <option value="corruption">Corruption/Bribery</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-gray-700">Detailed Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={report.description}
                      onChange={handleInputChange}
                      placeholder="Please provide detailed information about the incident, including dates, individuals involved, and any supporting evidence..."
                      required
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      name="anonymous"
                      checked={report.anonymous}
                      onChange={handleInputChange}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="anonymous" className="text-gray-700">
                      Keep this report completely anonymous
                    </Label>
                  </div>
                  
                  {!report.anonymous && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-yellow-800">Non-anonymous Report</h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            You've chosen to provide contact information. While we'll handle your report with care, 
                            your identity will be known to the compliance team.
                          </p>
                          
                          <div className="mt-3 space-y-3">
                            <div>
                              <Label htmlFor="contactMethod" className="text-sm text-yellow-700">Preferred Contact Method</Label>
                              <select
                                id="contactMethod"
                                name="contactMethod"
                                value={report.contactMethod}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-yellow-50"
                              >
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                              </select>
                            </div>
                            
                            <div>
                              <Label htmlFor="contactInfo" className="text-sm text-yellow-700">
                                {report.contactMethod === 'email' ? 'Email Address' : 'Phone Number'}
                              </Label>
                              <Input
                                id="contactInfo"
                                name="contactInfo"
                                value={report.contactInfo}
                                onChange={handleInputChange}
                                placeholder={report.contactMethod === 'email' ? 'your.email@example.com' : '(123) 456-7890'}
                                className="mt-1 bg-yellow-50 border-yellow-300"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Information Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Confidentiality Guarantee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-blue-700">
                  <li className="flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>Your identity is completely protected</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>Reports are handled by our compliance team only</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>No retaliation will occur for good faith reports</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>All communications are encrypted and secure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Reporting Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">1</div>
                    <span>Provide as much detail as possible about the incident</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">2</div>
                    <span>Include dates, locations, and individuals involved</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">3</div>
                    <span>Attach any supporting documents if possible</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">4</div>
                    <span>Submit your report as soon as possible</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Need Immediate Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-blue-100">
                  For urgent matters or if you're in immediate danger, contact:
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">24/7 Compliance Hotline</p>
                    <p className="text-blue-100">1-800-COMPLIANCE</p>
                  </div>
                  <div>
                    <p className="font-medium">Emergency Services</p>
                    <p className="text-blue-100">911</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whistleblower;
