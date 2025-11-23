import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button, buttonVariants } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Users
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  avatar?: string;
}

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  
  const employees: Employee[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      position: 'Senior Developer',
      location: 'New York, NY'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '+1 (555) 987-6543',
      department: 'Marketing',
      position: 'Marketing Manager',
      location: 'San Francisco, CA'
    },
    {
      id: '3',
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Engineering',
      position: 'Frontend Developer',
      location: 'New York, NY'
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Williams',
      email: 'emily.williams@company.com',
      phone: '+1 (555) 234-5678',
      department: 'HR',
      position: 'HR Specialist',
      location: 'Chicago, IL'
    },
    {
      id: '5',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@company.com',
      phone: '+1 (555) 876-5432',
      department: 'Sales',
      position: 'Sales Director',
      location: 'San Francisco, CA'
    },
    {
      id: '6',
      firstName: 'Sarah',
      lastName: 'Davis',
      email: 'sarah.davis@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Engineering',
      position: 'DevOps Engineer',
      location: 'Austin, TX'
    }
  ];

  const departments = ['all', 'Engineering', 'Marketing', 'HR', 'Sales'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      selectedDepartment === 'all' || employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Company Directory</h1>
        <p className="text-gray-600 text-sm md:text-base">Search and connect with your colleagues</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-4 md:mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, department, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm md:text-base"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4 md:mb-6">
        <p className="text-gray-600 text-sm md:text-base">
          Showing {filteredEmployees.length} of {employees.length} employees
        </p>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredEmployees.map(employee => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start">
                <Avatar className="w-10 h-10 md:w-12 md:h-12 mr-3 md:mr-4">
                  <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                  <AvatarFallback className="bg-blue-500 text-white text-sm md:text-base">
                    {getInitials(employee.firstName, employee.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-base md:text-lg">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">{employee.position}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <Briefcase className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      {employee.department}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      {employee.location}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mt-4">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Mail className="w-3 h-3 mr-1" />
                  Message
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Departments Overview */}
      <Card className="mt-6 md:mt-8">
        <CardHeader>
          <CardTitle className="flex items-center text-base md:text-lg">
            <Users className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Departments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {departments.filter(dept => dept !== 'all').map(dept => {
              const count = employees.filter(emp => emp.department === dept).length;
              return (
                <div 
                  key={dept} 
                  className={`p-3 md:p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedDepartment === dept 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <h4 className="font-medium text-sm md:text-base">{dept}</h4>
                  <p className="text-gray-600 text-xs md:text-sm">{count} employees</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Directory;
