import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Building2,
  UserCheck,
  UserX,
  Download,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Badge } from "../../shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../shared/ui/dialog";
import { Label } from "../../shared/ui/label";
import { Textarea } from "../../shared/ui/textarea";

const EmployeeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    status: 'active',
    startDate: '',
    location: '',
    manager: '',
    employeeType: 'full-time'
  });

  // Mock employee data with HR-relevant information
  const employees = [
    {
      id: 'EMP001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      position: 'Senior Developer',
      status: 'active',
      startDate: '2023-01-15',
      location: 'New York',
      manager: 'John Smith',
      employeeType: 'full-time',
      lastReview: '2024-06-15'
    },
    {
      id: 'EMP002',
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Marketing',
      position: 'Marketing Manager',
      status: 'active',
      startDate: '2022-08-20',
      location: 'San Francisco',
      manager: 'Lisa Brown',
      employeeType: 'full-time',
      lastReview: '2024-05-20'
    },
    {
      id: 'EMP003',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      phone: '+1 (555) 345-6789',
      department: 'HR',
      position: 'HR Specialist',
      status: 'on-leave',
      startDate: '2023-03-10',
      location: 'Chicago',
      manager: 'Robert Wilson',
      employeeType: 'full-time',
      lastReview: '2024-07-10'
    },
    {
      id: 'EMP004',
      name: 'David Kim',
      email: 'david.kim@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Finance',
      position: 'Financial Analyst',
      status: 'probation',
      startDate: '2024-09-01',
      location: 'Boston',
      manager: 'Anna Lee',
      employeeType: 'full-time',
      lastReview: 'Not scheduled'
    },
    {
      id: 'EMP005',
      name: 'Jessica Wong',
      email: 'jessica.wong@company.com',
      phone: '+1 (555) 567-8901',
      department: 'Engineering',
      position: 'Frontend Developer',
      status: 'terminated',
      startDate: '2022-11-15',
      location: 'Seattle',
      manager: 'John Smith',
      employeeType: 'contract',
      lastReview: '2024-01-15'
    }
  ];

  const departments = ['All', 'Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations'];
  const statuses = ['All', 'Active', 'On Leave', 'Probation', 'Terminated'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department.toLowerCase() === filterDepartment.toLowerCase();
    const matchesStatus = filterStatus === 'all' || employee.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-sky-100 text-sky-800 border border-sky-200">Active</Badge>;
      case 'on-leave':
        return <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-200">On Leave</Badge>;
      case 'probation':
        return <Badge className="bg-cyan-100 text-cyan-800 border border-cyan-200">Probation</Badge>;
      case 'terminated':
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Terminated</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewEmployee = (employeeId: string) => {
    console.log('View employee:', employeeId);
    // Show toast notification
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #3b82f6;z-index:9999;"><p style="margin:0;font-weight:600;color:#1e3a8a;font-size:14px;">Viewing employee ${employeeId}</p></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 2000);
  };

   const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setEmployeeForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      status: employee.status,
      startDate: employee.startDate,
      location: employee.location,
      manager: employee.manager,
      employeeType: employee.employeeType
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEmployee = () => {
    const toastDiv = document.createElement('div');
    const action = selectedEmployee ? 'updated' : 'added';
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #10b981;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#d1fae5;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 5L7.5 14.167L3.333 10" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#065f46;font-size:14px;">Employee ${action.charAt(0).toUpperCase() + action.slice(1)}</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">${employeeForm.name} has been ${action} successfully</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
    
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
    setEmployeeForm({
      name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      status: 'active',
      startDate: '',
      location: '',
      manager: '',
      employeeType: 'full-time'
    });
  };

  const handleContactEmployee = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

   const handleImport = () => {
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #3b82f6;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#dbeafe;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 16v1a2 2 0 002 2h8a2 2 0 002-2v-1M8 12l4-4m0 0l4 4m-4-4v9" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#1e3a8a;font-size:14px;">Import Ready</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">Select CSV/Excel file to import</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 2500);
    // Trigger file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        const importToast = document.createElement('div');
        importToast.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #10b981;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#d1fae5;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 5L7.5 14.167L3.333 10" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#065f46;font-size:14px;">Import Complete</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">Imported ${file.name}</p></div></div></div>`;
        document.body.appendChild(importToast);
        setTimeout(() => importToast.remove(), 3000);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #10b981;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#d1fae5;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12v4a2 2 0 002 2h8a2 2 0 002-2v-4M12 8l-4 4m0 0l-4-4m4 4V2" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#065f46;font-size:14px;">Export Started</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">Exporting ${filteredEmployees.length} employees...</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
    // Simulate export
    setTimeout(() => {
      const exportToast = document.createElement('div');
      exportToast.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #10b981;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#d1fae5;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 5L7.5 14.167L3.333 10" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#065f46;font-size:14px;">Export Complete</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">employees_${new Date().toISOString().split('T')[0]}.csv downloaded</p></div></div></div>`;
      document.body.appendChild(exportToast);
      setTimeout(() => exportToast.remove(), 3000);
    }, 1500);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setEmployeeForm({
      name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      status: 'active',
      startDate: '',
      location: '',
      manager: '',
      employeeType: 'full-time'
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-blue-50/30 min-h-screen">
      <div className="mb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Employee Management</h1>
            <p className="text-blue-700">Manage employee records, details, and organizational structure</p>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
              onClick={handleImport}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleAddEmployee}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={employeeForm.name}
                        onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={employeeForm.email}
                        onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                        placeholder="john.doe@company.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={employeeForm.phone}
                        onChange={(e) => setEmployeeForm({...employeeForm, phone: e.target.value})}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={employeeForm.startDate}
                        onChange={(e) => setEmployeeForm({...employeeForm, startDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department *</Label>
                      <Select value={employeeForm.department} onValueChange={(value) => setEmployeeForm({...employeeForm, department: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="position">Position *</Label>
                      <Input
                        id="position"
                        value={employeeForm.position}
                        onChange={(e) => setEmployeeForm({...employeeForm, position: e.target.value})}
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={employeeForm.location}
                        onChange={(e) => setEmployeeForm({...employeeForm, location: e.target.value})}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="manager">Manager</Label>
                      <Input
                        id="manager"
                        value={employeeForm.manager}
                        onChange={(e) => setEmployeeForm({...employeeForm, manager: e.target.value})}
                        placeholder="Manager Name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employeeType">Employment Type</Label>
                      <Select value={employeeForm.employeeType} onValueChange={(value) => setEmployeeForm({...employeeForm, employeeType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={employeeForm.status} onValueChange={(value) => setEmployeeForm({...employeeForm, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="probation">Probation</SelectItem>
                          <SelectItem value="on-leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSaveEmployee} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Add Employee
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Total Employees</p>
                  <p className="text-2xl font-bold text-blue-900">{employees.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-700">Active</p>
                  <p className="text-2xl font-bold text-sky-900">
                    {employees.filter(e => e.status === 'active').length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-sky-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-700">On Leave</p>
                  <p className="text-2xl font-bold text-indigo-900">
                    {employees.filter(e => e.status === 'on-leave').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-700">New Hires</p>
                  <p className="text-2xl font-bold text-cyan-900">
                    {employees.filter(e => new Date(e.startDate) > new Date('2024-01-01')).length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-cyan-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border border-blue-200 bg-gradient-to-r from-blue-50/50 to-sky-50/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4" />
                  <Input
                    placeholder="Search employees by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-40 border-blue-200">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32 border-blue-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status.toLowerCase()}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card className="border border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Users className="w-5 h-5 text-blue-600" />
              Employee Directory ({filteredEmployees.length} employees)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{employee.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.department}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {employee.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.position}</div>
                          <div className="text-sm text-gray-500">{employee.employeeType}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(employee.status)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{new Date(employee.startDate).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">
                            {Math.floor((new Date().getTime() - new Date(employee.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 hover:bg-blue-50"
                            onClick={() => handleViewEmployee(employee.id)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 hover:bg-blue-50"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 hover:bg-blue-50"
                            onClick={() => handleContactEmployee(employee.email)}
                          >
                            <Mail className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee - {selectedEmployee?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                  placeholder="john.doe@company.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({...employeeForm, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <Label htmlFor="edit-startDate">Start Date *</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={employeeForm.startDate}
                  onChange={(e) => setEmployeeForm({...employeeForm, startDate: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-department">Department *</Label>
                <Select value={employeeForm.department} onValueChange={(value) => setEmployeeForm({...employeeForm, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-position">Position *</Label>
                <Input
                  id="edit-position"
                  value={employeeForm.position}
                  onChange={(e) => setEmployeeForm({...employeeForm, position: e.target.value})}
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={employeeForm.location}
                  onChange={(e) => setEmployeeForm({...employeeForm, location: e.target.value})}
                  placeholder="New York"
                />
              </div>
              <div>
                <Label htmlFor="edit-manager">Manager</Label>
                <Input
                  id="edit-manager"
                  value={employeeForm.manager}
                  onChange={(e) => setEmployeeForm({...employeeForm, manager: e.target.value})}
                  placeholder="Manager Name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-employeeType">Employment Type</Label>
                <Select value={employeeForm.employeeType} onValueChange={(value) => setEmployeeForm({...employeeForm, employeeType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={employeeForm.status} onValueChange={(value) => setEmployeeForm({...employeeForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="probation">Probation</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveEmployee} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Update Employee
              </Button>
              <Button onClick={() => setIsEditDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
