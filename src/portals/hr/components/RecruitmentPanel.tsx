import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db/client';
import { 
  UserPlus, 
  Calendar, 
  Users, 
  Briefcase, 
  Plus, 
  Search,
  Eye,
  Check,
  X,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Mail,
  Phone,
  FileText,
  Trash2,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Textarea } from "../../shared/ui/textarea";
import { Badge } from "../../shared/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../shared/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import { Label } from "../../shared/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary_range: string;
  description: string;
  requirements: string;
  status: 'active' | 'closed' | 'draft';
  posted_date: string;
  deadline: string;
  applicants_count?: number;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  applied_date: string;
  resume_url?: string;
  notes?: string;
}

const RecruitmentPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for job postings
  const mockJobs: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'New York, NY',
      type: 'full-time',
      salary_range: '$120,000 - $160,000',
      description: 'We are seeking an experienced software engineer to join our growing team.',
      requirements: 'Bachelor\'s degree in Computer Science, 5+ years of experience with React, Node.js',
      status: 'active',
      posted_date: '2024-11-01',
      deadline: '2024-12-15',
      applicants_count: 24
    },
    {
      id: '2',
      title: 'HR Specialist',
      department: 'Human Resources',
      location: 'Chicago, IL',
      type: 'full-time',
      salary_range: '$55,000 - $75,000',
      description: 'Join our HR team to help manage employee relations and recruitment.',
      requirements: 'Bachelor\'s degree in HR or related field, 2+ years experience',
      status: 'active',
      posted_date: '2024-11-10',
      deadline: '2024-12-20',
      applicants_count: 18
    },
    {
      id: '3',
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary_range: '$80,000 - $110,000',
      description: 'Lead our marketing initiatives and drive brand awareness.',
      requirements: '5+ years in marketing, strong leadership skills',
      status: 'active',
      posted_date: '2024-11-05',
      deadline: '2024-12-10',
      applicants_count: 31
    },
    {
      id: '4',
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'contract',
      salary_range: '$70,000 - $90,000',
      description: 'Create intuitive and beautiful user experiences for our products.',
      requirements: 'Portfolio required, 3+ years UX design experience',
      status: 'draft',
      posted_date: '2024-11-15',
      deadline: '2025-01-15',
      applicants_count: 5
    }
  ];

  const mockCandidates: Candidate[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      status: 'interview',
      applied_date: '2024-11-12',
      notes: 'Strong technical background, good cultural fit'
    },
    {
      id: '2',
      name: 'Bob Williams',
      email: 'bob.williams@email.com',
      phone: '+1 (555) 234-5678',
      position: 'HR Specialist',
      department: 'Human Resources',
      status: 'screening',
      applied_date: '2024-11-14'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      phone: '+1 (555) 345-6789',
      position: 'Marketing Manager',
      department: 'Marketing',
      status: 'offer',
      applied_date: '2024-11-08',
      notes: 'Excellent experience, ready to make offer'
    },
    {
      id: '4',
      name: 'David Chen',
      email: 'david.chen@email.com',
      phone: '+1 (555) 456-7890',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      status: 'new',
      applied_date: '2024-11-18'
    },
    {
      id: '5',
      name: 'Emma Martinez',
      email: 'emma.martinez@email.com',
      phone: '+1 (555) 567-8901',
      position: 'UX Designer',
      department: 'Design',
      status: 'rejected',
      applied_date: '2024-11-16',
      notes: 'Portfolio did not meet requirements'
    }
  ];

  const [jobFormData, setJobFormData] = useState<Partial<JobPosting>>({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    salary_range: '',
    description: '',
    requirements: '',
    status: 'draft',
    deadline: ''
  });

  const filteredJobs = mockJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCandidates = mockCandidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20';
      case 'draft': return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-600';
      case 'closed': return 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20';
      case 'new': return 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      case 'screening': return 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20';
      case 'interview': return 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
      case 'offer': return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20';
      case 'hired': return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20';
      case 'rejected': return 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-600';
    }
  };

  const handleCreateJob = () => {
    const toastDiv = document.createElement('div');
    const action = isEditMode ? 'updated' : 'created';
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #10b981;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#d1fae5;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 5L7.5 14.167L3.333 10" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#065f46;font-size:14px;">Job Posting ${action.charAt(0).toUpperCase() + action.slice(1)}</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">${jobFormData.title} has been ${action} successfully</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
    
    setIsJobDialogOpen(false);
    setIsEditMode(false);
    setSelectedJob(null);
    setJobFormData({
      title: '',
      department: '',
      location: '',
      type: 'full-time',
      salary_range: '',
      description: '',
      requirements: '',
      status: 'draft',
      deadline: ''
    });
  };

  const handleEditJob = (job: JobPosting) => {
    setIsEditMode(true);
    setSelectedJob(job);
    setJobFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      salary_range: job.salary_range,
      description: job.description,
      requirements: job.requirements,
      status: job.status,
      deadline: job.deadline
    });
    setIsJobDialogOpen(true);
  };

  const handleViewJob = (job: JobPosting) => {
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #3b82f6;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#dbeafe;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.5 10C2.5 10 5 4.167 10 4.167C15 4.167 17.5 10 17.5 10C17.5 10 15 15.833 10 15.833C5 15.833 2.5 10 2.5 10Z" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#1e3a8a;font-size:14px;">Viewing Job Details</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">${job.title}</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 2500);
  };

  const handleDeleteJob = (job: JobPosting) => {
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #ef4444;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#fee2e2;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5h15M8.333 8.333v5M11.667 8.333v5M3.333 5l.834 11.667c0 .442.175.866.488 1.178.312.313.736.489 1.178.489h8.334c.442 0 .866-.176 1.178-.489.313-.312.488-.736.488-1.178L16.667 5M7.5 5V3.333c0-.221.088-.433.244-.589.157-.156.369-.244.589-.244h3.334c.22 0 .432.088.588.244.157.156.245.368.245.589V5" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#991b1b;font-size:14px;">Job Posting Deleted</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">${job.title} removed successfully</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  const handleViewResume = (candidate: Candidate) => {
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #3b82f6;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#dbeafe;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.667 1.667H5c-.442 0-.866.175-1.179.488A1.667 1.667 0 003.333 3.333v13.334c0 .442.176.866.488 1.178.313.313.737.489 1.179.489h10c.442 0 .866-.176 1.178-.489.313-.312.489-.736.489-1.178V6.667l-5-5z" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.667 1.667v5h5M13.333 10.833h-6.666M13.333 14.167H7.5M8.333 7.5H7.5" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#1e3a8a;font-size:14px;">Opening Resume</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">${candidate.name}'s resume</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 2500);
  };

  const updateCandidateStatus = (candidateId: string, newStatus: Candidate['status']) => {
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:white;padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #3b82f6;z-index:9999;"><div style="display:flex;align-items:center;gap:12px;"><div style="background:#dbeafe;padding:8px;border-radius:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 5L7.5 14.167L3.333 10" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><p style="margin:0;font-weight:600;color:#1e3a8a;font-size:14px;">Status Updated</p><p style="margin:4px 0 0 0;color:#6b7280;font-size:12px;">Candidate status changed to ${newStatus}</p></div></div></div>`;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-blue-50/30 dark:bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-slate-100">Recruitment</h1>
            <p className="text-blue-700 dark:text-slate-400">Manage job postings, candidates, and hiring processes</p>
          </div>
          <Dialog open={isJobDialogOpen} onOpenChange={(open) => {
            setIsJobDialogOpen(open);
            if (!open) {
              setIsEditMode(false);
              setSelectedJob(null);
              setJobFormData({
                title: '',
                department: '',
                location: '',
                type: 'full-time',
                salary_range: '',
                description: '',
                requirements: '',
                status: 'draft',
                deadline: ''
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-slate-800 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle className="dark:text-slate-100">{isEditMode ? 'Edit Job Posting' : 'Create Job Posting'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="job-title" className="dark:text-slate-200">Job Title *</Label>
                  <Input
                    id="job-title"
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData({...jobFormData, title: e.target.value})}
                    placeholder="e.g. Senior Software Engineer"
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department" className="dark:text-slate-200">Department *</Label>
                    <Input
                      id="department"
                      value={jobFormData.department}
                      onChange={(e) => setJobFormData({...jobFormData, department: e.target.value})}
                      placeholder="e.g. Engineering"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="dark:text-slate-200">Location *</Label>
                    <Input
                      id="location"
                      value={jobFormData.location}
                      onChange={(e) => setJobFormData({...jobFormData, location: e.target.value})}
                      placeholder="e.g. New York, NY or Remote"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type" className="dark:text-slate-200">Employment Type *</Label>
                    <Select value={jobFormData.type} onValueChange={(value: any) => setJobFormData({...jobFormData, type: value})}>
                      <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
                        <SelectItem value="full-time" className="dark:text-slate-100">Full-time</SelectItem>
                        <SelectItem value="part-time" className="dark:text-slate-100">Part-time</SelectItem>
                        <SelectItem value="contract" className="dark:text-slate-100">Contract</SelectItem>
                        <SelectItem value="internship" className="dark:text-slate-100">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="salary" className="dark:text-slate-200">Salary Range</Label>
                    <Input
                      id="salary"
                      value={jobFormData.salary_range}
                      onChange={(e) => setJobFormData({...jobFormData, salary_range: e.target.value})}
                      placeholder="e.g. $80,000 - $120,000"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="deadline" className="dark:text-slate-200">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={jobFormData.deadline}
                    onChange={(e) => setJobFormData({...jobFormData, deadline: e.target.value})}
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="dark:text-slate-200">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData({...jobFormData, description: e.target.value})}
                    placeholder="Describe the role, responsibilities, and what makes it exciting..."
                    rows={4}
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  />
                </div>
                <div>
                  <Label htmlFor="requirements" className="dark:text-slate-200">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    value={jobFormData.requirements}
                    onChange={(e) => setJobFormData({...jobFormData, requirements: e.target.value})}
                    placeholder="List required skills, experience, education, certifications..."
                    rows={4}
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => {
                      setJobFormData({...jobFormData, status: 'active'});
                      handleCreateJob();
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    {isEditMode ? 'Update Job' : 'Post Job'}
                  </Button>
                  <Button 
                    onClick={() => {
                      setJobFormData({...jobFormData, status: 'draft'});
                      handleCreateJob();
                    }}
                    variant="outline"
                    className="flex-1 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Save as Draft
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-slate-400">Active Postings</p>
                <h3 className="text-3xl font-semibold text-blue-900 dark:text-slate-100 mt-2">
                  {mockJobs.filter(j => j.status === 'active').length}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl border border-blue-200">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-sky-700 dark:text-slate-400">Total Applicants</p>
                <h3 className="text-3xl font-semibold text-sky-900 dark:text-slate-100 mt-2">
                  {mockCandidates.length}
                </h3>
              </div>
              <div className="p-3 bg-sky-100 dark:bg-green-500/10 rounded-xl border border-sky-200">
                <Users className="w-6 h-6 text-sky-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-700 dark:text-slate-400">In Interview</p>
                <h3 className="text-3xl font-semibold text-indigo-900 dark:text-slate-100 mt-2">
                  {mockCandidates.filter(c => c.status === 'interview').length}
                </h3>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-purple-500/10 rounded-xl border border-indigo-200">
                <Calendar className="w-6 h-6 text-indigo-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-700 dark:text-slate-400">Offers Made</p>
                <h3 className="text-3xl font-semibold text-cyan-900 dark:text-slate-100 mt-2">
                  {mockCandidates.filter(c => c.status === 'offer').length}
                </h3>
              </div>
              <div className="p-3 bg-cyan-100 dark:bg-amber-500/10 rounded-xl border border-cyan-200">
                <UserPlus className="w-6 h-6 text-cyan-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="dark:bg-slate-800 dark:border-slate-700">
          <TabsTrigger value="overview" className="dark:data-[state=active]:bg-slate-700 dark:text-slate-300 dark:data-[state=active]:text-slate-100">Overview</TabsTrigger>
          <TabsTrigger value="jobs" className="dark:data-[state=active]:bg-slate-700 dark:text-slate-300 dark:data-[state=active]:text-slate-100">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates" className="dark:data-[state=active]:bg-slate-700 dark:text-slate-300 dark:data-[state=active]:text-slate-100">Candidates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Job Postings */}
            <Card className="border border-blue-200 bg-gradient-to-br from-blue-50/50 to-sky-50/50 dark:bg-slate-800 dark:border-slate-700">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50 dark:bg-transparent">
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-slate-100">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Recent Job Postings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockJobs.slice(0, 3).map(job => (
                    <div key={job.id} className="p-4 border border-blue-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow hover:bg-blue-50 dark:hover:bg-slate-700/50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-slate-100">{job.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-slate-400">{job.department}</p>
                        </div>
                        <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.applicants_count} applicants
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Candidates */}
            <Card className="border border-sky-200 bg-gradient-to-br from-sky-50/50 to-cyan-50/50 dark:bg-slate-800 dark:border-slate-700">
              <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50 dark:bg-transparent">
                <CardTitle className="flex items-center gap-2 text-sky-900 dark:text-slate-100">
                  <Users className="w-5 h-5 text-sky-600 dark:text-green-400" />
                  Recent Applicants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCandidates.slice(0, 3).map(candidate => (
                    <div key={candidate.id} className="p-4 border border-sky-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow hover:bg-sky-50 dark:hover:bg-slate-700/50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-slate-100">{candidate.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-slate-400">{candidate.position}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Applied: {new Date(candidate.applied_date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 dark:text-slate-500" />
              <Input
                placeholder="Search job postings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Job Postings List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map(job => (
              <Card key={job.id} className="border border-blue-200 bg-gradient-to-r from-blue-50/30 to-sky-50/30 dark:bg-slate-800 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="dark:text-slate-100">{job.title}</CardTitle>
                        <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary_range}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                        onClick={() => handleViewJob(job)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="dark:border-slate-600 dark:text-blue-400 dark:hover:bg-slate-700"
                        onClick={() => handleEditJob(job)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="dark:border-slate-600 dark:text-red-400 dark:hover:bg-slate-700"
                        onClick={() => handleDeleteJob(job)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-slate-300 mb-4">{job.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-500 dark:text-slate-400">
                      <span>Posted: {new Date(job.posted_date).toLocaleDateString()}</span>
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-gray-900 dark:text-slate-100">{job.applicants_count} applicants</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 dark:text-slate-500" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Candidates List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredCandidates.map(candidate => (
              <Card key={candidate.id} className="dark:bg-slate-800 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-lg">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{candidate.name}</h3>
                          <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-slate-400 mb-3">{candidate.position}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-slate-400">
                          <span className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {candidate.email}
                          </span>
                          <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {candidate.phone}
                          </span>
                          <span className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {candidate.department}
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Applied: {new Date(candidate.applied_date).toLocaleDateString()}
                          </span>
                        </div>
                        {candidate.notes && (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-slate-300">
                              <span className="font-medium">Notes: </span>
                              {candidate.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Select 
                        value={candidate.status} 
                        onValueChange={(value: Candidate['status']) => updateCandidateStatus(candidate.id, value)}
                      >
                        <SelectTrigger className="w-40 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
                          <SelectItem value="new" className="dark:text-slate-100">New</SelectItem>
                          <SelectItem value="screening" className="dark:text-slate-100">Screening</SelectItem>
                          <SelectItem value="interview" className="dark:text-slate-100">Interview</SelectItem>
                          <SelectItem value="offer" className="dark:text-slate-100">Offer</SelectItem>
                          <SelectItem value="hired" className="dark:text-slate-100">Hired</SelectItem>
                          <SelectItem value="rejected" className="dark:text-slate-100">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                        onClick={() => handleViewResume(candidate)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Resume
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruitmentPanel;
