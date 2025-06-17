
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileTab from './employee/ProfileTab';
import PersonalTab from './employee/PersonalTab';
import AddressTab from './employee/AddressTab';
import WorkTab from './employee/WorkTab';
import QualificationTab from './employee/QualificationTab';
import RelationsTab from './employee/RelationsTab';

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
    // Profile Section
    name: employee.name,
    position: employee.position,
    profileImageUrl: employee.profile_image_url || '',
    
    // Personal Information
    firstName: employee.name.split(' ')[0] || '',
    middleName: '',
    lastName: employee.name.split(' ').slice(1).join(' ') || '',
    dateOfBirth: employee.date_of_birth || '',
    emailAddress: '',
    phoneNumber: '',
    userRole: 'employee',
    level: employee.level || '',
    nationality: '',
    religion: '',
    sex: '',
    
    // Address
    country: '',
    city: '',
    street: '',
    
    // Qualification
    qualification: employee.qualification || '',
    certifications: employee.certifications || '',
    
    // Department and Job Info
    departmentId: employee.department_id || 'none',
    jobDescription: employee.job_description || '',
    dateOfResumption: employee.date_of_resumption || '',
    
    // Relations
    nextOfKin: '',
    nextOfKinEmail: '',
    emergencyContact: '',
    emergencyContactEmail: '',
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
      const fullName = `${employeeData.firstName} ${employeeData.lastName}`.trim();
      
      const { data, error } = await supabase
        .from('employees')
        .update({
          name: fullName,
          position: employeeData.position,
          department_id: employeeData.departmentId === 'none' ? null : employeeData.departmentId,
          level: employeeData.level,
          qualification: employeeData.qualification,
          certifications: employeeData.certifications,
          date_of_birth: employeeData.dateOfBirth || null,
          job_description: employeeData.jobDescription,
          date_of_resumption: employeeData.dateOfResumption || null,
          profile_image_url: employeeData.profileImageUrl,
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
    <div className="max-h-[85vh] overflow-y-auto">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-xl font-semibold">Edit Employee Profile</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="qualification">Education</TabsTrigger>
            <TabsTrigger value="relations">Emergency</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <ProfileTab formData={formData} onInputChange={handleInputChange} />
          </TabsContent>

          <TabsContent value="personal" className="space-y-4">
            <PersonalTab formData={formData} onInputChange={handleInputChange} />
          </TabsContent>

          <TabsContent value="address" className="space-y-4">
            <AddressTab formData={formData} onInputChange={handleInputChange} />
          </TabsContent>

          <TabsContent value="work" className="space-y-4">
            <WorkTab formData={formData} departments={departments} onInputChange={handleInputChange} />
          </TabsContent>

          <TabsContent value="qualification" className="space-y-4">
            <QualificationTab formData={formData} onInputChange={handleInputChange} />
          </TabsContent>

          <TabsContent value="relations" className="space-y-4">
            <RelationsTab formData={formData} onInputChange={handleInputChange} />
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 space-x-3 border-t">
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
