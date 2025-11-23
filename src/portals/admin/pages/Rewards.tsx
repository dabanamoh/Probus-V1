import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Badge } from "../../shared/ui/badge";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/table";
import { Search, Award, AlertTriangle, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui/dialog";
import IncidentDetails from '../components/details/IncidentDetails';
import RewardDetails from '../components/details/RewardDetails';

interface Employee {
  id: string;
  name: string;
  position: string | null;
  profile_image_url: string | null;
  department: {
    id: string;
    name: string;
  } | null;
}

interface Incident {
  id: string;
  incident_type: string;
  description: string;
  date_reported: string;
  location: string | null;
  status: 'pending' | 'resolved' | 'invalid';
  employee: Employee;
}

interface Reward {
  id: string;
  type: 'reward' | 'punishment';
  category: string;
  description: string;
  amount: number | null;
  date_awarded: string;
  status: 'pending' | 'approved' | 'rejected';
  awarded_by: string | null;
  employee: Employee;
  incident: {
    id: string;
    description: string;
  } | null;
}

const Rewards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isIncidentDetailsOpen, setIsIncidentDetailsOpen] = useState(false);
  const [isRewardDetailsOpen, setIsRewardDetailsOpen] = useState(false);

  // Fetch incidents with employee and department data
  const { data: incidents = [], isLoading: incidentsLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      try {
        // First, fetch all incidents
        const { data: incidentsData, error: incidentsError } = await localDb
          .from('incidents')
          .select('*')
          .order('date', { ascending: false });

        if (incidentsError) {
          console.error('Error fetching incidents:', incidentsError);
          throw incidentsError;
        }

        // Then, fetch all employees to join with incidents
        const { data: employeesData, error: employeesError } = await localDb
          .from('employees')
          .select('*');

        if (employeesError) {
          console.error('Error fetching employees:', employeesError);
          throw employeesError;
        }

        // Fetch all departments for joining
        const { data: departmentsData, error: departmentsError } = await localDb
          .from('departments')
          .select('*');

        if (departmentsError) {
          console.error('Error fetching departments:', departmentsError);
          throw departmentsError;
        }

        // Join incidents with employees and departments
        const incidentsWithEmployees = (incidentsData || []).map(incident => {
          const employee = employeesData.find(emp => emp.id === incident.employee_id) || null;

          // If employee has a department_id, fetch the department
          let department = null;
          if (employee && employee.department_id) {
            const dept = departmentsData.find(d => d.id === employee.department_id);
            if (dept) {
              department = {
                id: dept.id,
                name: dept.name
              };
            }
          }

          return {
            id: incident.id,
            incident_type: incident.title || 'Incident',
            description: incident.description || '',
            date_reported: incident.date || new Date().toISOString(),
            location: incident.severity || null,
            status: (incident.status || 'pending') as 'pending' | 'resolved' | 'invalid',
            employee: employee ? {
              id: employee.id,
              name: employee.name || 'Unknown',
              position: employee.position || null,
              profile_image_url: employee.profile_image_url || null,
              department
            } : {
              id: 'unknown',
              name: 'Unknown',
              position: null,
              profile_image_url: null,
              department: null
            }
          } as Incident;
        });

        return incidentsWithEmployees;
      } catch (error) {
        console.error('Failed to fetch incidents:', error);
        return [];
      }
    },
  });

  // Fetch rewards with employee and incident data
  const { data: rewards = [], isLoading: rewardsLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      try {
        // First, fetch all rewards/punishments
        const { data: rewardsData, error: rewardsError } = await localDb
          .from('rewards_punishments')
          .select('*')
          .order('date', { ascending: false });

        if (rewardsError) {
          console.error('Error fetching rewards:', rewardsError);
          throw rewardsError;
        }

        // Then, fetch all employees to join with rewards
        const { data: employeesData, error: employeesError } = await localDb
          .from('employees')
          .select('*');

        if (employeesError) {
          console.error('Error fetching employees:', employeesError);
          throw employeesError;
        }

        // Fetch all departments for joining
        const { data: departmentsData, error: departmentsError } = await localDb
          .from('departments')
          .select('*');

        if (departmentsError) {
          console.error('Error fetching departments:', departmentsError);
          throw departmentsError;
        }

        // Join rewards with employees and departments
        const rewardsWithDetails = (rewardsData || []).map(reward => {
          const employee = employeesData.find(emp => emp.id === reward.employee_id) || null;

          // If employee has a department_id, fetch the department
          let department = null;
          if (employee && employee.department_id) {
            const dept = departmentsData.find(d => d.id === employee.department_id);
            if (dept) {
              department = {
                id: dept.id,
                name: dept.name
              };
            }
          }

          return {
            id: reward.id,
            type: (reward.type === 'reward' || reward.type === 'punishment') ? reward.type : 'reward',
            category: reward.reason || 'General',
            description: reward.reason || 'No description provided',
            amount: null, // Local DB doesn't have amount field
            date_awarded: reward.date || new Date().toISOString(),
            status: (reward.status === 'pending' || reward.status === 'approved' || reward.status === 'rejected') ? reward.status : 'pending',
            awarded_by: null, // Local DB doesn't have awarded_by field
            employee: employee ? {
              id: employee.id,
              name: employee.name || 'Unknown',
              position: employee.position || null,
              profile_image_url: employee.profile_image_url || null,
              department
            } : {
              id: 'unknown',
              name: 'Unknown',
              position: null,
              profile_image_url: null,
              department: null
            },
            incident: null // Local DB doesn't have incident relationship
          } as Reward;
        });

        return rewardsWithDetails;
      } catch (error) {
        console.error('Failed to fetch rewards:', error);
        return [];
      }
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      invalid: 'bg-red-100 text-red-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    if (!incident || !incident.employee) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      incident.employee.name?.toLowerCase().includes(searchLower) ||
      incident.description?.toLowerCase().includes(searchLower) ||
      incident.employee.department?.name?.toLowerCase().includes(searchLower)
    );
  });

  const filteredRewards = rewards.filter(reward => {
    if (!reward || !reward.employee) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      reward.employee.name?.toLowerCase().includes(searchLower) ||
      reward.category?.toLowerCase().includes(searchLower) ||
      reward.employee.department?.name?.toLowerCase().includes(searchLower)
    );
  });

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsIncidentDetailsOpen(true);
  };

  const handleViewReward = (reward: Reward) => {
    setSelectedReward(reward);
    setIsRewardDetailsOpen(true);
  };

  return (
    <DashboardLayout title="Rewards & Recognition" subtitle="Probus">
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Rewards & Recognition</h1>
          </div>

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search rewards or incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>

          <Tabs defaultValue="rewards" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Rewards & Punishments
              </TabsTrigger>
              <TabsTrigger value="incidents" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Incident Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rewards" className="mt-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Rewards & Punishments
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {rewardsLoading ? (
                    <div className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <Award className="h-6 w-6 text-blue-500 animate-spin" />
                      </div>
                      <p className="text-gray-600">Loading rewards and punishments...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date Awarded</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRewards.map((reward) => (
                            <TableRow key={reward.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={reward.employee?.profile_image_url || '/placeholder.svg'}
                                    alt={reward.employee?.name || 'Unknown'}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-medium">{reward.employee?.name || 'Unknown'}</p>
                                    <p className="text-sm text-gray-500">{reward.employee?.position || 'N/A'}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{reward.employee?.department?.name || 'No Department'}</TableCell>
                              <TableCell>
                                <Badge className={reward.type === 'reward' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                  {reward.type}
                                </Badge>
                              </TableCell>
                              <TableCell>{reward.category}</TableCell>
                              <TableCell>
                                {reward.amount ? `$${Number(reward.amount).toFixed(2)}` : 'N/A'}
                              </TableCell>
                              <TableCell>{formatDate(reward.date_awarded)}</TableCell>
                              <TableCell>
                                <Badge className={getStatusBadge(reward.status)}>
                                  {reward.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-green-500 text-green-500 hover:bg-green-50"
                                  onClick={() => handleViewReward(reward)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="incidents" className="mt-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Incident Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {incidentsLoading ? (
                    <div className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-amber-500 animate-spin" />
                      </div>
                      <p className="text-gray-600">Loading incident reports...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Incident Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date Reported</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredIncidents.map((incident) => (
                            <TableRow key={incident.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={incident.employee?.profile_image_url || '/placeholder.svg'}
                                    alt={incident.employee?.name || 'Unknown'}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-medium">{incident.employee?.name || 'Unknown'}</p>
                                    <p className="text-sm text-gray-500">{incident.employee?.position || 'N/A'}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{incident.employee?.department?.name || 'No Department'}</TableCell>
                              <TableCell>{incident.incident_type}</TableCell>
                              <TableCell className="max-w-xs truncate">{incident.description}</TableCell>
                              <TableCell>{formatDate(incident.date_reported)}</TableCell>
                              <TableCell>
                                <Badge className={getStatusBadge(incident.status)}>
                                  {incident.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                  onClick={() => handleViewIncident(incident)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Incident Details Dialog */}
      <Dialog open={isIncidentDetailsOpen} onOpenChange={setIsIncidentDetailsOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Incident Report Details</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {selectedIncident && (
              <IncidentDetails incident={selectedIncident} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reward Details Dialog */}
      <Dialog open={isRewardDetailsOpen} onOpenChange={setIsRewardDetailsOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Reward Details</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {selectedReward && (
              <RewardDetails reward={selectedReward} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Rewards;
