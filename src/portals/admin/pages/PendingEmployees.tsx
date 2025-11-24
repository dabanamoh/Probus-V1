import React, { useState } from 'react';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import {
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  User,
  Building2,
  Briefcase,
  Search,
  Copy,
  Eye,
  EyeOff,
  Key,
  UserCog
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shared/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PendingEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  department?: string;
  position?: string;
  role?: 'employee' | 'manager' | 'hr';
  lineManagerId?: string;
  lineManagerName?: string;
  lineManagerRole?: string;
}

interface Manager {
  id: string;
  name: string;
  position: string;
  department: string;
}

const PendingEmployees = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<PendingEmployee | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [approvalData, setApprovalData] = useState({
    department: '',
    position: '',
    role: 'employee' as 'employee' | 'manager' | 'hr',
    lineManagerId: '',
    lineManagerName: '',
    lineManagerRole: ''
  });

  // Mock pending employees data
  const [pendingEmployees, setPendingEmployees] = useState<PendingEmployee[]>([
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@company.com',
      status: 'pending',
      submittedAt: '2025-11-20T10:30:00Z'
    },
    {
      id: '2',
      firstName: 'Bob',
      lastName: 'Williams',
      email: 'bob.williams@company.com',
      status: 'pending',
      submittedAt: '2025-11-21T14:20:00Z'
    },
    {
      id: '3',
      firstName: 'Carol',
      lastName: 'Davis',
      email: 'carol.davis@company.com',
      status: 'approved',
      submittedAt: '2025-11-18T09:15:00Z',
      department: 'Engineering',
      position: 'Software Developer',
      role: 'employee',
      lineManagerId: 'mgr-001',
      lineManagerName: 'John Smith',
      lineManagerRole: 'Engineering Manager'
    }
  ]);

  // Mock available managers/employees who can be line managers
  const [availableManagers] = useState<Manager[]>([
    { id: 'mgr-001', name: 'John Smith', position: 'Engineering Manager', department: 'Engineering' },
    { id: 'mgr-002', name: 'Sarah Williams', position: 'Sales Manager', department: 'Sales' },
    { id: 'mgr-003', name: 'Michael Brown', position: 'Sales Supervisor', department: 'Sales' },
    { id: 'mgr-004', name: 'Emily Davis', position: 'CFO', department: 'Finance' },
    { id: 'mgr-005', name: 'Robert Johnson', position: 'HR Manager', department: 'Human Resources' },
    { id: 'mgr-006', name: 'Lisa Anderson', position: 'Marketing Director', department: 'Marketing' },
    { id: 'mgr-007', name: 'David Miller', position: 'Operations Manager', department: 'Operations' },
    { id: 'mgr-008', name: 'Jennifer Wilson', position: 'IT Manager', department: 'Engineering' },
    { id: 'mgr-009', name: 'James Taylor', position: 'Regional Sales Manager', department: 'Sales' },
    { id: 'mgr-010', name: 'Patricia Martinez', position: 'Finance Manager', department: 'Finance' }
  ]);

  const handleApprove = (employee: PendingEmployee) => {
    setSelectedEmployee(employee);
    setApprovalData({
      department: '',
      position: '',
      role: 'employee',
      lineManagerId: '',
      lineManagerName: '',
      lineManagerRole: ''
    });
    setShowApprovalDialog(true);
  };

  const generateUsername = (firstName: string, lastName: string) => {
    // Generate username: firstname.lastname (lowercase)
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  };

  const generatePassword = () => {
    // Generate a random secure password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const confirmApproval = () => {
    if (!approvalData.department || !approvalData.position || !approvalData.lineManagerId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including line manager",
        variant: "destructive"
      });
      return;
    }

    // Generate credentials
    const username = generateUsername(selectedEmployee?.firstName || '', selectedEmployee?.lastName || '');
    const password = generatePassword();

    // Update employee status
    setPendingEmployees(pendingEmployees.map(emp => 
      emp.id === selectedEmployee?.id 
        ? { 
            ...emp, 
            status: 'approved' as const,
            department: approvalData.department,
            position: approvalData.position,
            role: approvalData.role,
            lineManagerId: approvalData.lineManagerId,
            lineManagerName: approvalData.lineManagerName,
            lineManagerRole: approvalData.lineManagerRole
          }
        : emp
    ));

    // Store credentials in localStorage (in real app, would be in database)
    const credentials = {
      email: selectedEmployee?.email,
      username: username,
      password: password,
      role: approvalData.role,
      department: approvalData.department,
      position: approvalData.position,
      firstName: selectedEmployee?.firstName,
      lastName: selectedEmployee?.lastName,
      lineManagerId: approvalData.lineManagerId,
      lineManagerName: approvalData.lineManagerName,
      lineManagerRole: approvalData.lineManagerRole,
      createdAt: new Date().toISOString()
    };
    
    const existingCredentials = JSON.parse(localStorage.getItem('user_credentials') || '[]');
    existingCredentials.push(credentials);
    localStorage.setItem('user_credentials', JSON.stringify(existingCredentials));

    // Show credentials to admin
    setGeneratedCredentials({ username, password });
    setShowApprovalDialog(false);
    setShowCredentialsDialog(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`
    });
  };

  const handleReject = (employee: PendingEmployee) => {
    setPendingEmployees(pendingEmployees.map(emp => 
      emp.id === employee.id ? { ...emp, status: 'rejected' as const } : emp
    ));

    toast({
      title: "Registration Rejected",
      description: `${employee.firstName} ${employee.lastName}'s registration has been rejected.`,
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const filteredEmployees = pendingEmployees.filter(emp =>
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = pendingEmployees.filter(emp => emp.status === 'pending').length;

  return (
    <DashboardLayout title="Pending Employee Registrations" subtitle="Probus Admin">
      <div className="flex-1 p-4 sm:p-6 bg-blue-50 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Pending Registrations</h1>
              <p className="text-blue-600 mt-1">Review and approve new employee registrations</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {pendingCount} Pending
            </Badge>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6 border-blue-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Employees List */}
        <div className="space-y-4">
          {filteredEmployees.length === 0 ? (
            <Card className="border-blue-200">
              <CardContent className="p-8 text-center text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No employee registrations found</p>
              </CardContent>
            </Card>
          ) : (
            filteredEmployees.map((employee) => (
              <Card key={employee.id} className="border-blue-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-blue-900">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {employee.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm mb-3">
                        <div className="text-gray-600">
                          Submitted: {new Date(employee.submittedAt).toLocaleDateString()}
                        </div>
                        {employee.department && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Building2 className="w-4 h-4" />
                            {employee.department}
                          </div>
                        )}
                        {employee.position && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            {employee.position}
                          </div>
                        )}
                        {employee.lineManagerName && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <UserCog className="w-4 h-4" />
                            Reports to: {employee.lineManagerName} ({employee.lineManagerRole})
                          </div>
                        )}
                      </div>

                      {getStatusBadge(employee.status)}
                    </div>

                    {employee.status === 'pending' && (
                      <div className="flex flex-col gap-2 sm:w-auto w-full">
                        <Button
                          onClick={() => handleApprove(employee)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(employee)}
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Approval Dialog */}
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Employee Registration</DialogTitle>
              <DialogDescription>
                Assign role, department, and position to {selectedEmployee?.firstName} {selectedEmployee?.lastName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="department">Department *</Label>
                <select
                  id="department"
                  value={approvalData.department}
                  onChange={(e) => setApprovalData({...approvalData, department: e.target.value})}
                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={approvalData.position}
                  onChange={(e) => setApprovalData({...approvalData, position: e.target.value})}
                  placeholder="e.g., Software Developer"
                />
              </div>

              <div>
                <Label htmlFor="role">Role *</Label>
                <select
                  id="role"
                  value={approvalData.role}
                  onChange={(e) => setApprovalData({...approvalData, role: e.target.value as any})}
                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR</option>
                </select>
              </div>

              <div>
                <Label htmlFor="lineManager">Line Manager / Reports To *</Label>
                <select
                  id="lineManager"
                  value={approvalData.lineManagerId}
                  onChange={(e) => {
                    const selectedManager = availableManagers.find(m => m.id === e.target.value);
                    setApprovalData({
                      ...approvalData, 
                      lineManagerId: e.target.value,
                      lineManagerName: selectedManager?.name || '',
                      lineManagerRole: selectedManager?.position || ''
                    });
                  }}
                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Line Manager</option>
                  {approvalData.department && availableManagers
                    .filter(manager => manager.department === approvalData.department)
                    .map(manager => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} - {manager.position}
                      </option>
                    ))
                  }
                  <optgroup label="Other Departments">
                    {approvalData.department && availableManagers
                      .filter(manager => manager.department !== approvalData.department)
                      .map(manager => (
                        <option key={manager.id} value={manager.id}>
                          {manager.name} - {manager.position} ({manager.department})
                        </option>
                      ))
                    }
                  </optgroup>
                  {!approvalData.department && availableManagers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} - {manager.position} ({manager.department})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  This employee will report to the selected line manager. All approval flows will go through them.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmApproval} className="bg-green-500 hover:bg-green-600">
                Approve & Send Welcome Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Credentials Dialog */}
        <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Employee Approved!
              </DialogTitle>
              <DialogDescription>
                {selectedEmployee?.firstName} {selectedEmployee?.lastName} has been approved. Share these credentials with them.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-green-900">Login Credentials</p>
                </div>
                <p className="text-xs text-green-700">Please save these credentials. They will not be shown again.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-600">Username</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={generatedCredentials.username}
                      readOnly
                      className="bg-gray-50"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedCredentials.username, 'Username')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Password</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="relative flex-1">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={generatedCredentials.password}
                        readOnly
                        className="bg-gray-50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedCredentials.password, 'Password')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Important:</strong> Send these credentials to the employee via a secure channel. 
                  They can change their password after first login.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                onClick={() => {
                  setShowCredentialsDialog(false);
                  setSelectedEmployee(null);
                  setGeneratedCredentials({ username: '', password: '' });
                  setShowPassword(false);
                  toast({
                    title: "Success",
                    description: "Employee has been onboarded successfully!"
                  });
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PendingEmployees;
