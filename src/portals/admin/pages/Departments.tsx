import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db/client';
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Search, Plus, Users, Eye, Building2, Brain, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "../../shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../shared/ui/dialog";
import { Badge } from "../../shared/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../shared/ui/pagination";
import CreateDepartmentForm from '../components/forms/CreateDepartmentForm';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Department {
  id: string;
  name: string;
  description: string | null;
  manager_id: string | null;
  manager_name: string | null;
  employee_count: number;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department_id: string | null;
  level: string | null;
  qualification: string | null;
  certifications: string | null;
  date_of_birth: string | null;
  job_description: string | null;
  date_of_resumption: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AIRiskAssessment {
  id: string;
  employee_id: string;
  risk_level: "low" | "medium" | "high" | "critical";
  assessment_type: "behavioral" | "performance" | "compliance";
  analysis_data: Record<string, unknown>;
  confidence_score: number | null;
  recommendations: string[] | null;
  requires_action: boolean;
  reviewed_by: string | null;
  reviewed_at: string | null;
  expires_at: string | null;
  created_at: string;
}

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 10;

  const { data: departments, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await localDb
        .from('departments')
        .select(`
          id,
          name,
          description,
          manager_id,
          employees (id),
          manager:employees!fk_departments_manager (name)
        `)
        .order('name');

      if (error) throw error;

      return (data || []).map(dept => ({
        id: dept.id,
        name: dept.name,
        description: dept.description,
        manager_id: dept.manager_id,
        manager_name: dept.manager?.name || null,
        employee_count: dept.employees ? (Array.isArray(dept.employees) ? dept.employees.length : 1) : 0
      })) as Department[];
    }
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees-for-departments'],
    queryFn: async () => {
      const { data, error } = await localDb
        .from('employees')
        .select('id, name, position')
        .order('name');

      if (error) throw error;
      return data as Employee[];
    }
  });

  // Fetch detailed department data when a department is selected
  const { data: departmentDetails, isLoading: isDepartmentDetailsLoading } = useQuery({
    queryKey: ['department-details', selectedDepartment?.id],
    enabled: !!selectedDepartment,
    queryFn: async () => {
      if (!selectedDepartment) return null;

      // Fetch employees in this department
      const { data: deptEmployees, error: employeesError } = await localDb
        .from('employees')
        .select('*')
        .eq('department_id', selectedDepartment.id);

      if (employeesError) throw employeesError;

      // Fetch AI risk assessments for employees in this department
      const employeeIds = deptEmployees?.map(emp => emp.id) || [];
      let aiAssessments: AIRiskAssessment[] = [];

      if (employeeIds.length > 0) {
        const { data: assessments, error: assessmentsError } = await localDb
          .from('ai_risk_assessments')
          .select('*')
          .in('employee_id', employeeIds);

        if (!assessmentsError) {
          aiAssessments = assessments as AIRiskAssessment[];
        }
      }

      return {
        employees: deptEmployees,
        aiAssessments
      };
    }
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const queryBuilder = localDb.from('departments');
      const { error } = await queryBuilder
        .eq('id', id)
        .delete();

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete department: " + error.message,
        variant: "destructive",
      });
    },
  });

  const filteredDepartments = departments?.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const totalPages = Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the department "${name}"? This action cannot be undone.`)) {
      deleteDepartmentMutation.mutate(id);
    }
  };

  const handleViewDetails = (department: Department) => {
    setSelectedDepartment(department);
    setIsDetailOpen(true);
  };

  // Calculate years of service
  const calculateYearsOfService = (startDate: string) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
    return Math.floor(diffYears);
  };

  // Prepare data for charts
  const getRiskLevelData = () => {
    if (!departmentDetails?.aiAssessments) return [];

    const riskCounts = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    departmentDetails.aiAssessments.forEach(assessment => {
      riskCounts[assessment.risk_level]++;
    });

    return [
      { name: 'Low', value: riskCounts.low, color: '#10B981' },
      { name: 'Medium', value: riskCounts.medium, color: '#F59E0B' },
      { name: 'High', value: riskCounts.high, color: '#EF4444' },
      { name: 'Critical', value: riskCounts.critical, color: '#DC2626' }
    ];
  };

  const getQualificationData = () => {
    if (!departmentDetails?.employees) return [];

    const qualificationCounts: Record<string, number> = {};

    departmentDetails.employees.forEach(employee => {
      const qual = employee.qualification || 'Not specified';
      qualificationCounts[qual] = (qualificationCounts[qual] || 0) + 1;
    });

    return Object.entries(qualificationCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  return (
    <DashboardLayout title="Departments" subtitle="Probus">
      <div className="space-y-6">
        <div className="mb-6 max-w-full overflow-x-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Departments</h1>

          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Department</DialogTitle>
                </DialogHeader>
                <CreateDepartmentForm employees={employees} onSuccess={() => setIsCreateOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-sky-600 text-white">
              <CardTitle>Department List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-8">Loading departments...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">Error loading departments: {error.message}</div>
              ) : (
                <>
                  <div className="overflow-x-auto max-w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-blue-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider sm:px-6">Department</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider sm:px-6">Manager</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider sm:px-6">Employees</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider sm:px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedDepartments.length > 0 ? (
                          paginatedDepartments.map((dept, index) => (
                            <tr key={dept.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                              <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                <div className="text-sm font-medium text-blue-900">{dept.name}</div>
                                {dept.description && (
                                  <div className="text-sm text-blue-600 mt-1">{dept.description}</div>
                                )}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 sm:px-6">
                                {dept.manager_name || 'No manager assigned'}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 sm:px-6">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <Users className="w-3 h-3 mr-1" />
                                  {dept.employee_count}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium sm:px-6">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-600 text-blue-600 hover:bg-blue-50 mr-2"
                                  onClick={() => handleViewDetails(dept)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-500 text-red-500 hover:bg-red-50"
                                  onClick={() => handleDelete(dept.id, dept.name)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center py-8 text-blue-600">
                              No departments found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="px-4 py-4 border-t sm:px-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>

                          {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                              <PaginationLink
                                onClick={() => setCurrentPage(i + 1)}
                                isActive={currentPage === i + 1}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                {selectedDepartment?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedDepartment && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-blue-600 mb-1">Manager</div>
                      <div className="font-semibold text-lg">{selectedDepartment.manager_name || 'Not Assigned'}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-blue-600 mb-1">Total Employees</div>
                      <div className="font-semibold text-lg">{selectedDepartment.employee_count}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-blue-600 mb-1">Description</div>
                      <div className="text-sm">{selectedDepartment.description || 'No description provided'}</div>
                    </CardContent>
                  </Card>
                </div>

                {isDepartmentDetailsLoading ? (
                  <div className="text-center py-8">Loading details...</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Brain className="w-5 h-5 text-blue-600" />
                            AI Risk Assessment Overview
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={getRiskLevelData()}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {getRiskLevelData().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex justify-center gap-4 mt-4 flex-wrap">
                            {getRiskLevelData().map((entry, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-sm text-blue-600">{entry.name}: {entry.value}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Employee Qualifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={getQualificationData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3B82F6" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Department Employees</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Risk Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {departmentDetails?.employees?.map((emp) => {
                                const risk = departmentDetails.aiAssessments.find(a => a.employee_id === emp.id);
                                return (
                                  <tr key={emp.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                          {emp.profile_image_url ? (
                                            <img src={emp.profile_image_url} alt={emp.name} className="h-8 w-8 rounded-full object-cover" />
                                          ) : (
                                            emp.name.charAt(0)
                                          )}
                                        </div>
                                        <div className="text-sm font-medium text-blue-900">{emp.name}</div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{emp.position}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {risk ? (
                                        <Badge className={`
                                          ${risk.risk_level === 'low' ? 'bg-green-100 text-green-800' : ''}
                                          ${risk.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                                          ${risk.risk_level === 'high' ? 'bg-red-100 text-red-800' : ''}
                                          ${risk.risk_level === 'critical' ? 'bg-red-200 text-red-900' : ''}
                                        `}>
                                          {risk.risk_level.toUpperCase()}
                                        </Badge>
                                      ) : (
                                        <span className="text-sm text-blue-400">Not assessed</span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                      <Button variant="ghost" size="sm">View Profile</Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Departments;
 