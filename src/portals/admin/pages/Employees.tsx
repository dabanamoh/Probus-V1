import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db/client';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { Input } from "../../shared/ui/input";
import { Button } from "../../shared/ui/button";
import { Search, Plus, Eye, Edit, Check, X, Filter, Calendar as CalendarIcon, User, FileText as FileTextIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shared/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../shared/ui/pagination";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "../../shared/ui/dialog";
import {
  Sheet,
  SheetContent,
} from "../../shared/ui/sheet";
import AddEmployeeForm from '../components/forms/AddEmployeeForm';
import EditEmployeeForm from '../components/forms/EditEmployeeForm';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Badge } from "../../shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";

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
  department: {
    name: string;
  } | null;
}

interface PendingEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  rejection_reason?: string;
  department?: string;
  position?: string;
}

const ITEMS_PER_PAGE = 10;

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    department: 'all'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees', searchTerm, currentPage],
    queryFn: async () => {
      const result = await localDb
        .from('employees')
        .select(`
  *,
  department: departments!employees_department_id_fkey(name)
    `);

      if (result.error) throw result.error;

      let filteredData = result.data || [];

      // Manual filtering since localDb doesn't have ilike method
      if (searchTerm) {
        filteredData = filteredData.filter((emp: Employee) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Manual pagination
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return paginatedData as Employee[];
    },
  });

  const { data: pendingEmployees, isLoading: isLoadingPending } = useQuery({
    queryKey: ['pendingEmployees', searchTerm],
    queryFn: async () => {
      const result = await localDb
        .from('pending_employees')
        .select('*');

      if (result.error) throw result.error;

      let filteredData = result.data || [];

      // Manual filtering since localDb doesn't have ilike method
      if (searchTerm) {
        filteredData = filteredData.filter((emp: PendingEmployee) =>
          emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filteredData as PendingEmployee[];
    },
  });

  const { data: totalCount } = useQuery({
    queryKey: ['employees-count', searchTerm],
    queryFn: async () => {
      const result = await localDb
        .from('employees')
        .select('*');

      if (result.error) throw result.error;

      let filteredData = result.data || [];

      // Manual filtering since localDb doesn't have ilike method
      if (searchTerm) {
        filteredData = filteredData.filter((emp: Employee) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filteredData.length;
    },
  });

  const { data: pendingCount } = useQuery({
    queryKey: ['pendingEmployees-count', searchTerm],
    queryFn: async () => {
      const result = await localDb
        .from('pending_employees')
        .select('*');

      if (result.error) throw result.error;

      // Filter for pending status and search term
      const filteredData = (result.data || []).filter((emp: PendingEmployee) =>
        emp.status === 'pending' &&
        (!searchTerm ||
          emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      return filteredData.length;
    },
  });

  const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditEmployeeOpen(true);
  };

  const approvePendingEmployee = async (employeeId: string) => {
    try {
      // Approve the employee using the localDb method
      const { data, error } = await localDb.approvePendingEmployee(employeeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Employee registration approved successfully",
      });

      // Refresh the pending employees list
      queryClient.invalidateQueries({ queryKey: ['pendingEmployees'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve employee: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive",
      });
    }
  };

  const rejectPendingEmployee = async (employeeId: string, reason: string) => {
    try {
      const queryBuilder = localDb.from('pending_employees');
      const result = await queryBuilder
        .eq('id', employeeId)
        .update({
          status: 'rejected',
          rejection_reason: reason,
          updatedAt: new Date().toISOString()
        });

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: "Employee registration rejected",
      });

      // Refresh the pending employees list
      queryClient.invalidateQueries({ queryKey: ['pendingEmployees'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject employee: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive",
      });
    }
  };

  const deletePendingEmployee = async (employeeId: string) => {
    try {
      const queryBuilder = localDb.from('pending_employees');
      const result = await queryBuilder
        .eq('id', employeeId)
        .delete();

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: "Pending employee registration deleted",
      });

      // Refresh the pending employees list
      queryClient.invalidateQueries({ queryKey: ['pendingEmployees'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive",
      });
    }
  };

  // Handle advanced search filter changes
  const handleAdvancedFilterChange = (field: string, value: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset advanced filters
  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      dateFrom: '',
      dateTo: '',
      department: 'all'
    });
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  // Filter employees based on active tab and search criteria for the onboarding section
  const filteredPendingEmployees = pendingEmployees?.filter((employee: PendingEmployee) => {
    // Search filter
    if (searchTerm &&
      !employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !employee.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(employee.department && employee.department.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }

    // Advanced filters
    if (advancedFilters.dateFrom && new Date(employee.createdAt) < new Date(advancedFilters.dateFrom)) {
      return false;
    }

    if (advancedFilters.dateTo && new Date(employee.createdAt) > new Date(advancedFilters.dateTo)) {
      return false;
    }

    if (advancedFilters.department !== 'all' && employee.department !== advancedFilters.department) {
      return false;
    }

    return true;
  }) || [];

  return (
    <DashboardLayout title="Employees" subtitle="Manage your workforce">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64 md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search employees..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto justify-center"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">Active Employees ({totalCount || 0})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Registrations
              {pendingCount ? (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {pendingCount}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {/* Active Employees Content */}
            {showAdvancedSearch && (
              <div className="bg-gray-50 p-4 rounded-lg border mb-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Date From</label>
                    <Input
                      type="date"
                      value={advancedFilters.dateFrom}
                      onChange={(e) => handleAdvancedFilterChange('dateFrom', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Date To</label>
                    <Input
                      type="date"
                      value={advancedFilters.dateTo}
                      onChange={(e) => handleAdvancedFilterChange('dateTo', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Department</label>
                    <Select value={advancedFilters.department} onValueChange={(value) => handleAdvancedFilterChange('department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="it">Information Technology</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={resetAdvancedFilters} className="w-full sm:w-auto">
                    Reset
                  </Button>
                  <Button className="w-full sm:w-auto">
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Reports To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingEmployees ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          Loading employees...
                        </TableCell>
                      </TableRow>
                    ) : employees?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No employees found
                        </TableCell>
                      </TableRow>
                    ) : (
                      employees?.map((employee) => (
                        <TableRow key={employee.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                              {employee.profile_image_url ? (
                                <img src={employee.profile_image_url} alt={employee.name} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                employee.name.charAt(0)
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                              {employee.department?.name || 'General'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {(employee as any).line_manager_name ? (
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">{(employee as any).line_manager_name}</div>
                                <div className="text-xs text-gray-500">{(employee as any).line_manager_role}</div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">No manager</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(employee.date_of_resumption).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                onClick={() => setSelectedEmployee(employee)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                onClick={() => handleEditEmployee(employee)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {/* Pending Employees Content */}
            {showAdvancedSearch && (
              <div className="bg-gray-50 p-4 rounded-lg border mb-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Date From</label>
                    <Input
                      type="date"
                      value={advancedFilters.dateFrom}
                      onChange={(e) => handleAdvancedFilterChange('dateFrom', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Date To</label>
                    <Input
                      type="date"
                      value={advancedFilters.dateTo}
                      onChange={(e) => handleAdvancedFilterChange('dateTo', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Department</label>
                    <Select value={advancedFilters.department} onValueChange={(value) => handleAdvancedFilterChange('department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="it">Information Technology</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={resetAdvancedFilters} className="w-full sm:w-auto">
                    Reset
                  </Button>
                  <Button className="w-full sm:w-auto">
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Pending Employees Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingPending ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading pending employees...
                        </TableCell>
                      </TableRow>
                    ) : filteredPendingEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No pending employee registrations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPendingEmployees.map((employee: PendingEmployee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </TableCell>
                          <TableCell>
                            {employee.email}
                          </TableCell>
                          <TableCell>
                            {employee.department || 'Not specified'}
                          </TableCell>
                          <TableCell>
                            {employee.position || 'Not specified'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(employee.status)}>
                              {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(employee.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-wrap justify-end gap-2">
                              {employee.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => approvePendingEmployee(employee.id)}
                                    className="flex items-center gap-1 w-full sm:w-auto"
                                  >
                                    <Check className="w-4 h-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      const reason = prompt("Please provide a reason for rejection:");
                                      if (reason) {
                                        rejectPendingEmployee(employee.id, reason);
                                      }
                                    }}
                                    className="flex items-center gap-1 w-full sm:w-auto"
                                  >
                                    <X className="w-4 h-4" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-2xl w-full sm:w-11/12 md:w-3/4 lg:w-1/2">
                                  <DialogHeader>
                                    <DialogTitle>Employee Registration Details</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-6">
                                    <div className="border-b pb-4">
                                      <h2 className="text-xl font-bold">
                                        {employee.firstName} {employee.lastName}
                                      </h2>
                                      <div className="flex flex-wrap items-center gap-4 mt-2">
                                        <Badge variant={getStatusVariant(employee.status)}>
                                          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                                        </Badge>
                                        <div className="flex items-center text-sm text-gray-500">
                                          <CalendarIcon className="w-4 h-4 mr-1" />
                                          Submitted: {new Date(employee.createdAt).toLocaleDateString()}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-500">First Name</p>
                                        <p className="font-medium">{employee.firstName}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Last Name</p>
                                        <p className="font-medium">{employee.lastName}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{employee.email}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Department</p>
                                        <p className="font-medium">{employee.department || 'Not specified'}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Position</p>
                                        <p className="font-medium">{employee.position || 'Not specified'}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <p className="font-medium">
                                          <Badge variant={getStatusVariant(employee.status)}>
                                            {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                                          </Badge>
                                        </p>
                                      </div>
                                    </div>

                                    {employee.status === 'rejected' && employee.rejection_reason && (
                                      <div className="p-3 bg-red-50 rounded-lg">
                                        <h4 className="font-medium text-red-800">Rejection Reason</h4>
                                        <p className="text-red-700 text-sm">{employee.rejection_reason}</p>
                                      </div>
                                    )}

                                    {employee.status === 'pending' && (
                                      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
                                        <Button
                                          variant="outline"
                                          onClick={() => approvePendingEmployee(employee.id)}
                                          className="flex items-center gap-1 w-full sm:w-auto"
                                        >
                                          <Check className="w-4 h-4" />
                                          Approve
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => {
                                            const reason = prompt("Please provide a reason for rejection:");
                                            if (reason) {
                                              rejectPendingEmployee(employee.id, reason);
                                            }
                                          }}
                                          className="flex items-center gap-1 w-full sm:w-auto"
                                        >
                                          <X className="w-4 h-4" />
                                          Reject
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Employee Sheet */}
        <Sheet open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
          <SheetContent side="right" className="w-[600px] sm:w-[800px] sm:max-w-[800px]">
            {editingEmployee && (
              <EditEmployeeForm
                employee={editingEmployee}
                onClose={() => setIsEditEmployeeOpen(false)}
              />
            )}
          </SheetContent>
        </Sheet>

        {/* Add Employee Dialog */}
        <Sheet open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
          <SheetContent side="right" className="w-[600px] sm:w-[800px] sm:max-w-[800px]">
            <AddEmployeeForm onClose={() => setIsAddEmployeeOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Employee Details Dialog */}
        <Dialog open={!!selectedEmployee} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                    {selectedEmployee.profile_image_url ? (
                      <img src={selectedEmployee.profile_image_url} alt={selectedEmployee.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      selectedEmployee.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                    <p className="text-gray-500">{selectedEmployee.position}</p>
                    <Badge variant="secondary" className="mt-1">
                      {selectedEmployee.department?.name || 'General'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" /> Personal Info
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-3">
                        <span className="text-gray-500">Level:</span>
                        <span className="col-span-2 font-medium">{selectedEmployee.level}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-gray-500">DOB:</span>
                        <span className="col-span-2 font-medium">{new Date(selectedEmployee.date_of_birth).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileTextIcon className="w-4 h-4" /> Professional Info
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-3">
                        <span className="text-gray-500">Joined:</span>
                        <span className="col-span-2 font-medium">{new Date(selectedEmployee.date_of_resumption).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-gray-500">Qualification:</span>
                        <span className="col-span-2 font-medium">{selectedEmployee.qualification}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {selectedEmployee.job_description}
                  </p>
                </div>

                {selectedEmployee.certifications && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.certifications.split(',').map((cert, i) => (
                        <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {cert.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedEmployee(null)}>Close</Button>
                  <Button onClick={() => {
                    setSelectedEmployee(null);
                    handleEditEmployee(selectedEmployee);
                  }}>
                    <Edit className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
