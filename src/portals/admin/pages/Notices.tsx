import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db';
import { Input } from "../../shared/ui/input";
import { Button } from "../../shared/ui/button";
import { Textarea } from "../../shared/ui/textarea";
import { Search, Plus, Bell } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shared/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../shared/ui/dialog";
import { Badge } from "../../shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Label } from "../../shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shared/ui/select";
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';

interface Notice {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  recipient_id: string;
  sender_id: string | null;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  profile_image_url: string;
}

const Notices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    recipient: 'all'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notices (using notifications table)
  const { data: notices, isLoading: noticesLoading } = useQuery({
    queryKey: ['notices', searchTerm],
    queryFn: async () => {
      let query = localDb
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as Notice[];
    },
  });

  // Fetch employees for recipient selection
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await localDb
        .from('employees')
        .select('id, name, position, profile_image_url');
      if (error) throw error;
      return data as Employee[];
    },
  });

  // Create notice mutation
  const createNoticeMutation = useMutation({
    mutationFn: async (noticeData: typeof formData) => {
      if (noticeData.recipient === 'all') {
        // Send to all employees
        const employeeIds = employees?.map(emp => emp.id) || [];
        const notices = employeeIds.map(empId => ({
          title: noticeData.title,
          message: noticeData.message,
          type: noticeData.type,
          user_id: empId
        }));

        const { data, error } = await localDb
          .from('notifications')
          .insert(notices);

        if (error) throw error;
        return data;
      } else {
        // Send to specific employee
        const { data, error } = await localDb
          .from('notifications')
          .insert([{
            title: noticeData.title,
            message: noticeData.message,
            type: noticeData.type,
            user_id: noticeData.recipient
          }]);

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      toast({
        title: "Success",
        description: "Notice sent successfully",
      });
      setIsCreateOpen(false);
      setFormData({ title: '', message: '', type: 'general', recipient: 'all' });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send notice",
        variant: "destructive",
      });
      console.error('Error creating notice:', error);
    },
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    createNoticeMutation.mutate(formData);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'destructive';
      case 'announcement':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <DashboardLayout title="Notices & Announcements" subtitle="Probus">
      <div className="space-y-6">
        <div className="mb-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Notices & Announcements</h1>
          </div>

          {/* Search and Action Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
              <Input
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Notice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Notice</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateNotice} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Notice title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Notice message"
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="recipient">Send To</Label>
                    <Select
                      value={formData.recipient}
                      onValueChange={(value) => setFormData({ ...formData, recipient: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        {employees?.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} - {employee.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createNoticeMutation.isPending} className="bg-blue-500 hover:bg-blue-600 text-white">
                      {createNoticeMutation.isPending ? 'Sending...' : 'Send Notice'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Notices Table */}
          <div>
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Sent Notices
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Title</TableHead>
                        <TableHead className="font-semibold text-gray-700">Type</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Date Sent</TableHead>
                        <TableHead className="font-semibold text-gray-700">Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {noticesLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Loading notices...
                          </TableCell>
                        </TableRow>
                      ) : notices && notices.length > 0 ? (
                        notices.map((notice) => (
                          <TableRow key={notice.id}>
                            <TableCell className="font-medium text-gray-900">
                              {notice.title}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getTypeBadge(notice.type)}>
                                {notice.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={notice.is_read ? 'default' : 'secondary'}>
                                {notice.is_read ? 'Read' : 'Unread'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-700">
                              {formatDate(notice.created_at)}
                            </TableCell>
                            <TableCell className="text-gray-700 max-w-xs truncate">
                              {notice.message}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No notices found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notices;
