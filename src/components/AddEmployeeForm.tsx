
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import EmployeeFormFields from './forms/EmployeeFormFields';

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
    departmentId: 'none',
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
          department_id: employeeData.departmentId === 'none' ? null : employeeData.departmentId,
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

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-xl font-semibold">Add Employee Data Forms</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <EmployeeFormFields 
          formData={formData} 
          departments={departments} 
          onInputChange={handleInputChange} 
        />

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
