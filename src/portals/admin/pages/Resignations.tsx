import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Input } from "../../shared/ui/input";
import { Button } from "../../shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";
import { Badge } from "../../shared/ui/badge";
import { Search, Plus, Check, X as XIcon, UserX } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../shared/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../shared/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import ResignationRequestForm from '../../shared/forms/ResignationRequestForm';
import ResignationDetails from '../components/details/ResignationDetails';
import ErrorBoundary from '../../shared/layouts/ErrorBoundary';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';

// Raw database type
interface RawResignation {
  id: string;
  employee_id: string;
  type: string;
  reason: string;
  status: string;
  requested_date: string;
  effective_date: string | null;
  created_at: string;
  updated_at: string;
  employee: {
    id: string;
    name: string;
    position: string;
    profile_image_url: string;
    department: {
      name: string;
    } | null;
    date_of_resumption: string;
  } | null;
}

interface Resignation {
  id: string;
  employee_id: string;
  type: 'resignation' | 'termination';
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'terminated';
  requested_date: string;
  effective_date: string | null;
  created_at: string;
  updated_at: string;
  employee: {
    id: string;
    name: string;
    position: string;
    profile_image_url: string;
    department: {
      name: string;
    } | null;
    date_of_resumption: string;
  } | null;
  years_of_service?: number;
}

