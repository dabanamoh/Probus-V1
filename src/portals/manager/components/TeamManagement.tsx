import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Building2,
  UserCheck,
  UserX,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Badge } from "../../shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";

const TeamManagement = ({ onOpenChat }: { onOpenChat?: (employeeId: string, employeeName: string, callType?: 'voice' | 'video') => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock team data - managers can view their team members
  const teamMembers = [
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
      performance: 92,
      lastReview: '2024-06-15',
      kpis: {
        productivity: 95,
        quality: 88,
        collaboration: 90
      }
    },
    {
      id: 'EMP002',
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Engineering',
      position: 'Frontend Developer',
      status: 'active',
      startDate: '2022-08-20',
      location: 'San Francisco',
      performance: 85,
      lastReview: '2024-05-20',
      kpis: {
        productivity: 82,
        quality: 90,
        collaboration: 85
      }
    },
    {
      id: 'EMP003',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Engineering',
      position: 'Backend Developer',
      status: 'on-leave',
      startDate: '2023-03-10',
      location: 'Chicago',
      performance: 78,
      lastReview: '2024-07-10',
      kpis: {
        productivity: 80,
        quality: 85,
        collaboration: 70
      }
    },
    {
      id: 'EMP004',
      name: 'David Kim',
      email: 'david.kim@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Engineering',
      position: 'DevOps Engineer',
      status: 'active',
      startDate: '2024-09-01',
      location: 'Boston',
      performance: 88,
      lastReview: 'Pending',
      kpis: {
        productivity: 85,
        quality: 92,
        collaboration: 88
      }
    }
  ];

  const departments = ['All', 'Engineering', 'Marketing', 'Sales', 'Design'];
  const statuses = ['All', 'Active', 'On Leave', 'Probation'];

  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || member.department.toLowerCase() === filterDepartment.toLowerCase();
    const matchesStatus = filterStatus === 'all' || member.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'on-leave':
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      case 'probation':
        return <Badge className="bg-orange-100 text-orange-800">Probation</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 80) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const handleViewEmployee = (employeeId: string) => {
    console.log('View employee:', employeeId);
  };

  const handleContactEmployee = (employeeId: string, employeeName: string, callType?: 'voice' | 'video') => {
    if (onOpenChat) {
      onOpenChat(employeeId, employeeName, callType);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Team Management</h1>
            <p className="text-gray-600">View your team members and their performance</p>
          </div>
          <div>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Team Report
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Team Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Team Size</p>
                      <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Members</p>
                      <p className="text-2xl font-bold text-green-600">
                        {teamMembers.filter(m => m.status === 'active').length}
                      </p>
                    </div>
                    <UserCheck className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Performance</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(teamMembers.reduce((acc, m) => acc + m.performance, 0) / teamMembers.length)}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Reviews Due</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {teamMembers.filter(m => m.lastReview === 'Pending').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search team members by name, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
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

            {/* Team Members Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members ({filteredTeamMembers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeamMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{member.email}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Phone className="w-3 h-3" />
                                <span>{member.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{member.position}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {member.location}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{member.performance}%</div>
                              {getPerformanceBadge(member.performance)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(member.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewEmployee(member.id)}
                                title="View Details"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleContactEmployee(member.id, member.name)}
                                title="Send Message"
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
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{member.name}</span>
                      {getPerformanceBadge(member.performance)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Productivity</span>
                          <span>{member.kpis.productivity}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${member.kpis.productivity}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Quality</span>
                          <span>{member.kpis.quality}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${member.kpis.quality}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Collaboration</span>
                          <span>{member.kpis.collaboration}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${member.kpis.collaboration}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="development" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Development Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Track and manage team member development goals and progress.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Skills Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Evaluate and track skill development across your team.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamManagement;
