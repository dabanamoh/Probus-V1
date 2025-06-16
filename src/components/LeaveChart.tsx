
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface LeaveChartProps {
  employeeId: string;
}

const LeaveChart = ({ employeeId }: LeaveChartProps) => {
  const { data: employee } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          department:departments(id, name)
        `)
        .eq('id', employeeId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: leaveHistory = [] } = useQuery({
    queryKey: ['leave_history', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Process data for charts
  const monthlyData = React.useMemo(() => {
    const months = {};
    leaveHistory.forEach(leave => {
      const month = new Date(leave.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!months[month]) {
        months[month] = { month, days: 0, requests: 0 };
      }
      months[month].days += leave.days_requested;
      months[month].requests += 1;
    });
    return Object.values(months).slice(-12); // Last 12 months
  }, [leaveHistory]);

  const leaveTypeData = React.useMemo(() => {
    const types = {};
    leaveHistory.forEach(leave => {
      if (!types[leave.leave_type]) {
        types[leave.leave_type] = { name: leave.leave_type, value: 0 };
      }
      types[leave.leave_type].value += leave.days_requested;
    });
    return Object.values(types);
  }, [leaveHistory]);

  const statusData = React.useMemo(() => {
    const statuses = {};
    leaveHistory.forEach(leave => {
      if (!statuses[leave.status]) {
        statuses[leave.status] = { name: leave.status, value: 0 };
      }
      statuses[leave.status].value += 1;
    });
    return Object.values(statuses);
  }, [leaveHistory]);

  const totalDays = leaveHistory.reduce((sum, leave) => sum + leave.days_requested, 0);
  const approvedDays = leaveHistory
    .filter(leave => leave.status === 'approved')
    .reduce((sum, leave) => sum + leave.days_requested, 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const chartConfig = {
    days: {
      label: "Days",
      color: "#2563eb",
    },
    requests: {
      label: "Requests",
      color: "#dc2626",
    },
  };

  return (
    <div className="space-y-6">
      {employee && (
        <div className="text-center pb-4 border-b">
          <h3 className="text-xl font-semibold">{employee.name}</h3>
          <p className="text-gray-600">{employee.position} • {employee.department?.name || 'No Department'}</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{leaveHistory.length}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalDays}</div>
            <div className="text-sm text-gray-600">Total Days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{approvedDays}</div>
            <div className="text-sm text-gray-600">Approved Days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((approvedDays / totalDays) * 100) || 0}%
            </div>
            <div className="text-sm text-gray-600">Approval Rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Leave Pattern */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Leave Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="days" fill="#2563eb" name="Days" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Leave Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leaveTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {leaveTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {leaveHistory.slice(0, 8).map((leave) => (
                <div key={leave.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-sm">{leave.leave_type}</div>
                    <div className="text-xs text-gray-600">
                      {new Date(leave.start_date).toLocaleDateString()} - {leave.days_requested} days
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                    leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {leave.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaveChart;
