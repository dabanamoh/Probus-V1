
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import EmployeeProfile from '@/components/EmployeeProfile';
import AddEmployeeForm from '@/components/AddEmployeeForm';

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
  department: {
    name: string;
  } | null;
}

const ITEMS_PER_PAGE = 10;

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees', searchTerm, currentPage],
    queryFn: async () => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('employees')
        .select(`
          *,
          department:departments!employees_department_id_fkey(name)
        `)
        .range(startIndex, endIndex);

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Employee[];
    },
  });

  const { data: totalCount } = useQuery({
    queryKey: ['employees-count', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%`);
      }

      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  });

  const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Employees</h1>
          <p className="text-gray-600">Manage your organization's employees</p>
        </div>

        {/* Search Bar and Add Button */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            <Sheet open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
              <SheetTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[600px] sm:w-[800px] sm:max-w-[800px]">
                <AddEmployeeForm onClose={() => setIsAddEmployeeOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Employee</TableHead>
                <TableHead className="font-semibold text-gray-700">Position</TableHead>
                <TableHead className="font-semibold text-gray-700">Department</TableHead>
                <TableHead className="font-semibold text-gray-700">Level</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading employees...
                  </TableCell>
                </TableRow>
              ) : employees && employees.length > 0 ? (
                employees.map((employee, index) => (
                  <TableRow 
                    key={employee.id} 
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={employee.profile_image_url || '/placeholder.svg'}
                          alt={employee.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">{employee.position}</TableCell>
                    <TableCell className="text-gray-700">
                      {employee.department?.name || 'No Department'}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {employee.level}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedEmployee(employee)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogTitle>Employee Profile</DialogTitle>
                          {selectedEmployee && (
                            <EmployeeProfile employee={selectedEmployee} />
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No employees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;
