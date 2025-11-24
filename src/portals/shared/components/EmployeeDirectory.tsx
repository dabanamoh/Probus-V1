import React, { useState } from 'react';
import { Card, CardContent } from "../../shared/ui/card";
import { Input } from "../../shared/ui/input";
import { Badge } from "../../shared/ui/badge";
import { Button } from "../../shared/ui/button";
import { 
  Search, 
  Mail, 
  Phone, 
  Building2,
  User,
  Filter,
  MapPin
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
  status: 'active' | 'on_leave' | 'inactive';
}

interface EmployeeDirectoryProps {
  onOpenChat?: (employeeId: string, employeeName: string, callType?: 'voice' | 'video') => void;
}

const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({ onOpenChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Mock employee data
  const employees: Employee[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      position: 'Senior Developer',
      location: 'New York, NY',
      status: 'active'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Human Resources',
      position: 'HR Manager',
      location: 'San Francisco, CA',
      status: 'active'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Engineering',
      position: 'DevOps Engineer',
      location: 'Austin, TX',
      status: 'active'
    },
    {
      id: '4',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Marketing',
      position: 'Marketing Director',
      location: 'Chicago, IL',
      status: 'active'
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@company.com',
      phone: '+1 (555) 567-8901',
      department: 'Finance',
      position: 'Financial Analyst',
      location: 'Boston, MA',
      status: 'on_leave'
    },
    {
      id: '6',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@company.com',
      phone: '+1 (555) 678-9012',
      department: 'Engineering',
      position: 'Frontend Developer',
      location: 'Seattle, WA',
      status: 'active'
    },
    {
      id: '7',
      firstName: 'Robert',
      lastName: 'Martinez',
      email: 'robert.martinez@company.com',
      phone: '+1 (555) 789-0123',
      department: 'Sales',
      position: 'Sales Manager',
      location: 'Miami, FL',
      status: 'active'
    },
    {
      id: '8',
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.anderson@company.com',
      phone: '+1 (555) 890-1234',
      department: 'Operations',
      position: 'Operations Manager',
      location: 'Denver, CO',
      status: 'active'
    }
  ];

  const departments = ['all', ...Array.from(new Set(employees.map(emp => emp.department)))];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'on_leave':
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Employee Directory</h2>
        <p className="text-gray-600 text-sm">Find and connect with colleagues across the organization</p>
      </div>

      {/* Filters */}
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, department, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredEmployees.length} of {employees.length} employees
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.length === 0 ? (
          <Card className="col-span-full border-blue-200">
            <CardContent className="p-8 text-center text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No employees found</p>
            </CardContent>
          </Card>
        ) : (
          filteredEmployees.map((employee) => (
            <Card key={employee.id} className="border-blue-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={`/placeholder-avatar-${employee.id}.jpg`} alt={`${employee.firstName} ${employee.lastName}`} />
                    <AvatarFallback className="bg-blue-500 text-white text-lg">
                      {getInitials(employee.firstName, employee.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-blue-900 truncate">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{employee.position}</p>
                    <div className="mt-2">
                      {getStatusBadge(employee.status)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <a href={`mailto:${employee.email}`} className="text-blue-600 hover:underline truncate">
                      {employee.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <a href={`tel:${employee.phone}`} className="hover:text-blue-600 truncate">
                      {employee.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{employee.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onOpenChat?.(employee.id, `${employee.firstName} ${employee.lastName}`)}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => onOpenChat?.(employee.id, `${employee.firstName} ${employee.lastName}`, 'voice')}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeDirectory;
