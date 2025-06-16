
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import CreateKPIForm from '@/components/CreateKPIForm';
import KPIDetailsModal from '@/components/KPIDetailsModal';

interface KPI {
  id: string;
  category: string;
  description: string;
  target: number;
  current: number;
  score: number;
  department: string;
  employee: string;
  lastUpdated: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
}

const KPI = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Mock departments data
  const departments: Department[] = [
    {
      id: '1',
      name: 'Finance Department',
      description: 'Financial record keeping, budget management, payroll'
    },
    {
      id: '2',
      name: 'Sales/Marketing Department',
      description: 'Market research, promotional activities, customer relations'
    },
    {
      id: '3',
      name: 'Production/Operations',
      description: 'Production planning, quality control, maintenance'
    },
    {
      id: '4',
      name: 'Customer Service',
      description: 'Customer support, service quality assurance'
    },
    {
      id: '5',
      name: 'Administrative',
      description: 'Coordination, decision making, event management'
    },
    {
      id: '6',
      name: 'Purchasing/Procurement',
      description: 'Supplier management, goods procurement, inventory control'
    },
    {
      id: '7',
      name: 'Human Resources',
      description: 'Recruitment, training, employee relations'
    }
  ];

  // Enhanced KPI data with employee information
  const kpis: KPI[] = [
    {
      id: '1',
      category: 'Supplier Value',
      description: 'Evaluation of supplier performance based on quality, delivery time, and cost-effectiveness',
      target: 90,
      current: 85,
      score: 94,
      department: 'Purchasing/Procurement',
      employee: 'Sarah Johnson',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      category: 'Price Negotiation',
      description: 'Success rate in achieving favorable pricing through negotiation processes',
      target: 80,
      current: 72,
      score: 90,
      department: 'Purchasing/Procurement',
      employee: 'Michael Chen',
      lastUpdated: '2024-01-14'
    },
    {
      id: '3',
      category: 'Customer Satisfaction',
      description: 'Overall customer satisfaction rating based on feedback and surveys',
      target: 95,
      current: 88,
      score: 93,
      department: 'Customer Service',
      employee: 'Emily Davis',
      lastUpdated: '2024-01-13'
    },
    {
      id: '4',
      category: 'Sales Revenue',
      description: 'Monthly sales revenue achievement compared to set targets',
      target: 100000,
      current: 85000,
      score: 85,
      department: 'Sales/Marketing Department',
      employee: 'David Wilson',
      lastUpdated: '2024-01-12'
    },
    {
      id: '5',
      category: 'Production Efficiency',
      description: 'Overall production efficiency measured by output per hour',
      target: 85,
      current: 78,
      score: 92,
      department: 'Production/Operations',
      employee: 'Lisa Brown',
      lastUpdated: '2024-01-11'
    },
    {
      id: '6',
      category: 'Budget Compliance',
      description: 'Adherence to allocated budget across all departments',
      target: 95,
      current: 92,
      score: 97,
      department: 'Finance Department',
      employee: 'Robert Garcia',
      lastUpdated: '2024-01-10'
    },
    {
      id: '7',
      category: 'Employee Retention',
      description: 'Rate of employee retention over a 12-month period',
      target: 90,
      current: 87,
      score: 97,
      department: 'Human Resources',
      employee: 'Jennifer Lee',
      lastUpdated: '2024-01-09'
    },
    {
      id: '8',
      category: 'Quality Control',
      description: 'Percentage of products meeting quality standards',
      target: 98,
      current: 96,
      score: 98,
      department: 'Production/Operations',
      employee: 'Mark Thompson',
      lastUpdated: '2024-01-08'
    },
    {
      id: '9',
      category: 'Customer Response Time',
      description: 'Average time to respond to customer inquiries',
      target: 2,
      current: 1.5,
      score: 95,
      department: 'Customer Service',
      employee: 'Amanda Rodriguez',
      lastUpdated: '2024-01-07'
    },
    {
      id: '10',
      category: 'Marketing ROI',
      description: 'Return on investment for marketing campaigns',
      target: 300,
      current: 280,
      score: 93,
      department: 'Sales/Marketing Department',
      employee: 'Chris Martinez',
      lastUpdated: '2024-01-06'
    }
  ];

  const years = ['2024', '2023', '2022', '2021'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getPerformanceColor = (score: number) => {
    if (score >= 81) return 'bg-green-100 text-green-800';
    if (score >= 61) return 'bg-blue-100 text-blue-800';
    if (score >= 41) return 'bg-yellow-100 text-yellow-800';
    if (score >= 21) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 81) return 'Outstanding';
    if (score >= 61) return 'Above Average';
    if (score >= 41) return 'Meets Expectations';
    if (score >= 21) return 'Below Average';
    return 'Poor Performance';
  };

  // Filter KPIs based on selected department
  const filteredKPIs = selectedDepartment 
    ? kpis.filter(kpi => {
        const dept = departments.find(d => d.id === selectedDepartment);
        return dept && kpi.department === dept.name;
      })
    : kpis;

  const ITEMS_PER_PAGE = 10;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedKPIs = filteredKPIs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredKPIs.length / ITEMS_PER_PAGE);

  const handleViewKPI = (kpi: KPI) => {
    setSelectedKPI(kpi);
    setIsDetailsOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-blue-400 text-white px-8 py-4 rounded-3xl mb-6">
            <h1 className="text-2xl font-bold">KPI Management</h1>
          </div>
        </div>

        {/* Filter Controls and Create Button */}
        <div className="flex gap-4 mb-6 justify-between items-center">
          <div className="flex gap-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-40 bg-white border-2">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48 bg-white border-2">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-56 bg-white border-2">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-400 hover:bg-blue-500 text-white">
                Create New KPI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New KPI</DialogTitle>
              </DialogHeader>
              <CreateKPIForm onClose={() => setIsCreateFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* KPI Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-400">
                <TableHead className="font-bold text-white text-center border-r border-white">
                  KPI Category
                </TableHead>
                <TableHead className="font-bold text-white text-center border-r border-white">
                  Employee
                </TableHead>
                <TableHead className="font-bold text-white text-center border-r border-white">
                  Department
                </TableHead>
                <TableHead className="font-bold text-white text-center border-r border-white">
                  Target
                </TableHead>
                <TableHead className="font-bold text-white text-center border-r border-white">
                  Current
                </TableHead>
                <TableHead className="font-bold text-white text-center border-r border-white">
                  Score
                </TableHead>
                <TableHead className="font-bold text-white text-center border-r border-white">
                  Performance
                </TableHead>
                <TableHead className="font-bold text-white text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedKPIs.map((kpi, index) => (
                <TableRow 
                  key={kpi.id} 
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <TableCell className="text-center font-medium text-gray-900 border-r border-gray-200">
                    {kpi.category}
                  </TableCell>
                  <TableCell className="text-center text-gray-700 border-r border-gray-200 font-medium">
                    {kpi.employee}
                  </TableCell>
                  <TableCell className="text-center text-gray-700 border-r border-gray-200">
                    {kpi.department}
                  </TableCell>
                  <TableCell className="text-center text-gray-700 border-r border-gray-200">
                    {kpi.target}
                  </TableCell>
                  <TableCell className="text-center text-gray-700 border-r border-gray-200">
                    {kpi.current}
                  </TableCell>
                  <TableCell className="text-center font-medium border-r border-gray-200">
                    {kpi.score}%
                  </TableCell>
                  <TableCell className="text-center border-r border-gray-200">
                    <Badge className={`${getPerformanceColor(kpi.score)} border-0`}>
                      {getPerformanceLabel(kpi.score)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => handleViewKPI(kpi)}
                    >
                      View
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

        {/* KPI Details Modal */}
        <KPIDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          kpi={selectedKPI}
        />
      </div>
    </div>
  );
};

export default KPI;
