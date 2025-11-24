import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Search,
  User,
  Users,
  Building2,
  Mail,
  Phone,
  CheckCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";

export interface Manager {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  employeeCount?: number;
}

interface ManagerAssignmentProps {
  onAssign: (manager: Manager) => void;
  currentManager?: Manager | null;
  employeeName?: string;
}

const ManagerAssignment: React.FC<ManagerAssignmentProps> = ({
  onAssign,
  currentManager,
  employeeName = "this employee"
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Mock managers data - in a real app, this would come from an API
  const managers: Manager[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      position: 'Engineering Manager',
      employeeCount: 8
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Sales',
      position: 'Sales Manager',
      employeeCount: 12
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Marketing',
      position: 'Marketing Manager',
      employeeCount: 6
    },
    {
      id: '4',
      name: 'David Williams',
      email: 'david.williams@company.com',
      phone: '+1 (555) 456-7890',
      department: 'HR',
      position: 'HR Manager',
      employeeCount: 4
    },
    {
      id: '5',
      name: 'Jennifer Taylor',
      email: 'jennifer.taylor@company.com',
      phone: '+1 (555) 567-8901',
      department: 'Finance',
      position: 'Finance Manager',
      employeeCount: 5
    }
  ];

  const filteredManagers = managers.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = (manager: Manager) => {
    onAssign(manager);
    setIsOpen(false);
    toast({
      title: "Manager Assigned",
      description: `${manager.name} has been assigned as the manager for ${employeeName}`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="space-y-2">
          <Label>Reporting Manager</Label>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full justify-start text-left font-normal"
          >
            {currentManager ? (
              <div className="flex items-center gap-2 w-full">
                <User className="w-4 h-4 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{currentManager.name}</p>
                  <p className="text-xs text-gray-500">{currentManager.department}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <Users className="w-4 h-4" />
                <span>Select Manager</span>
              </div>
            )}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Manager</DialogTitle>
          <DialogDescription>
            Select a manager to supervise {employeeName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, department, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Managers List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredManagers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No managers found</p>
              </div>
            ) : (
              filteredManagers.map((manager) => (
                <Card
                  key={manager.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    currentManager?.id === manager.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleAssign(manager)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              {manager.name}
                              {currentManager?.id === manager.id && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">{manager.position}</p>
                          </div>
                          <Badge variant="secondary">
                            {manager.employeeCount || 0} employees
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 className="w-3 h-3" />
                            <span>{manager.department}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{manager.email}</span>
                          </div>
                          {manager.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{manager.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManagerAssignment;
