import React, { useState } from 'react';
import { 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Users, 
  Target,
  Clock,
  Filter,
  Eye,
  Share,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";

const ManagerReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedType, setSelectedType] = useState('all');
  const [activeTab, setActiveTab] = useState('generated');

  // Mock reports data
  const generatedReports = [
    {
      id: 'report-1',
      name: 'Team Performance Summary',
      type: 'Performance',
      period: 'November 2024',
      generatedDate: '2024-11-15',
      status: 'ready',
      size: '2.3 MB',
      format: 'PDF',
      description: 'Comprehensive team performance metrics and KPI analysis'
    },
    {
      id: 'report-2',
      name: 'Departmental Productivity Report',
      type: 'Productivity',
      period: 'Q4 2024',
      generatedDate: '2024-11-14',
      status: 'ready',
      size: '1.8 MB',
      format: 'Excel',
      description: 'Detailed productivity analysis across all team members'
    },
    {
      id: 'report-3',
      name: 'Employee Development Report',
      type: 'Development',
      period: 'November 2024',
      generatedDate: '2024-11-13',
      status: 'generating',
      size: '-',
      format: 'PDF',
      description: 'Skills development and training progress tracking'
    },
    {
      id: 'report-4',
      name: 'Team Attendance Analysis',
      type: 'Attendance',
      period: 'October 2024',
      generatedDate: '2024-11-01',
      status: 'ready',
      size: '956 KB',
      format: 'PDF',
      description: 'Time tracking and attendance patterns analysis'
    }
  ];

  const reportTemplates = [
    {
      id: 'template-1',
      name: 'Weekly Team Summary',
      type: 'Performance',
      description: 'Weekly overview of team performance metrics',
      frequency: 'Weekly',
      lastGenerated: '2024-11-15'
    },
    {
      id: 'template-2',
      name: 'Monthly KPI Dashboard',
      type: 'KPI',
      description: 'Monthly KPI tracking and trend analysis',
      frequency: 'Monthly',
      lastGenerated: '2024-11-01'
    },
    {
      id: 'template-3',
      name: 'Quarterly Review Report',
      type: 'Review',
      description: 'Comprehensive quarterly performance review',
      frequency: 'Quarterly',
      lastGenerated: '2024-10-01'
    },
    {
      id: 'template-4',
      name: 'Project Status Report',
      type: 'Project',
      description: 'Current project status and milestone tracking',
      frequency: 'Bi-weekly',
      lastGenerated: '2024-11-12'
    }
  ];

  const reportTypes = ['All', 'Performance', 'Productivity', 'Development', 'Attendance', 'KPI', 'Review', 'Project'];

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
      case 'productivity':
        return <BarChart3 className="w-4 h-4" />;
      case 'attendance':
        return <Clock className="w-4 h-4" />;
      case 'kpi':
        return <Target className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredReports = generatedReports.filter(report => {
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

  const handleGenerateFromTemplate = (templateId: string) => {
    console.log('Generate report from template:', templateId);
    // Implementation for generating report from template
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manager Reports</h1>
            <p className="text-gray-600">Generate and manage team performance and analytical reports</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="generated">Generated Reports</TabsTrigger>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
            <TabsTrigger value="analytics">Quick Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="generated" className="mt-6">
            {/* Reports Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Reports</p>
                      <p className="text-2xl font-bold text-gray-900">{generatedReports.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ready</p>
                      <p className="text-2xl font-bold text-green-600">
                        {generatedReports.filter(r => r.status === 'ready').length}
                      </p>
                    </div>
                    <Download className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {generatedReports.filter(r => r.period.includes('November')).length}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Templates</p>
                      <p className="text-2xl font-bold text-purple-600">{reportTemplates.length}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex gap-2">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Report Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map(type => (
                          <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current-month">This Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Generated Reports ({filteredReports.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Generated</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{report.name}</div>
                              <div className="text-sm text-gray-500">{report.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(report.type)}
                              <span>{report.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{report.period}</TableCell>
                          <TableCell>{new Date(report.generatedDate).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">{report.size}</span>
                              <div className="text-sm text-gray-500">{report.format}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewReport(report.id)}
                                disabled={report.status !== 'ready'}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadReport(report.id)}
                                disabled={report.status !== 'ready'}
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={report.status !== 'ready'}
                              >
                                <Share className="w-3 h-3" />
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

          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        <span>{template.name}</span>
                      </div>
                      <Badge variant="outline">{template.frequency}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">{template.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Last Generated:</span>
                        <span>{new Date(template.lastGenerated).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleGenerateFromTemplate(template.id)}
                          className="flex-1"
                        >
                          Generate Now
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Team Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600">+5% improvement from last month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Productivity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Current Quarter</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600">Exceeding target by 7%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Goal Achievement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Goals Met</span>
                      <span className="font-medium">8/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600">2 goals in progress</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagerReports;
