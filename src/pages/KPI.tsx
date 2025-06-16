
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

  // Mock departments data based on the image
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

  const years = ['2024', '2023', '2022', '2021'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const ITEMS_PER_PAGE = 10;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDepartments = departments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(departments.length / ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-blue-400 text-white px-8 py-4 rounded-3xl mb-6">
            <h1 className="text-2xl font-bold">KPI</h1>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-4 mb-6 justify-center">
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

        {/* KPI Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-400">
                <TableHead className="font-bold text-white text-center border-r border-white">
                  Department Name
                </TableHead>
                <TableHead className="font-bold text-white text-center border-r border-white">
                  Department Description
                </TableHead>
                <TableHead className="font-bold text-white text-center">
                  View KPI
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDepartments.map((department, index) => (
                <TableRow 
                  key={department.id} 
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <TableCell className="text-center font-medium text-gray-900 border-r border-gray-200">
                    {department.name}
                  </TableCell>
                  <TableCell className="text-center text-gray-700 border-r border-gray-200">
                    {department.description}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      className="text-blue-600 hover:text-blue-800 font-medium"
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
      </div>
    </div>
  );
};

export default KPI;
