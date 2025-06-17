
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
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
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Department {
  id: string;
  name: string;
}

const AddEmployeeForm = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    qualification: '',
    certification: '',
    departmentId: 'none', // Default to 'none' to match EditEmployeeForm
    position: '',
    level: '',
    jobDescription: '',
    dateOfResumption: '',
    nextOfKin: '',
    emailAddress: '',
    emergencyContact: '',
    homeAddress: '',
    nationality: '',
    religion: '',
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');
      if (error) throw error;
      return data as Department[];
    },
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (employeeData: any) => {
      const fullName = `${employeeData.firstName} ${employeeData.middleName} ${employeeData.lastName}`.trim();
      
      const { data, error } = await supabase
        .from('employees')
        .insert([{
          name: fullName,
          position: employeeData.position,
          department_id: employeeData.departmentId === 'none' ? null : employeeData.departmentId, // Match EditEmployeeForm logic
          level: employeeData.level,
          qualification: employeeData.qualification,
          certifications: employeeData.certification,
          date_of_birth: employeeData.dateOfBirth || null,
          job_description: employeeData.jobDescription,
          date_of_resumption: employeeData.dateOfResumption || null,
          profile_image_url: '/placeholder.svg'
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Success",
        description: "Employee created successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create employee",
        variant: "destructive",
      });
      console.error('Error creating employee:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEmployeeMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const levelDescriptions = {
    'L7': 'L7 - B.Sc - Staffed with over 5+ years job experience and training / University Cert + Professional Cert.',
    'L8': 'L8 - B.Sc - Staffed with over 6+ years job experience and training / University Cert + Professional Cert.',
    'L9': 'L9 - B.Sc - Staffed with over 7+ years job experience and training / University Cert + Professional Cert.',
    'L10': 'L10 - MSc - Staffed with over 9+ years job experience and training / University Cert + Professional Cert.',
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-xl font-semibold">Add Employee Data Forms</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First name</Label>
            <Input
              id="firstName"
              placeholder="Type the first name here"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
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
              onChange={(e) => handleInputChange('middleName', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Type the last name here"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
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
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
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
            onChange={(e) => handleInputChange('qualification', e.target.value)}
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
            onChange={(e) => handleInputChange('certification', e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Department */}
        <div>
          <Label htmlFor="department" className="text-sm font-medium text-gray-700">Department</Label>
          <Select value={formData.departmentId} onValueChange={(value) => handleInputChange('departmentId', value)}>
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
            onChange={(e) => handleInputChange('position', e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Level */}
        <div>
          <Label htmlFor="level" className="text-sm font-medium text-gray-700">Level</Label>
          <div className="flex gap-4 mt-1">
            <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
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
            onChange={(e) => handleInputChange('jobDescription', e.target.value)}
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
            onChange={(e) => handleInputChange('dateOfResumption', e.target.value)}
            className="mt-1 max-w-md"
          />
        </div>

        {/* Additional Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="nextOfKin" className="text-sm font-medium text-gray-700">Next of Kin</Label>
            <Input
              id="nextOfKin"
              placeholder="Name of Next of Kin"
              value={formData.nextOfKin}
              onChange={(e) => handleInputChange('nextOfKin', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="emailAddress" className="text-sm font-medium text-gray-700">Email Address</Label>
            <Input
              id="emailAddress"
              type="email"
              placeholder="Email Address"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              placeholder="Name of Emergency Contact person"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="homeAddress" className="text-sm font-medium text-gray-700">Home address</Label>
            <Input
              id="homeAddress"
              placeholder="Employee Home Address"
              value={formData.homeAddress}
              onChange={(e) => handleInputChange('homeAddress', e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nationality" className="text-sm font-medium text-gray-700">Nationality</Label>
              <Input
                id="nationality"
                placeholder="Employee Nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="religion" className="text-sm font-medium text-gray-700">Religion</Label>
              <Input
                id="religion"
                placeholder="Religion"
                value={formData.religion}
                onChange={(e) => handleInputChange('religion', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="text-gray-500 mb-2">Attach document</div>
          <div className="text-sm text-gray-400 mb-4">Drag and drop here / Upload file</div>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            Upload
          </label>
          <div className="text-xs text-gray-400 mt-2">JPEG / PNG</div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={createEmployeeMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            {createEmployeeMutation.isPending ? 'Creating...' : 'Create Employee Data'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm;
