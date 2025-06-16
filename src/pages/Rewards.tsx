
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Award, AlertTriangle, Eye, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import IncidentDetails from '@/components/IncidentDetails';
import RewardDetails from '@/components/RewardDetails';

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
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          id,
          incident_type,
          description,
          date_reported,
          location,
          status,
          employee:employees!incidents_reporter_id_fkey(
            id,
            name,
            position,
            profile_image_url,
            department:departments!employees_department_id_fkey(
              id,
              name
            )
          )
        `)
        .order('date_reported', { ascending: false });

      if (error) throw error;
      return data as Incident[];
    },
  });

  // Fetch rewards with employee and incident data
  const { data: rewards = [], isLoading: rewardsLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards_punishments')
        .select(`
          id,
          type,
          category,
          description,
          amount,
          date_awarded,
          status,
          awarded_by,
          employee:employees!rewards_punishments_employee_id_fkey(
            id,
            name,
            position,
            profile_image_url,
            department:departments!employees_department_id_fkey(
              id,
              name
            )
          ),
          incident:incidents!rewards_punishments_incident_id_fkey(
            id,
            description
          )
        `)
        .order('date_awarded', { ascending: false });

      if (error) throw error;
      return data as Reward[];
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredIncidents = incidents.filter(incident =>
    incident.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.employee?.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRewards = rewards.filter(reward =>
    reward.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reward.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reward.employee?.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsIncidentDetailsOpen(true);
  };

  const handleViewReward = (reward: Reward) => {
    setSelectedReward(reward);
    setIsRewardDetailsOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Rewards & Punishment</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search employees, departments, or incidents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            <p className="text-gray-600">
              Track employee rewards for whistleblowing, incident reporting, and integrity maintenance
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{incidents.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {incidents.filter(i => i.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Rewards</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rewards.filter(r => r.type === 'reward').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved Rewards</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rewards.filter(r => r.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different views */}
          <Tabs defaultValue="incidents" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="incidents">Incident Reports</TabsTrigger>
              <TabsTrigger value="rewards">Rewards & Recognition</TabsTrigger>
            </TabsList>

            {/* Incidents Tab */}
            <TabsContent value="incidents">
              <Card>
                <CardHeader>
                  <CardTitle>Incident Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  {incidentsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reporter</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Incident Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Date</TableHead>
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
                                  alt={incident.employee?.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-medium">{incident.employee?.name}</p>
                                  <p className="text-sm text-gray-500">{incident.employee?.position}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{incident.employee?.department?.name || 'No Department'}</TableCell>
                            <TableCell className="capitalize">{incident.incident_type}</TableCell>
                            <TableCell>
                              <p className="truncate max-w-xs">{incident.description}</p>
                            </TableCell>
                            <TableCell>{incident.location || 'N/A'}</TableCell>
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards">
              <Card>
                <CardHeader>
                  <CardTitle>Rewards & Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  {rewardsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
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
                                  alt={reward.employee?.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-medium">{reward.employee?.name}</p>
                                  <p className="text-sm text-gray-500">{reward.employee?.position}</p>
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
                              {reward.amount ? `$${reward.amount.toFixed(2)}` : 'N/A'}
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Incident Details Dialog */}
      <Dialog open={isIncidentDetailsOpen} onOpenChange={setIsIncidentDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Incident Report Details</DialogTitle>
          </DialogHeader>
          {selectedIncident && (
            <IncidentDetails incident={selectedIncident} />
          )}
        </DialogContent>
      </Dialog>

      {/* Reward Details Dialog */}
      <Dialog open={isRewardDetailsOpen} onOpenChange={setIsRewardDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reward Details</DialogTitle>
          </DialogHeader>
          {selectedReward && (
            <RewardDetails reward={selectedReward} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rewards;
