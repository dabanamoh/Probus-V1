import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db/client';
import { Button } from "../../../shared/ui/button";
import { DialogHeader, DialogTitle } from "../../../shared/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/ui/tabs";
import ProfileTab from '../../../shared/components/employee/ProfileTab';
import PersonalTab from '../../../shared/components/employee/PersonalTab';
import AddressTab from '../../../shared/components/employee/AddressTab';
import WorkTab from '../../../shared/components/employee/WorkTab';
import QualificationTab from '../../../shared/components/employee/QualificationTab';
import RelationsTab from '../../../shared/components/employee/RelationsTab';

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
  // Additional fields
  email?: string;
  phone?: string;
  address?: string;
  nationality?: string;
  religion?: string;
  sex?: string;
  next_of_kin?: string;
  next_of_kin_email?: string;
  emergency_contact?: string;
  emergency_contact_email?: string;
  line_manager_id?: string;
  line_manager_name?: string;
  line_manager_role?: string;
}

interface Department {
  id: string;
  name: string;
}

interface Manager {
  id: string;
  name: string;
  position: string;
  department_id: string;
  department?: {
    name: string;
  };
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface EmployeeFormData {
  name: string;
  position: string;
  profileImageUrl: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  emailAddress: string;
  phoneNumber: string;
  userRole: string;
  level: string;
  nationality: string;
  religion: string;
  sex: string;
  country: string;
  city: string;
  street: string;
  qualification: string;
  certifications: string;
  departmentId: string;
  jobDescription: string;
  dateOfResumption: string;
  nextOfKin: string;
  nextOfKinEmail: string;
  emergencyContact: string;
  emergencyContactEmail: string;
  lineManagerId: string;
  lineManagerName: string;
  lineManagerRole: string;
}

const EditEmployeeForm = ({ employee, onClose }: { employee: Employee; onClose: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Parse name into components
  const nameParts = employee.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

  const [formData, setFormData] = useState<EmployeeFormData>({
    // Profile Section
    name: employee.name,
    position: employee.position,
    profileImageUrl: employee.profile_image_url || '',

    // Personal Information
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    dateOfBirth: employee.date_of_birth || '',
    emailAddress: employee.email || '',
    phoneNumber: employee.phone || '',
    userRole: 'employee',
    level: employee.level || '',
    nationality: employee.nationality || '',
    religion: employee.religion || '',
    sex: employee.sex || '',

    // Address
    country: '',
    city: '',
    street: employee.address || '',

    // Qualification
    qualification: employee.qualification || '',
    certifications: employee.certifications || '',

    // Department and Job Info
    departmentId: employee.department_id || 'none',
    jobDescription: employee.job_description || '',
    dateOfResumption: employee.date_of_resumption || '',

    // Relations
    nextOfKin: employee.next_of_kin || '',
    nextOfKinEmail: employee.next_of_kin_email || '',
    emergencyContact: employee.emergency_contact || '',
    emergencyContactEmail: employee.emergency_contact_email || '',

    // Line Manager
    lineManagerId: employee.line_manager_id || '',
    lineManagerName: employee.line_manager_name || '',
    lineManagerRole: employee.line_manager_role || '',
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

  // Fetch potential line managers (all employees except current one)
  const { data: availableManagers } = useQuery({
    queryKey: ['available-managers', employee.id],
    queryFn: async () => {
      const result = await localDb
        .from('employees')
        .select(`
          id,
          name,
          position,
          department_id,
          department:departments!employees_department_id_fkey(name)
        `);
      if (result.error) throw result.error;
      // Filter out the current employee from the list
      const managers = (result.data || []).filter((emp: any) => emp.id !== employee.id);
      return managers as Manager[];
    },
  });

  // Fetch user role
  const { data: userRole } = useQuery({
    queryKey: ['user-role', employee.id],
    queryFn: async () => {
      const result = await localDb
        .from('user_roles')
        .select('id, user_id, role_id, created_at')
        .eq('user_id', employee.id);

      if (result.error) {
        // If no role found, return default role
        return { role: 'employee', role_id: 'employee' };
      }

      // Return the first role if exists, otherwise default
      const roleData: any = result.data && result.data.length > 0 ? result.data[0] : { role_id: 'employee' };
      return { role: roleData.role_id || 'employee', role_id: roleData.role_id || 'employee' };
    },
  });

  // Set user role when data is fetched
  useEffect(() => {
    if (userRole) {
      setFormData(prev => ({ ...prev, userRole: userRole.role || userRole.role_id || 'employee' }));
    }
  }, [userRole]);

  const updateEmployeeMutation = useMutation({
    mutationFn: async (employeeData: EmployeeFormData) => {
      const fullName = `${employeeData.firstName} ${employeeData.middleName} ${employeeData.lastName}`.trim();

      // Update employee
      const employeeResult = await localDb
        .from('employees')
        .eq('id', employee.id)
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
          // Additional fields
          email: employeeData.emailAddress || null,
          phone: employeeData.phoneNumber || null,
          address: employeeData.street || null,
          nationality: employeeData.nationality || null,
          religion: employeeData.religion || null,
          sex: employeeData.sex || null,
          next_of_kin: employeeData.nextOfKin || null,
          next_of_kin_email: employeeData.nextOfKinEmail || null,
          emergency_contact: employeeData.emergencyContact || null,
          emergency_contact_email: employeeData.emergencyContactEmail || null,
        } as any);

      // Update line manager separately if the field exists
      try {
        await localDb
          .from('employees')
          .eq('id', employee.id)
          .update({
            line_manager_id: employeeData.lineManagerId || null,
            line_manager_name: employeeData.lineManagerName || null,
            line_manager_role: employeeData.lineManagerRole || null,
          } as any);
      } catch (lineManagerError) {
        // Ignore error if line_manager fields don't exist in schema yet
        console.log('Line manager fields may not exist in schema:', lineManagerError);
      }

      if (employeeResult.error) throw employeeResult.error;

      // Check if user role already exists
      const existingRoleResult = await localDb
        .from('user_roles')
        .select('id')
        .eq('user_id', employee.id);

      let roleResult;

      if (existingRoleResult.data && existingRoleResult.data.length > 0) {
        // Update existing role
        const roleId = existingRoleResult.data[0].id;
        roleResult = await localDb
          .from('user_roles')
          .eq('id', roleId)
          .update({
            role_id: employeeData.userRole,
            created_at: new Date().toISOString() // Update the created_at timestamp to indicate modification
          } as any);
      } else {
        // Insert new role
        roleResult = await localDb
          .from('user_roles')
          .insert([{
            user_id: employee.id,
            role_id: employeeData.userRole,
            created_at: new Date().toISOString()
          }] as any);
      }

      if (roleResult.error) throw roleResult.error;

      return employeeResult.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['user-role', employee.id] });
      toast({
        title: "Success",
        description: "Employee updated successfully with role assigned",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update employee: " + error.message,
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
        <DialogTitle className="text-xl font-semibold">Edit Employee - Easy Assignment</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="qualification">Education</TabsTrigger>
            <TabsTrigger value="relations">Emergency</TabsTrigger>
            <TabsTrigger value="linemanager">Line Manager</TabsTrigger>
            <TabsTrigger value="role">Role</TabsTrigger>
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

          <TabsContent value="linemanager" className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Line Manager Assignment</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Assign a line manager who will oversee this employee. The line manager will be the first approver in approval flows for leave requests, expenses, and other employee requests.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Line Manager / Reports To</label>
                    <select
                      value={formData.lineManagerId}
                      onChange={(e) => {
                        const selectedManager = availableManagers?.find(m => m.id === e.target.value);
                        if (selectedManager) {
                          handleInputChange('lineManagerId', e.target.value);
                          handleInputChange('lineManagerName', selectedManager.name);
                          handleInputChange('lineManagerRole', selectedManager.position);
                        } else {
                          // Clear line manager if "None" is selected
                          handleInputChange('lineManagerId', '');
                          handleInputChange('lineManagerName', '');
                          handleInputChange('lineManagerRole', '');
                        }
                      }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">None - No Line Manager</option>
                      
                      {/* Same Department Managers */}
                      {formData.departmentId && formData.departmentId !== 'none' && (
                        <>
                          <optgroup label="Same Department">
                            {availableManagers
                              ?.filter(manager => manager.department_id === formData.departmentId)
                              .map(manager => (
                                <option key={manager.id} value={manager.id}>
                                  {manager.name} - {manager.position}
                                </option>
                              ))
                            }
                          </optgroup>
                          <optgroup label="Other Departments">
                            {availableManagers
                              ?.filter(manager => manager.department_id !== formData.departmentId)
                              .map(manager => (
                                <option key={manager.id} value={manager.id}>
                                  {manager.name} - {manager.position} ({manager.department?.name || 'General'})
                                </option>
                              ))
                            }
                          </optgroup>
                        </>
                      )}
                      
                      {/* All Managers if no department selected */}
                      {(!formData.departmentId || formData.departmentId === 'none') && (
                        <optgroup label="All Employees">
                          {availableManagers?.map(manager => (
                            <option key={manager.id} value={manager.id}>
                              {manager.name} - {manager.position} ({manager.department?.name || 'General'})
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">
                      Select who this employee reports to. This affects all approval workflows.
                    </p>
                  </div>

                  {/* Current Line Manager Display */}
                  {formData.lineManagerId && (
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Current Line Manager</h4>
                      <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                        <p><strong>Name:</strong> {formData.lineManagerName}</p>
                        <p><strong>Position:</strong> {formData.lineManagerRole}</p>
                      </div>
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            handleInputChange('lineManagerId', '');
                            handleInputChange('lineManagerName', '');
                            handleInputChange('lineManagerRole', '');
                          }}
                          className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
                        >
                          Remove Line Manager
                        </button>
                      </div>
                    </div>
                  )}

                  {/* No Line Manager Display */}
                  {!formData.lineManagerId && (
                    <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">⚠️ No Line Manager Assigned</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        This employee has no line manager assigned. Their requests may need to go directly to HR or Admin for approval.
                      </p>
                    </div>
                  )}

                  {/* Info Box */}
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">💡 How Line Managers Work</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                      <li>Line managers are the first approvers for employee requests</li>
                      <li>Leave requests, expenses, and time-off go through line manager first</li>
                      <li>Line managers can view their team's performance and activities</li>
                      <li>You can change or remove line managers at any time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="role" className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Role Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">User Role</label>
                    <select
                      value={formData.userRole}
                      onChange={(e) => handleInputChange('userRole', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="hr">HR</option>
                      <option value="employee">Employee</option>
                    </select>
                    <p className="text-sm text-muted-foreground mt-2">
                      Select the appropriate role for this employee. This determines their access level in the system.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Role Permissions</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {formData.userRole === 'admin' && (
                        <>
                          <li>• Full system access</li>
                          <li>• Manage all employees</li>
                          <li>• Configure system settings</li>
                          <li>• View all reports</li>
                        </>
                      )}
                      {formData.userRole === 'manager' && (
                        <>
                          <li>• Manage team members</li>
                          <li>• View department reports</li>
                          <li>• Approve leave requests</li>
                          <li>• Access performance data</li>
                        </>
                      )}
                      {formData.userRole === 'hr' && (
                        <>
                          <li>• Manage employee records</li>
                          <li>• Process resignations</li>
                          <li>• Manage rewards and feedback</li>
                          <li>• View compliance reports</li>
                        </>
                      )}
                      {formData.userRole === 'employee' && (
                        <>
                          <li>• View personal dashboard</li>
                          <li>• Submit leave requests</li>
                          <li>• Access company directory</li>
                          <li>• View personal performance</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
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