const Resignations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedResignation, setSelectedResignation] = useState<Resignation | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const ITEMS_PER_PAGE = 10;

  const { data: resignations, isLoading } = useQuery({
    queryKey: ['resignations'],
    queryFn: async () => {
      try {
        const { data, error } = await localDb
          .from('resignations_terminations')
          .select(`
            id,
            employee_id,
            type,
            reason,
            status,
            requested_date,
            effective_date,
            created_at,
            updated_at,
            employee:employees (
              id,
              name,
              position,
              profile_image_url,
              date_of_resumption,
              department:departments (
                name
              )
            )
          `)
          .order('requested_date', { ascending: false });

        if (error) {
          console.error('Database query error:', error);
          throw error;
        }

        console.log('Raw resignation data:', data);

        // Transform the data to match our interface and calculate years of service
        return (data || []).map((item: RawResignation) => {
          try {
            // Handle cases where employee data might be missing
            if (!item.employee) {
              return {
                ...item,
                employee: null,
                years_of_service: 0
              } as Resignation;
            }

            // Ensure type is valid
            let type: 'resignation' | 'termination' = 'resignation';
            if (item.type === 'termination') {
              type = 'termination';
            }

            // Ensure status is valid
            let status: 'pending' | 'approved' | 'rejected' | 'terminated' = 'pending';
            if (item.status === 'approved') {
              status = 'approved';
            } else if (item.status === 'rejected') {
              status = 'rejected';
            } else if (item.status === 'terminated') {
              status = 'terminated';
            }
            // pending is the default

            const startDate = item.employee.date_of_resumption ? new Date(item.employee.date_of_resumption) : new Date();
            const currentDate = new Date();
            const yearsDiff = item.employee.date_of_resumption ? currentDate.getFullYear() - startDate.getFullYear() : 0;

            return {
              ...item,
              type,
              status,
              employee: {
                ...item.employee,
                department: item.employee.department && Array.isArray(item.employee.department) && item.employee.department.length > 0 ? item.employee.department[0] : null
              },
              years_of_service: yearsDiff
            };
          } catch (error) {
            console.warn('Error transforming resignation data:', error, item);
            // Return a safe default in case of transformation errors
            return {
              ...item,
              type: item.type === 'termination' ? 'termination' : 'resignation',
              status: item.status === 'approved' ? 'approved' : item.status === 'rejected' ? 'rejected' : item.status === 'terminated' ? 'terminated' : 'pending',
              employee: item.employee || null,
              years_of_service: 0
            } as Resignation;
          }
        }) as Resignation[];
      } catch (error) {
        console.error('Error fetching resignations:', error);
        throw error;
      }
    }
  });

  // Filter resignations based on active tab
  const filteredResignations = (resignations || []).filter(resignation => {
    // Apply search filter
    const matchesSearch = (() => {
      // If search term is empty or not a string, match everything
      if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
        return true;
      }

      try {
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();

        // Log the values we're checking
        console.log('Checking search filter:', {
          employeeName: resignation.employee?.name,
          type: resignation.type,
          normalizedSearchTerm
        });

        // Check if employee name matches (if employee exists)
        if (resignation.employee?.name &&
          typeof resignation.employee.name === 'string' &&
          resignation.employee.name.toLowerCase().includes(normalizedSearchTerm)) {
          return true;
        }

        // Check if type matches (if type exists)
        if (resignation.type &&
          typeof resignation.type === 'string' &&
          resignation.type.toLowerCase().includes(normalizedSearchTerm)) {
          return true;
        }

        return false;
      } catch (error) {
        // If there's any error in the search (e.g., toLowerCase on undefined), default to not matching
        console.warn('Error during search filter:', error, resignation);
        return false;
      }
    })();

    // Apply tab filter
    if (activeTab === 'pending') {
      return matchesSearch && resignation.status === 'pending';
    } else if (activeTab === 'approved') {
      return matchesSearch && resignation.status === 'approved';
    } else if (activeTab === 'terminated') {
      return matchesSearch && resignation.status === 'terminated';
    } else {
      return matchesSearch;
    }
  });

  const totalPages = Math.ceil(filteredResignations.length / ITEMS_PER_PAGE);
  const paginatedResignations = filteredResignations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Mutation for approving resignations
  const approveResignationMutation = useMutation({
    mutationFn: async (resignationId: string) => {
      const result = await localDb
        .from('resignations_terminations')
        .eq('id', resignationId)
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        });

      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resignations'] });
      toast({
        title: "Success",
        description: "Resignation approved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve resignation",
        variant: "destructive",
      });
    },
  });

  // Mutation for rejecting resignations
  const rejectResignationMutation = useMutation({
    mutationFn: async (resignationId: string) => {
      const result = await localDb
        .from('resignations_terminations')
        .eq('id', resignationId)
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        });

      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resignations'] });
      toast({
        title: "Success",
        description: "Resignation rejected successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject resignation",
        variant: "destructive",
      });
    },
  });

  // Mutation for terminating employment
  const terminateEmploymentMutation = useMutation({
    mutationFn: async (resignationId: string) => {
      const result = await localDb
        .from('resignations_terminations')
        .eq('id', resignationId)
        .update({
          status: 'terminated',
          effective_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resignations'] });
      toast({
        title: "Success",
        description: "Employment terminated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to terminate employment",
        variant: "destructive",
      });
    },
  });

  const handleViewDetails = (resignation: Resignation) => {
    setSelectedResignation(resignation);
    setIsDetailsOpen(true);
  };

  const handleApprove = (resignationId: string) => {
    approveResignationMutation.mutate(resignationId);
  };

  const handleReject = (resignationId: string) => {
    rejectResignationMutation.mutate(resignationId);
  };

  const handleTerminate = (resignationId: string) => {
    terminateEmploymentMutation.mutate(resignationId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'resignation'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-purple-100 text-purple-800';
  };

  return (
    <DashboardLayout title="Resignations" subtitle="Probus">
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Resignations & Terminations</h1>

            </div>

            <Tabs defaultValue="pending" className="w-full mb-6" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                <TabsTrigger value="approved">Approved Resignations</TabsTrigger>
                <TabsTrigger value="terminated">Terminated Employees</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resignations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Submit Resignation/Termination Request</DialogTitle>
                  </DialogHeader>
                  <ResignationRequestForm
                    onClose={() => setIsFormOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle>
                  {activeTab === 'pending' && 'Pending Resignation & Termination Requests'}
                  {activeTab === 'approved' && 'Approved Resignations'}
                  {activeTab === 'terminated' && 'Terminated Employees'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="text-center py-8">Loading resignations...</div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Employee</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Type</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Request Date</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Effective Date</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Years of Service</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Status</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {paginatedResignations.length > 0 ? (
                            paginatedResignations.map((resignation, index) => (
                              <tr key={resignation.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                  <div className="flex items-center">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src={resignation.employee?.profile_image_url || '/placeholder.svg'} />
                                      <AvatarFallback>{resignation.employee?.name?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{resignation.employee?.name || 'Unknown Employee'}</div>
                                      <div className="text-sm text-gray-500">{resignation.employee?.position || 'Unknown Position'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                  <Badge className={getTypeColor(resignation.type)}>
                                    {resignation.type}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6">
                                  {resignation.requested_date ? new Date(resignation.requested_date).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6">
                                  {resignation.effective_date ? new Date(resignation.effective_date).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6">
                                  {resignation.years_of_service}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                  <Badge className={getStatusColor(resignation.status)}>
                                    {resignation.status}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium sm:px-6">
                                  {activeTab === 'pending' ? (
                                    <div className="flex justify-center space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-green-500 text-green-500 hover:bg-green-50"
                                        onClick={() => handleApprove(resignation.id)}
                                        disabled={approveResignationMutation.isPending}
                                      >
                                        <Check className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-red-500 text-red-500 hover:bg-red-50"
                                        onClick={() => handleReject(resignation.id)}
                                        disabled={rejectResignationMutation.isPending}
                                      >
                                        <XIcon className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                        onClick={() => handleViewDetails(resignation)}
                                      >
                                        View
                                      </Button>
                                    </div>
                                  ) : activeTab === 'approved' ? (
                                    <div className="flex justify-center space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-red-500 text-red-500 hover:bg-red-50"
                                        onClick={() => handleTerminate(resignation.id)}
                                        disabled={terminateEmploymentMutation.isPending}
                                      >
                                        <UserX className="w-4 h-4 mr-1" />
                                        Terminate
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                        onClick={() => handleViewDetails(resignation)}
                                      >
                                        View
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                      onClick={() => handleViewDetails(resignation)}
                                    >
                                      View
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center py-8 text-gray-500">
                                No resignation or termination requests found
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

          {/* Resignation Details Dialog */}
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Resignation/Termination Details</DialogTitle>
              </DialogHeader>
              {selectedResignation && (
                <ResignationDetails resignation={selectedResignation} />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default Resignations;
