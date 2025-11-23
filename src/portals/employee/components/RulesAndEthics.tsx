import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button, buttonVariants } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { 
  Search, 
  FileText, 
  Download, 
  Eye,
  CheckCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';

interface Policy {
  id: string;
  title: string;
  category: string;
  version: string;
  lastUpdated: string;
  status: 'active' | 'pending' | 'archived';
  requiresAcknowledgment: boolean;
  acknowledged?: boolean;
  description: string;
}

const RulesAndEthics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const policies: Policy[] = [
    {
      id: '1',
      title: 'Code of Conduct',
      category: 'General',
      version: '2.1',
      lastUpdated: '2025-09-01',
      status: 'active',
      requiresAcknowledgment: true,
      acknowledged: true,
      description: 'Our core principles and expected behaviors for all employees.'
    },
    {
      id: '2',
      title: 'Data Privacy Policy',
      category: 'Compliance',
      version: '3.0',
      lastUpdated: '2025-08-15',
      status: 'active',
      requiresAcknowledgment: true,
      acknowledged: false,
      description: 'Guidelines for handling sensitive company and customer data.'
    },
    {
      id: '3',
      title: 'Remote Work Policy',
      category: 'Workplace',
      version: '1.5',
      lastUpdated: '2025-07-22',
      status: 'active',
      requiresAcknowledgment: false,
      description: 'Rules and best practices for remote work arrangements.'
    },
    {
      id: '4',
      title: 'Anti-Harassment Policy',
      category: 'HR',
      version: '4.2',
      lastUpdated: '2025-09-10',
      status: 'active',
      requiresAcknowledgment: true,
      acknowledged: true,
      description: 'Procedures for reporting and addressing harassment in the workplace.'
    },
    {
      id: '5',
      title: 'Information Security Policy',
      category: 'Compliance',
      version: '2.8',
      lastUpdated: '2025-08-30',
      status: 'active',
      requiresAcknowledgment: true,
      acknowledged: false,
      description: 'Security measures and protocols for protecting company assets.'
    },
    {
      id: '6',
      title: 'Social Media Guidelines',
      category: 'General',
      version: '1.3',
      lastUpdated: '2025-06-18',
      status: 'active',
      requiresAcknowledgment: false,
      description: 'Best practices for representing the company on social media platforms.'
    }
  ];

  const categories = ['all', 'General', 'Compliance', 'Workplace', 'HR'];

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = 
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || policy.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      default: return 'Archived';
    }
  };

  const handleAcknowledge = (id: string) => {
    // In a real app, this would send a request to the backend
    console.log(`Acknowledged policy ${id}`);
  };

  const handleViewPolicy = (id: string) => {
    // In a real app, this would open the policy document
    console.log(`Viewing policy ${id}`);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Rules & Ethics Center</h1>
        <p className="text-gray-600 text-sm md:text-base">Access company policies, code of conduct, and ethics guidelines</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-4 md:mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm md:text-base"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-xl md:text-2xl font-bold text-blue-600">{policies.length}</div>
            <div className="text-gray-600 text-xs md:text-sm">Total Policies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {policies.filter(p => p.acknowledged).length}
            </div>
            <div className="text-gray-600 text-xs md:text-sm">Acknowledged</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-xl md:text-2xl font-bold text-yellow-600">
              {policies.filter(p => !p.acknowledged && p.requiresAcknowledgment).length}
            </div>
            <div className="text-gray-600 text-xs md:text-sm">Pending Acknowledgment</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-xl md:text-2xl font-bold text-purple-600">
              {new Set(policies.map(p => p.category)).size}
            </div>
            <div className="text-gray-600 text-xs md:text-sm">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Policies List */}
      <div className="space-y-3 md:space-y-4">
        {filteredPolicies.map(policy => (
          <Card key={policy.id}>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-start">
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mt-1 mr-2 md:mr-3" />
                    <div>
                      <h3 className="font-semibold text-base md:text-lg flex flex-wrap items-center gap-2">
                        {policy.title}
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          v{policy.version}
                        </span>
                      </h3>
                      <p className="text-gray-600 text-xs md:text-sm mt-1">{policy.description}</p>
                      <div className="flex flex-wrap items-center mt-2 text-xs">
                        <span className="mr-3 text-gray-500">
                          Category: <span className="font-medium">{policy.category}</span>
                        </span>
                        <span className="mr-3 text-gray-500">
                          Updated: <span className="font-medium">{policy.lastUpdated}</span>
                        </span>
                        <span className="flex items-center text-gray-500">
                          Status: 
                          <span className="font-medium ml-1 flex items-center">
                            {getStatusIcon(policy.status)}
                            <span className="ml-1">{getStatusText(policy.status)}</span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewPolicy(policy.id)}
                    className="text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  {policy.requiresAcknowledgment && !policy.acknowledged && (
                    <Button 
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-xs"
                      onClick={() => handleAcknowledge(policy.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                  {policy.requiresAcknowledgment && policy.acknowledged && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled
                      className="text-xs"
                    >
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      Acknowledged
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Reminder */}
      <Card className="mt-6 md:mt-8 border-blue-200 border-2">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mt-1 mr-2 md:mr-3" />
            <div>
              <h3 className="font-semibold text-base md:text-lg text-blue-800">Compliance Reminder</h3>
              <p className="text-blue-700 text-xs md:text-sm mt-1">
                Regular review of company policies is required for all employees. 
                Please ensure you acknowledge all policies that require your attention.
              </p>
              <Button className="mt-3 bg-blue-500 hover:bg-blue-600 text-sm">
                View Required Acknowledgments
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RulesAndEthics;
