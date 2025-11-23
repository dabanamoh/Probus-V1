import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  Clock,
  User,
  TrendingUp,
  Eye,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/table";

const PersonalReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedType, setSelectedType] = useState('all');

  // Mock personal reports data
  const personalReports = [
    {
      id: 'PR001',
      name: 'My Monthly Performance Report',
      type: 'Performance',
      period: 'November 2024',
      generatedDate: '2024-11-15',
      status: 'ready',
      size: '856 KB',
      format: 'PDF',
      description: 'Personal performance metrics and KPI summary'
    },
    {
      id: 'PR002',
      name: 'My Attendance Report',
      type: 'Attendance',
      period: 'Q4 2024',
      generatedDate: '2024-11-14',
      status: 'ready',
      size: '245 KB',
      format: 'Excel',
      description: 'Time tracking and attendance history'
    },
    {
      id: 'PR003',
      name: 'My Task Completion Report',
      type: 'Productivity',
      period: 'November 2024',
      generatedDate: '2024-11-13',
      status: 'ready',
      size: '432 KB',
      format: 'PDF',
      description: 'Tasks completed and productivity analysis'
    },
    {
      id: 'PR004',
      name: 'My Annual Review Summary',
      type: 'Review',
      period: '2024',
      generatedDate: '2024-10-30',
      status: 'ready',
      size: '1.2 MB',
      format: 'PDF',
      description: 'Annual performance review and goal achievement'
    }
  ];

  const reportTypes = ['All', 'Performance', 'Attendance', 'Productivity', 'Review'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-800">Generating</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'performance':
        return <TrendingUp className="w-4 h-4" />;
      case 'attendance':
        return <Clock className="w-4 h-4" />;
      case 'productivity':
        return <BarChart3 className="w-4 h-4" />;
      case 'review':
        return <User className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredReports = personalReports.filter(report => {
    const matchesType = selectedType === 'all' || report.type.toLowerCase() === selectedType.toLowerCase();
    return matchesType;
  });

  const handleDownloadReport = (reportId: string) => {
    console.log('Download report:', reportId);
    // Implementation for downloading report
  };

  const handleViewReport = (reportId: string) => {
    console.log('View report:', reportId);
    // Implementation for viewing report
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Personal Reports</h1>
            <p className="text-gray-600">Access your personal performance and activity reports</p>
          </div>
          <Button size="sm" variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Request Custom Report
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{personalReports.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-green-600">
                    {personalReports.filter(r => r.period.includes('November 2024')).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Performance Reports</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {personalReports.filter(r => r.type === 'Performance').length}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Size</p>
                  <p className="text-2xl font-bold text-indigo-600">2.7 MB</p>
                </div>
                <Download className="w-8 h-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type.toLowerCase()} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="current-year">Current Year</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(report.type)}
                          <span className="font-medium">{report.name}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{report.type}</span>
                    </TableCell>
                    <TableCell>{report.period}</TableCell>
                    <TableCell>
                      {getStatusBadge(report.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(report.generatedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{report.size}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewReport(report.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredReports.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters or request a custom report.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalReports;
