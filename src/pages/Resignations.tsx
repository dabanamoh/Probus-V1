import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import ResignationRequestForm from '@/components/ResignationRequestForm';
import ResignationDetails from '@/components/ResignationDetails';
import { Search } from 'lucide-react';

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
  description?: string;
  documents_url?: string;
  created_at: string;
  updated_at: string;
  employee: Employee;
}

const Resignations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResignation, setSelectedResignation] = useState<ResignationTermination | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const ITEMS_PER_PAGE = 10;

  const { data: resignations = [], isLoading, error } = useQuery({
    queryKey: ['resignations'],
    queryFn: async () => {
      console.log('Fetching resignations...');
      
      const { data, error } = await supabase
        .from('resignations_terminations')
        .select(`
          *,
          employee:employees(
            id,
            name,
            position,
            profile_image_url,
            department:departments(
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching resignations:', error);
        throw error;
      }

      console.log('Fetched resignations:', data);
      return data as ResignationTermination[];
    }
  });

  const filteredResignations = resignations.filter(resignation =>
    resignation.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resignation.employee?.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resignation.employee?.department?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resignation.request_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resignation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedResignations = filteredResignations.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredResignations.length / ITEMS_PER_PAGE);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'invalid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'resignation':
        return 'bg-blue-100 text-blue-800';
      case 'termination':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (resignation: ResignationTermination) => {
    // Create a compatible object for ResignationDetails component
    const detailsData = {
      id: resignation.id,
      request_type: resignation.request_type as "resignation" | "termination",
      years_of_service: resignation.years_of_service,
      request_date: resignation.request_date,
      status: resignation.status as "pending" | "valid" | "invalid",
      description: resignation.description || '', // Use the actual description or default to empty
      documents_url: resignation.documents_url || '', // Use the actual documents_url or default to empty
      employee: resignation.employee
    };
    
    setSelectedResignation(detailsData as any);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 w-full">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading resignations...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 w-full">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">Error loading resignations. Please try again.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-blue-400 text-white px-8 py-4 rounded-3xl mb-6">
            <h1 className="text-2xl font-bold">Resignations/Terminations</h1>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
            <Input
              placeholder="Search resignations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-400 hover:bg-blue-500 text-white">
                Request Resignation/Termination
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Resignation/Termination Request</DialogTitle>
              </DialogHeader>
              <ResignationRequestForm onClose={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Resignations Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-400">
                <TableHead className="font-bold text-white text-center">Employee</TableHead>
                <TableHead className="font-bold text-white text-center">Department</TableHead>
                <TableHead className="font-bold text-white text-center">Position</TableHead>
                <TableHead className="font-bold text-white text-center">Request Type</TableHead>
                <TableHead className="font-bold text-white text-center">Request Date</TableHead>
                <TableHead className="font-bold text-white text-center">Years of Service</TableHead>
                <TableHead className="font-bold text-white text-center">Status</TableHead>
                <TableHead className="font-bold text-white text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResignations.map((resignation, index) => (
                <TableRow 
                  key={resignation.id} 
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={resignation.employee?.profile_image_url} 
                          alt={resignation.employee?.name} 
                        />
                        <AvatarFallback>
                          {resignation.employee?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{resignation.employee?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {resignation.employee?.department?.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {resignation.employee?.position}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`${getRequestTypeColor(resignation.request_type)} border-0`}>
                      {resignation.request_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(resignation.request_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {resignation.years_of_service} years
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`${getStatusColor(resignation.status)} border-0`}>
                      {resignation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDetails(resignation)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t bg-gray-50">
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
                        className={currentPage === page ? 'bg-blue-400 text-white' : ''}
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

        {/* Resignation Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Resignation/Termination Details</DialogTitle>
            </DialogHeader>
            {selectedResignation && (
              <ResignationDetails 
                resignation={selectedResignation}
                onClose={() => setIsDetailsOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Resignations;
