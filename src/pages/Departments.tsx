
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import EmployeeProfile from '@/components/EmployeeProfile';
import CreateDepartmentForm from '@/components/CreateDepartmentForm';
import Sidebar from '@/components/Sidebar';

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

interface Department {
  id: string;
  name: string;
  description: string;
  manager_id: string;
  manager?: Employee;
}

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const { data: departments, isLoading, refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          manager:manager_id(*)
        `);
      
      if (error) throw error;
      return data as Department[];
    }
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*');
      
      if (error) throw error;
      return data as Employee[];
    }
  });

  const filteredDepartments = departments?.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewEmployee = (employeeId: string) => {
    const employee = employees?.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setIsProfileModalOpen(true);
    }
  };

  const handleDepartmentSelect = (departmentId: string) => {
    setSelectedDepartment(departmentId);
  };

  const handleViewProfile = () => {
    if (selectedDepartment) {
      const department = departments?.find(dept => dept.id === selectedDepartment);
      if (department?.manager_id) {
        handleViewEmployee(department.manager_id);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-8">
          {/* Header Section */}
          <div className="mb-6">
            <div className="bg-blue-400 text-white p-6 rounded-lg mb-6">
              <h1 className="text-2xl font-bold mb-2">Departments</h1>
              <p className="opacity-90">Departments List</p>
            </div>
          </div>

          {/* Search and Action Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <Button className="bg-blue-400 hover:bg-blue-500 text-white px-6">
              Search
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-400 text-blue-400 hover:bg-blue-50 px-6"
              onClick={handleViewProfile}
              disabled={!selectedDepartment}
            >
              View Profile
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-400 hover:bg-blue-500 text-white px-6">
                  Create New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Department</DialogTitle>
                </DialogHeader>
                <CreateDepartmentForm 
                  employees={employees || []}
                  onSuccess={() => {
                    setIsCreateModalOpen(false);
                    refetch();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-blue-400 text-white p-4 rounded-t-lg">
              <div className="grid grid-cols-4 gap-4">
                <div className="font-medium">Department Name</div>
                <div className="font-medium">Department Description</div>
                <div className="font-medium">Management</div>
                <div className="font-medium">Select</div>
              </div>
            </div>
            
            <div className="p-0">
              {isLoading ? (
                <div className="text-center py-8">Loading departments...</div>
              ) : (
                <div className="divide-y">
                  {filteredDepartments?.map((department, index) => (
                    <div key={department.id} className={`grid grid-cols-4 gap-4 p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <div className="font-medium text-gray-900">{department.name}</div>
                      <div className="text-gray-600 text-sm">{department.description}</div>
                      <div className="text-gray-600">
                        {department.manager ? department.manager.name : 'No Manager'}
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="selectedDepartment"
                          checked={selectedDepartment === department.id}
                          onChange={() => handleDepartmentSelect(department.id)}
                          className="w-4 h-4 text-blue-400 border-2 border-blue-400 focus:ring-blue-400 focus:ring-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedEmployee && (
              <EmployeeProfile employee={selectedEmployee} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Departments;
