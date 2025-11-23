import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader';
import MobileQuickMenu from '@/components/MobileQuickMenu';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, GraduationCap, Users, Heart, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";

interface Employee {
  id: string;
  name: string;
  position: string | null;
  department_id: string | null;
  level: string | null;
  qualification: string | null;
  certifications: string | null;
  date_of_birth: string | null;
  job_description: string | null;
  date_of_resumption: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
  department: {
    name: string;
  } | null;
  // Additional fields for employee details
  email?: string;
  phone?: string;
  address?: string;
  next_of_kin?: string;
  next_of_kin_email?: string;
  emergency_contact?: string;
  emergency_contact_email?: string;
  sex?: string;
  nationality?: string;
  religion?: string;
}

interface AIAssessment {
  id: string;
  employee_id: string;
  risk_level: "low" | "medium" | "high" | "critical";
  assessment_type: "behavioral" | "performance" | "compliance";
  analysis_data: Record<string, unknown>;
  confidence_score: number | null;
  recommendations: string[] | null;
  requires_action: boolean;
  reviewed_by: string | null;
  reviewed_at: string | null;
  expires_at: string | null;
  created_at: string;
}

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: employee, isLoading, error } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const { data, error } = await localDb
        .from('employees')
        .select(`
          *,
          department:departments (name)
        `)
        .eq('id', id)
        .limit(1);

      if (error) throw error;
      return data && data.length > 0 ? (data[0] as Employee) : null;
    },
    enabled: !!id
  });

  const { data: aiAssessments = [] } = useQuery({
    queryKey: ['ai-assessments', id],
    queryFn: async () => {
      const { data, error } = await localDb
        .from('ai_risk_assessments')
        .select('*')
        .eq('employee_id', id);

      if (error) throw error;
      return data as AIAssessment[];
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-4 md:p-6 md:ml-64 mt-16 md:mt-0">
          <div className="text-center py-8">Loading employee details...</div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-4 md:p-6 md:ml-64 mt-16 md:mt-0">
          <div className="text-center py-8 text-red-500">
            Error loading employee details: {error?.message || 'Employee not found'}
          </div>
        </div>
      </div>
    );
  }

  // Calculate age from date of birth
  const calculateAge = (dob: string | null) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Calculate years of service
  const calculateYearsOfService = (startDate: string | null) => {
    if (!startDate) return 'N/A';
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
    return diffYears.toFixed(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MobileHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="Employee Details" subtitle="Probus" />

      {/* Sidebar for desktop */}
      <div className="w-64 h-screen fixed top-0 left-0 z-30 hidden md:block">
        <Sidebar />
      </div>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="w-64 h-screen">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 p-4 md:p-6 md:ml-64 mt-16 md:mt-0 mb-20 md:mb-0">
        <div className="mb-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                className="mr-4"
                onClick={() => navigate('/employees')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Employees
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Employee Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Removed settings and power icons */}
            </div>
          </div>

          {/* Employee Overview Card */}
          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardTitle className="flex items-center">
                <img
                  src={employee.profile_image_url || '/placeholder.svg'}
                  alt={employee.name}
                  className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-white"
                />
                <div>
                  <h2 className="text-2xl">{employee.name}</h2>
                  <p className="text-blue-100">{employee.position || 'Position not specified'}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{employee.department?.name || 'Not assigned'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Level</p>
                    <p className="font-medium">{employee.level || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Years of Service</p>
                    <p className="font-medium">{calculateYearsOfService(employee.date_of_resumption)} years</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{employee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">
                      {employee.date_of_birth
                        ? `${new Date(employee.date_of_birth).toLocaleDateString()} (Age: ${calculateAge(employee.date_of_birth)})`
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">{employee.sex || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationality</p>
                    <p className="font-medium">{employee.nationality || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Religion</p>
                    <p className="font-medium">{employee.religion || 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-500" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{employee.email || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{employee.phone || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Home Address</p>
                    <p className="font-medium">{employee.address || 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-blue-500" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Next of Kin</p>
                    <p className="font-medium">{employee.next_of_kin || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next of Kin Email</p>
                    <p className="font-medium">{employee.next_of_kin_email || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Emergency Contact</p>
                    <p className="font-medium">{employee.emergency_contact || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Emergency Contact Email</p>
                    <p className="font-medium">{employee.emergency_contact_email || 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* Work Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-500" />
                    Work Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium">{employee.position || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{employee.department?.name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Level</p>
                    <p className="font-medium">{employee.level || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Resumption</p>
                    <p className="font-medium">
                      {employee.date_of_resumption
                        ? new Date(employee.date_of_resumption).toLocaleDateString()
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Years of Service</p>
                    <p className="font-medium">{calculateYearsOfService(employee.date_of_resumption)} years</p>
                  </div>
                </CardContent>
              </Card>

              {/* Qualifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-blue-500" />
                    Qualifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Highest Qualification</p>
                      <p className="font-medium">{employee.qualification || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Certifications</p>
                      {employee.certifications ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {employee.certifications.split(',').map((cert, index) => (
                            <Badge key={index} variant="secondary">{cert.trim()}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="font-medium">Not specified</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Risk Assessments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-5 h-5 mr-2 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    AI Risk Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {aiAssessments.length > 0 ? (
                    <div className="space-y-3">
                      {aiAssessments.map((assessment: AIAssessment) => (
                        <div key={assessment.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">
                                {assessment.assessment_type.charAt(0).toUpperCase() + assessment.assessment_type.slice(1)} Assessment
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(assessment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              className={
                                assessment.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                                  assessment.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    assessment.risk_level === 'high' ? 'bg-orange-100 text-orange-800' :
                                      'bg-red-100 text-red-800'
                              }
                            >
                              {assessment.risk_level.charAt(0).toUpperCase() + assessment.risk_level.slice(1)} Risk
                            </Badge>
                          </div>

                          {assessment.confidence_score && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Confidence:</span> {assessment.confidence_score}%
                            </div>
                          )}

                          {assessment.recommendations && assessment.recommendations.length > 0 && (
                            <div className="mt-2">
                              <p className="font-medium text-sm">Recommendations:</p>
                              <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                                {assessment.recommendations.map((rec: string, idx: number) => (
                                  <li key={idx}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No AI assessments available for this employee</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <MobileQuickMenu />
    </div>
  );
};

export default EmployeeDetails;
