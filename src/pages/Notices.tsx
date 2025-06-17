
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Bell, Calendar, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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
      let query = supabase
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
      const { data, error } = await supabase
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
          recipient_id: empId,
          sender_id: null // admin
        }));

        const { data, error } = await supabase
          .from('notifications')
          .insert(notices)
          .select();
        
        if (error) throw error;
        return data;
      } else {
        // Send to specific employee
        const { data, error } = await supabase
          .from('notifications')
          .insert([{
            title: noticeData.title,
            message: noticeData.message,
            type: noticeData.type,
            recipient_id: noticeData.recipient,
            sender_id: null // admin
          }])
          .select();
        
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

  const totalNotices = notices?.length || 0;
  const unreadNotices = notices?.filter(n => !n.is_read).length || 0;

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Notice Management</h1>
              <p className="text-gray-600">Send and manage notices to employees</p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
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
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createNoticeMutation.isPending}>
                      {createNoticeMutation.isPending ? 'Sending...' : 'Send Notice'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notices</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNotices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Notices</CardTitle>
              <Bell className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadNotices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Notices Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Sent Notices
            </h2>
          </div>
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
      </div>
    </div>
  );
};

export default Notices;
