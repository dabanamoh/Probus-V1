import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Eye, Check, X } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import ResignationRequestForm from '@/components/ResignationRequestForm';
import ResignationDetails from '@/components/ResignationDetails';

interface Employee {
  id: string;
  name: string;
  position: string;
  profile_image_url: string;
  department: {
    id: string;
    name: string;
  };
}

interface ResignationTermination {
  id: string;
  employee_id: string;
  request_type: string;
  request_date: string;
  years_of_service: number;
  status: string;
  description: string | null;
  documents_url: string | null;
  created_at: string;
  updated_at: string;
  employee: Employee;
}

const ITEMS_PER_PAGE = 10;

const Resignations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [selectedResignation, setSelectedResignation] = useState<ResignationTermination | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data - replace with actual Supabase query later
  const mockResignations: ResignationTermination[] = [
    {
      id: '1',
      employee_id: 'emp-1',
      request_type: 'resignation',
      request_date: '2024-01-15',
      years_of_service: 3,
      status: 'pending',
      description: 'Personal reasons for career change',
      documents_url: null,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      employee: {
        id: 'emp-1',
        name: 'John Doe',
        position: 'Software Engineer',
        profile_image_url: '/placeholder.svg',
        department: {
          id: 'dept-1',
          name: 'Engineering'
        }
      }
    },
    {
      id: '2',
      employee_id: 'emp-2',
      request_type: 'termination',
      request_date: '2024-01-10',
      years_of_service: 5,
      status: 'valid',
      description: 'Performance issues',
      documents_url: '/termination_doc.pdf',
      created_at: '2024-01-10T14:20:00Z',
      updated_at: '2024-01-10T14:20:00Z',
      employee: {
        id: 'emp-2',
        name: 'Jane Smith',
        position: 'Project Manager',
        profile_image_url: '/placeholder.svg',
        department: {
          id: 'dept-2',
          name: 'Management'
        }
      }
    },
    {
      id: '3',
      employee_id: 'emp-3',
      request_type: 'resignation',
      request_date: '2024-01-05',
      years_of_service: 1,
      status: 'invalid',
      description: 'Better opportunity elsewhere',
      documents_url: null,
      created_at: '2024-01-05T09:15:00Z',
      updated_at: '2024-01-05T09:15:00Z',
      employee: {
        id: 'emp-3',
        name: 'Alice Johnson',
        position: 'Data Analyst',
        profile_image_url: '/placeholder.svg',
        department: {
          id: 'dept-3',
          name: 'Analytics'
        }
      }
    },
    {
      id: '4',
      employee_id: 'emp-4',
      request_type: 'resignation',
      request_date: '2023-12-28',
      years_of_service: 2,
      status: 'pending',
      description: 'Relocation',
      documents_url: null,
      created_at: '2023-12-28T16:45:00Z',
      updated_at: '2023-12-28T16:45:00Z',
      employee: {
        id: 'emp-4',
        name: 'Bob Williams',
        position: 'UX Designer',
        profile_image_url: '/placeholder.svg',
        department: {
          id: 'dept-4',
          name: 'Design'
        }
      }
    },
  ];

  // Use mock data for now
  const { data: resignations = [] } = useQuery({
    queryKey: ['resignations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resignations_terminations')
        .select(`
          *,
          description,
          documents_url,
          employee:employees(
            id,
            name,
            position,
            profile_image_url,
            department:departments(id, name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ResignationTermination[];
    },
    // For now, return mock data
    enabled: false
  });
  
  // Filter resignations based on search term
  const filteredResignations = mockResignations.filter(resignation =>
    resignation.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resignation.request_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate filtered results
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedResignations = filteredResignations.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredResignations.length / ITEMS_PER_PAGE);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'valid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'invalid':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Valid';
      case 'invalid':
        return 'Invalid';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStatusUpdate = async (id: string, newStatus: 'valid' | 'invalid') => {
    try {
      // TODO: Replace with actual Supabase mutation
      toast({
        title: "Status Updated",
        description: `Request has been marked as ${newStatus}.`,
      });
      
      // Close details if open
      if (isDetailsOpen) {
        setIsDetailsOpen(false);
        setSelectedResignation(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (resignation: ResignationTermination) => {
    setSelectedResignation(resignation);
    setIsDetailsOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Resignations & Terminations</h1>
          <p className="text-gray-600">Manage employee resignation and termination requests</p>
        </div>

        {/* Search Bar and Create Button */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by employee name or request type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            
            <Sheet open={isRequestFormOpen} onOpenChange={setIsRequestFormOpen}>
              <SheetTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[600px] sm:w-[700px] sm:max-w-[700px]">
                <SheetHeader>
                  <SheetTitle>New Resignation/Termination Request</SheetTitle>
                </SheetHeader>
                <ResignationRequestForm onClose={() => setIsRequestFormOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Resignations Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Employee</TableHead>
                <TableHead className="font-semibold text-gray-700">Request Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Date</TableHead>
                <TableHead className="font-semibold text-gray-700">Years of Service</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResignations.length > 0 ? (
                paginatedResignations.map((resignation, index) => (
                  <TableRow 
                    key={resignation.id} 
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={resignation.employee.profile_image_url || '/placeholder.svg'}
                          alt={resignation.employee.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{resignation.employee.name}</div>
                          <div className="text-sm text-gray-500">
                            {resignation.employee.position} • {resignation.employee.department.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 capitalize">
                      {resignation.request_type}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatDate(resignation.request_date)}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {resignation.years_of_service} years
                    </TableCell>
                    <TableCell>
                      <span className={getStatusBadge(resignation.status)}>
                        {getStatusLabel(resignation.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(resignation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {resignation.status === 'pending' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleStatusUpdate(resignation.id, 'valid')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleStatusUpdate(resignation.id, 'invalid')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No resignation/termination requests found
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

        {/* Details Sheet */}
        <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <SheetContent side="right" className="w-[600px] sm:w-[700px] sm:max-w-[700px]">
            <SheetHeader>
              <SheetTitle>Request Details</SheetTitle>
            </SheetHeader>
            {selectedResignation && (
              <ResignationDetails 
                resignation={selectedResignation}
                onStatusUpdate={handleStatusUpdate}
                onClose={() => setIsDetailsOpen(false)}
              />
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Resignations;
