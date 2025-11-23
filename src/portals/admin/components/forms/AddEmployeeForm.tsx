import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db/client';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Textarea } from '../../../shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../shared/ui/form';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { DialogHeader, DialogTitle } from '../../../shared/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/ui/tabs';

interface Department {
  id: string;
  name: string;
}

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: 'First name is required',
  }),
  middleName: z.string(),
  lastName: z.string().min(1, {
    message: 'Last name is required',
  }),
  dateOfBirth: z.string().optional(),
  qualification: z.string().optional(),
  certification: z.string().optional(),
  departmentId: z.string(),
  position: z.string().min(1, {
    message: 'Position is required',
  }),
  level: z.string().min(1, {
    message: 'Level is required',
  }),
  jobDescription: z.string().min(1, {
    message: 'Job description is required',
  }),
  dateOfResumption: z.string().optional(),
  nextOfKin: z.string().optional(),
  emailAddress: z.string().optional(),
  emergencyContact: z.string().optional(),
  homeAddress: z.string().optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  role: z.string().min(1, {
    message: 'Role is required',
  }),
});

type EmployeeFormValues = z.infer<typeof formSchema>;

const AddEmployeeForm = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      role: 'employee',
    },
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const result = await localDb
        .from('departments')
        .select('id, name');
      if (result.error) throw result.error;
      return result.data as Department[];
    },
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (employeeData: EmployeeFormValues) => {
      const fullName = `${employeeData.firstName} ${employeeData.middleName} ${employeeData.lastName}`.trim();

      // Create employee
      const employeeResult = await localDb
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
          profile_image_url: '/placeholder.svg',
          // Additional fields
          email: employeeData.emailAddress || null,
          phone: employeeData.emergencyContact || null,
          address: employeeData.homeAddress || null,
          nationality: employeeData.nationality || null,
          religion: employeeData.religion || null,
          next_of_kin: employeeData.nextOfKin || null,
          emergency_contact: employeeData.emergencyContact || null
        }]);

      if (employeeResult.error) throw employeeResult.error;

      // Get the created employee ID
      const employeeId = employeeResult.data?.[0]?.id;
      if (!employeeId) throw new Error('Failed to get employee ID');

      // Assign role to the employee
      // First, get the role ID based on the role name
      const roleQuery = await localDb
        .from('roles')
        .select('id')
        .eq('name', employeeData.role.charAt(0).toUpperCase() + employeeData.role.slice(1));

      if (roleQuery.error) throw roleQuery.error;

      if (!roleQuery.data || roleQuery.data.length === 0) {
        throw new Error(`Role '${employeeData.role}' not found`);
      }

      const roleId = roleQuery.data[0].id;

      const roleResult = await localDb
        .from('user_roles')
        .insert([{
          user_id: employeeId,
          role_id: roleId,
          created_at: new Date().toISOString()
        }]);

      if (roleResult.error) throw roleResult.error;

      return employeeResult.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Success",
        description: "Employee created successfully with role assigned",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create employee: " + error.message,
        variant: "destructive",
      });
      console.error('Error creating employee:', error);
    },
  });

  const handleSubmit = (data: EmployeeFormValues) => {
    createEmployeeMutation.mutate(data);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-xl font-semibold">Add Employee - Easy Onboarding</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="work">Work Info</TabsTrigger>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Middle Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" placeholder="Date of Birth" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="hr">HR</SelectItem>
                              <SelectItem value="employee">Employee</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="work" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Work Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No Department</SelectItem>
                              {departments?.map(department => (
                                <SelectItem key={department.id} value={department.id}>
                                  {department.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position *</FormLabel>
                          <FormControl>
                            <Input placeholder="Position" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level *</FormLabel>
                          <FormControl>
                            <Input placeholder="Level" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfResumption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Resumption</FormLabel>
                          <FormControl>
                            <Input type="date" placeholder="Date of Resumption" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Job Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification</FormLabel>
                        <FormControl>
                          <Input placeholder="Qualification" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="certification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certification</FormLabel>
                        <FormControl>
                          <Input placeholder="Certification" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="emailAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email Address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="homeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Employee Home Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input placeholder="Employee Nationality" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="religion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Religion</FormLabel>
                          <FormControl>
                            <Input placeholder="Religion" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="nextOfKin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next of Kin</FormLabel>
                        <FormControl>
                          <Input placeholder="Name of Next of Kin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
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
                <div className="text-xs text-gray-400 mt-2">JPEG / PNG / PDF</div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end pt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createEmployeeMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 w-full sm:w-auto"
            >
              {createEmployeeMutation.isPending ? 'Creating...' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddEmployeeForm;
