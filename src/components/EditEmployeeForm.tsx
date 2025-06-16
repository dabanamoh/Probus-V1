
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
  department_id: string;
}

interface Department {
  id: string;
  name: string;
}

const EditEmployeeForm = ({ employee, onClose }: { employee: Employee; onClose: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: employee.name,
    dateOfBirth: employee.date_of_birth,
    qualification: employee.qualification,
    certification: employee.certifications,
    departmentId: employee.department_id,
    position: employee.position,
    level: employee.level,
    jobDescription: employee.job_description,
    dateOfResumption: employee.date_of_resumption,
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

  const updateEmployeeMutation = useMutation({
    mutationFn: async (employeeData: any) => {
      const { data, error } = await supabase
        .from('employees')
        .update({
          name: employeeData.name,
          position: employeeData.position,
          department_id: employeeData.departmentId,
          level: employeeData.level,
          qualification: employeeData.qualification,
          certifications: employeeData.certification,
          date_of_birth: employeeData.dateOfBirth,
          job_description: employeeData.jobDescription,
          date_of_resumption: employeeData.dateOfResumption,
        })
        .eq('id', employee.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      });
      console.error('Error updating employee:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployeeMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-xl font-semibold">Edit Employee Data</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
          <Input
            id="name"
            placeholder="Employee full name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            className="mt-1"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            required
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
          <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
            <SelectTrigger className="mt-1 max-w-32">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L7">L7</SelectItem>
              <SelectItem value="L8">L8</SelectItem>
              <SelectItem value="L9">L9</SelectItem>
              <SelectItem value="L10">L10</SelectItem>
            </SelectContent>
          </Select>
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

        {/* Submit Button */}
        <div className="flex justify-end pt-6 space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateEmployeeMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {updateEmployeeMutation.isPending ? 'Updating...' : 'Update Employee'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployeeForm;
