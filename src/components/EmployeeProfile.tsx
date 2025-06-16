
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, GraduationCap, Award, Briefcase } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
  level: string;
  qualification: string;
  certifications: string;
  date_of_birth: string;
  job_description: string;
  date_of_resumption: string;
  profile_image_url: string;
}

interface EmployeeProfileProps {
  employee: Employee;
}

const EmployeeProfile = ({ employee }: EmployeeProfileProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <img
          src={employee.profile_image_url || '/placeholder.svg'}
          alt={employee.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
          <p className="text-lg text-gray-600">{employee.position}</p>
          <Badge variant="secondary" className="mt-2">{employee.level}</Badge>
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Date of Birth</label>
            <p className="text-gray-800">{formatDate(employee.date_of_birth)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Date of Resumption</label>
            <p className="text-gray-800">{formatDate(employee.date_of_resumption)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Qualifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Qualifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Education</label>
              <p className="text-gray-800">{employee.qualification}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Certifications</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {employee.certifications.split(',').map((cert, index) => (
                  <Badge key={index} variant="outline">{cert.trim()}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{employee.job_description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeProfile;
