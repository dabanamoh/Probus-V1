
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
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
import CreateKPIForm from '@/components/CreateKPIForm';

interface KPI {
  id: string;
  category: string;
  target: number;
  current_score: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const ITEMS_PER_PAGE = 10;

const KPI = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for now - you can replace this with actual Supabase query later
  const mockKPIs: KPI[] = [
    {
      id: '1',
      category: 'Supplier Value',
      target: 85,
      current_score: 78,
      description: 'Overall supplier performance and value delivery',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      category: 'Price Negotiation',
      target: 90,
      current_score: 92,
      description: 'Effectiveness in price negotiations with suppliers',
      created_at: '2024-01-10T14:20:00Z',
      updated_at: '2024-01-10T14:20:00Z',
    },
    {
      id: '3',
      category: 'Quality Assurance',
      target: 95,
      current_score: 88,
      description: 'Quality standards maintained across all operations',
      created_at: '2024-01-08T09:15:00Z',
      updated_at: '2024-01-08T09:15:00Z',
    },
    {
      id: '4',
      category: 'Delivery Performance',
      target: 80,
      current_score: 65,
      description: 'On-time delivery and logistics efficiency',
      created_at: '2024-01-05T16:45:00Z',
      updated_at: '2024-01-05T16:45:00Z',
    },
  ];

  // Filter KPIs based on search term
  const filteredKPIs = mockKPIs.filter(kpi =>
    kpi.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate filtered results
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedKPIs = filteredKPIs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredKPIs.length / ITEMS_PER_PAGE);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const getPerformanceBadge = (score: number, target: number) => {
    const percentage = (score / target) * 100;
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    if (percentage >= 81) {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (percentage >= 61) {
      return `${baseClasses} bg-blue-100 text-blue-800`;
    } else if (percentage >= 41) {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else if (percentage >= 21) {
      return `${baseClasses} bg-orange-100 text-orange-800`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  const getPerformanceLabel = (score: number, target: number) => {
    const percentage = (score / target) * 100;
    
    if (percentage >= 81) {
      return 'Outstanding';
    } else if (percentage >= 61) {
      return 'Good Performance';
    } else if (percentage >= 41) {
      return 'Meets Expectations';
    } else if (percentage >= 21) {
      return 'Below Average';
    } else {
      return 'Poor Performance';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">KPI Management</h1>
          <p className="text-gray-600">Monitor and manage key performance indicators</p>
        </div>

        {/* Search Bar and Create Button */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search KPIs by category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            
            <Sheet open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
              <SheetTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New KPI
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[600px] sm:w-[700px] sm:max-w-[700px]">
                <SheetHeader>
                  <SheetTitle>Create New KPI</SheetTitle>
                </SheetHeader>
                <CreateKPIForm onClose={() => setIsCreateFormOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* KPI Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">KPI Category</TableHead>
                <TableHead className="font-semibold text-gray-700">Target</TableHead>
                <TableHead className="font-semibold text-gray-700">Current Score</TableHead>
                <TableHead className="font-semibold text-gray-700">Performance</TableHead>
                <TableHead className="font-semibold text-gray-700">Last Updated</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedKPIs.length > 0 ? (
                paginatedKPIs.map((kpi, index) => (
                  <TableRow 
                    key={kpi.id} 
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{kpi.category}</div>
                        {kpi.description && (
                          <div className="text-sm text-gray-500">{kpi.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 font-medium">
                      {kpi.target}%
                    </TableCell>
                    <TableCell className="text-gray-700 font-medium">
                      {kpi.current_score}%
                    </TableCell>
                    <TableCell>
                      <span className={getPerformanceBadge(kpi.current_score, kpi.target)}>
                        {getPerformanceLabel(kpi.current_score, kpi.target)}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatDate(kpi.updated_at)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No KPIs found
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

export default KPI;
