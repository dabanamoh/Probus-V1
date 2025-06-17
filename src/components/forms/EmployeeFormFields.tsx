
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Department {
  id: string;
  name: string;
}

interface EmployeeFormFieldsProps {
  formData: any;
  departments?: Department[];
  onInputChange: (field: string, value: string) => void;
}

const EmployeeFormFields = ({ formData, departments, onInputChange }: EmployeeFormFieldsProps) => {
  const levelDescriptions = {
    'L7': 'L7 - B.Sc - Staffed with over 5+ years job experience and training / University Cert + Professional Cert.',
    'L8': 'L8 - B.Sc - Staffed with over 6+ years job experience and training / University Cert + Professional Cert.',
    'L9': 'L9 - B.Sc - Staffed with over 7+ years job experience and training / University Cert + Professional Cert.',
    'L10': 'L10 - MSc - Staffed with over 9+ years job experience and training / University Cert + Professional Cert.',
  };

  return (
    <>
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First name</Label>
          <Input
            id="firstName"
            placeholder="Type the first name here"
            value={formData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="middleName" className="text-sm font-medium text-gray-700">Middle Name</Label>
          <Input
            id="middleName"
            placeholder="Type the middle name here"
            value={formData.middleName}
            onChange={(e) => onInputChange('middleName', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Type the last name here"
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            required
            className="mt-1"
          />
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
          className="mt-1 max-w-md"
        />
      </div>

      {/* Qualification */}
      <div>
        <Label htmlFor="qualification" className="text-sm font-medium text-gray-700">Qualification</Label>
        <Input
          id="qualification"
          placeholder="Type in Qualification"
          value={formData.qualification}
          onChange={(e) => onInputChange('qualification', e.target.value)}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          e.g: School Cert + Diploma Cert + University Cert + Masters Cert + MBA Cert + PhD Cert
        </p>
      </div>

      {/* Certification */}
      <div>
        <Label htmlFor="certification" className="text-sm font-medium text-gray-700">Certification</Label>
        <Input
          id="certification"
          placeholder="Type in Certification"
          value={formData.certification}
          onChange={(e) => onInputChange('certification', e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Department */}
      <div>
        <Label htmlFor="department" className="text-sm font-medium text-gray-700">Department</Label>
        <Select value={formData.departmentId} onValueChange={(value) => onInputChange('departmentId', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select department name here" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Department</SelectItem>
            {departments?.map((department) => (
              <SelectItem key={department.id} value={department.id}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Position */}
      <div>
        <Label htmlFor="position" className="text-sm font-medium text-gray-700">Position</Label>
        <Input
          id="position"
          placeholder="Type employees Position"
          value={formData.position}
          onChange={(e) => onInputChange('position', e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Level */}
      <div>
        <Label htmlFor="level" className="text-sm font-medium text-gray-700">Level</Label>
        <div className="flex gap-4 mt-1">
          <Select value={formData.level} onValueChange={(value) => onInputChange('level', value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L7">L7</SelectItem>
              <SelectItem value="L8">L8</SelectItem>
              <SelectItem value="L9">L9</SelectItem>
              <SelectItem value="L10">L10</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 bg-gray-50 p-3 rounded-md border">
            <p className="text-sm font-medium text-gray-700 mb-2">Level Descriptions</p>
            {Object.entries(levelDescriptions).map(([level, description]) => (
              <p key={level} className="text-xs text-gray-600 mb-1">{description}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div>
        <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">Job description</Label>
        <Textarea
          id="jobDescription"
          placeholder="Type in a detail Job description in bullet format"
          value={formData.jobDescription}
          onChange={(e) => onInputChange('jobDescription', e.target.value)}
          className="mt-1 min-h-[100px]"
        />
      </div>

      {/* Date of Resumption */}
      <div>
        <Label htmlFor="dateOfResumption" className="text-sm font-medium text-gray-700">Date of Resumption</Label>
        <Input
          id="dateOfResumption"
          type="date"
          value={formData.dateOfResumption}
          onChange={(e) => onInputChange('dateOfResumption', e.target.value)}
          className="mt-1 max-w-md"
        />
      </div>
    </>
  );
};

export default EmployeeFormFields;
