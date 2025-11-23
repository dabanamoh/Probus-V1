import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { Textarea } from "../../../shared/ui/textarea";
import { Badge } from "../../../shared/ui/badge";
import { Label } from "../../../shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../../shared/ui/dialog";
import { FileText, Save, Eye, CheckCircle, XCircle, Calendar, User, AlertTriangle, Plus, Edit, Trash2, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Policy {
  id: string;
  title: string;
  category: string;
  content: string;
  version: string;
  status: 'draft' | 'pending_review' | 'published' | 'archived';
  effectiveDate: string;
  expiryDate?: string;
  requiresAcknowledgment: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  acknowledgedBy: string[];
  reviewedBy?: string;
  publishedBy?: string;
  publishedAt?: string;
}

interface PolicyEditorProps {
  userRole: 'admin' | 'hr' | 'manager' | 'employee';
  userId: string;
  userName: string;
}

const PolicyEditor = ({ userRole, userId, userName }: PolicyEditorProps) => {
  const { toast } = useToast();
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      title: 'Code of Conduct',
      category: 'ethics',
      content: 'Our company is committed to the highest standards of ethical behavior...',
      version: '2.1',
      status: 'published',
      effectiveDate: '2024-01-01',
      requiresAcknowledgment: true,
      createdBy: 'Admin User',
      createdAt: '2023-12-01',
      updatedAt: '2024-01-01',
      acknowledgedBy: [],
      publishedBy: 'Admin User',
      publishedAt: '2024-01-01'
    },
    {
      id: '2',
      title: 'Remote Work Policy',
      category: 'workplace',
      content: 'Guidelines for employees working from home...',
      version: '1.3',
      status: 'published',
      effectiveDate: '2024-03-15',
      requiresAcknowledgment: true,
      createdBy: 'HR Manager',
      createdAt: '2024-02-20',
      updatedAt: '2024-03-10',
      acknowledgedBy: [],
      publishedBy: 'Admin User',
      publishedAt: '2024-03-15'
    },
    {
      id: '3',
      title: 'Data Protection Policy - Draft',
      category: 'security',
      content: 'Guidelines for handling sensitive company and customer data...',
      version: '1.0-draft',
      status: 'draft',
      effectiveDate: '2024-12-01',
      requiresAcknowledgment: true,
      createdBy: 'HR Manager',
      createdAt: '2024-11-15',
      updatedAt: '2024-11-20',
      acknowledgedBy: []
    }
  ]);

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);
  const [editedPolicy, setEditedPolicy] = useState<Partial<Policy>>({});

  const categories = [
    { value: 'ethics', label: 'Code of Ethics & Conduct' },
    { value: 'security', label: 'Security & Data Protection' },
    { value: 'workplace', label: 'Workplace Policies' },
    { value: 'compliance', label: 'Regulatory Compliance' },
    { value: 'hr', label: 'HR Policies' },
    { value: 'safety', label: 'Health & Safety' },
    { value: 'it', label: 'IT & Technology Use' },
    { value: 'financial', label: 'Financial Policies' }
  ];

  const canEdit = userRole === 'admin' || userRole === 'hr';
  const canPublish = userRole === 'admin';
  const canDelete = userRole === 'admin';

  const getStatusBadge = (status: Policy['status']) => {
    const variants = {
      draft: { className: 'bg-gray-100 text-gray-800', icon: Edit },
      pending_review: { className: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      published: { className: 'bg-green-100 text-green-800', icon: CheckCircle },
      archived: { className: 'bg-red-100 text-red-800', icon: XCircle }
    };
    const config = variants[status];
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const handleCreateNew = () => {
    setEditedPolicy({
      title: '',
      category: 'ethics',
      content: '',
      version: '1.0',
      status: 'draft',
      effectiveDate: new Date().toISOString().split('T')[0],
      requiresAcknowledgment: true,
      createdBy: userName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      acknowledgedBy: []
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (isCreating) {
      const newPolicy: Policy = {
        ...editedPolicy,
        id: Date.now().toString(),
      } as Policy;
      setPolicies([...policies, newPolicy]);
      toast({
        title: "Policy Created",
        description: "New policy draft has been created successfully.",
      });
    } else if (selectedPolicy) {
      setPolicies(policies.map(p =>
        p.id === selectedPolicy.id
          ? { ...p, ...editedPolicy, updatedAt: new Date().toISOString() }
          : p
      ));
      toast({
        title: "Policy Updated",
        description: "Policy has been updated successfully.",
      });
    }
    setIsEditing(false);
    setIsCreating(false);
    setEditedPolicy({});
  };

  const handlePublish = (policy: Policy) => {
    if (!canPublish) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can publish policies.",
        variant: "destructive"
      });
      return;
    }

    setPolicies(policies.map(p =>
      p.id === policy.id
        ? {
            ...p,
            status: 'published',
            publishedBy: userName,
            publishedAt: new Date().toISOString(),
            version: incrementVersion(p.version)
          }
        : p
    ));

    toast({
      title: "Policy Published",
      description: `${policy.title} has been published and is now active.`,
    });
  };

  const handleArchive = (policy: Policy) => {
    setPolicies(policies.map(p =>
      p.id === policy.id ? { ...p, status: 'archived' } : p
    ));
    toast({
      title: "Policy Archived",
      description: `${policy.title} has been archived.`,
    });
  };

  const handleDelete = (policyId: string) => {
    if (!canDelete) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can delete policies.",
        variant: "destructive"
      });
      return;
    }

    setPolicies(policies.filter(p => p.id !== policyId));
    toast({
      title: "Policy Deleted",
      description: "Policy has been permanently deleted.",
    });
  };

  const incrementVersion = (version: string): string => {
    const parts = version.replace('-draft', '').split('.');
    parts[parts.length - 1] = (parseInt(parts[parts.length - 1]) + 1).toString();
    return parts.join('.');
  };

  const filteredPolicies = policies.filter(p => {
    if (userRole === 'admin') return true;
    if (userRole === 'hr') return p.status !== 'archived';
    return p.status === 'published';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Policy & Compliance Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create, manage, and publish company policies and compliance documents
          </p>
        </div>
        {canEdit && (
          <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New Policy
          </Button>
        )}
      </div>

      {/* Role Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          <User className="w-3 h-3 mr-1" />
          Role: {userRole.toUpperCase()}
        </Badge>
        {canEdit && <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Can Edit</Badge>}
        {canPublish && <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">Can Publish</Badge>}
        {canDelete && <Badge variant="outline" className="text-xs bg-red-50 text-red-700">Can Delete</Badge>}
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPolicies.map((policy) => (
          <Card key={policy.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2">
                    {policy.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {categories.find(c => c.value === policy.category)?.label}
                  </CardDescription>
                </div>
                {getStatusBadge(policy.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-3">{policy.content}</p>
              
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  v{policy.version}
                </div>
                <span>•</span>
                <div>Effective: {new Date(policy.effectiveDate).toLocaleDateString()}</div>
              </div>

              {policy.requiresAcknowledgment && (
                <Badge variant="outline" className="text-xs">Requires Acknowledgment</Badge>
              )}

              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedPolicy(policy)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between">
                        <span>{policy.title}</span>
                        {getStatusBadge(policy.status)}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-xs text-gray-500">Category</Label>
                          <p className="font-medium">{categories.find(c => c.value === policy.category)?.label}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Version</Label>
                          <p className="font-medium">{policy.version}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Effective Date</Label>
                          <p className="font-medium">{new Date(policy.effectiveDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Created By</Label>
                          <p className="font-medium">{policy.createdBy}</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-500">Content</Label>
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm">
                          {policy.content}
                        </div>
                      </div>

                      {policy.publishedAt && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                          <p className="text-green-800">
                            Published by {policy.publishedBy} on {new Date(policy.publishedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {canEdit && policy.status === 'draft' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedPolicy(policy);
                      setEditedPolicy(policy);
                      setIsEditing(true);
                      setIsCreating(false);
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}

                {canPublish && (policy.status === 'draft' || policy.status === 'pending_review') && (
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handlePublish(policy)}
                  >
                    <CheckCircle className="w-3 h-3" />
                  </Button>
                )}

                {canDelete && policy.status === 'draft' && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDelete(policy.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => {
        setIsEditing(open);
        if (!open) {
          setIsCreating(false);
          setEditedPolicy({});
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Create New Policy' : 'Edit Policy'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Policy Title *</Label>
                <Input
                  id="title"
                  value={editedPolicy.title || ''}
                  onChange={(e) => setEditedPolicy({ ...editedPolicy, title: e.target.value })}
                  placeholder="e.g., Code of Conduct"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={editedPolicy.category || 'ethics'}
                  onValueChange={(value) => setEditedPolicy({ ...editedPolicy, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={editedPolicy.version || '1.0'}
                  onChange={(e) => setEditedPolicy({ ...editedPolicy, version: e.target.value })}
                  placeholder="1.0"
                />
              </div>

              <div>
                <Label htmlFor="effectiveDate">Effective Date *</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={editedPolicy.effectiveDate || ''}
                  onChange={(e) => setEditedPolicy({ ...editedPolicy, effectiveDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={editedPolicy.expiryDate || ''}
                  onChange={(e) => setEditedPolicy({ ...editedPolicy, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content">Policy Content *</Label>
              <Textarea
                id="content"
                value={editedPolicy.content || ''}
                onChange={(e) => setEditedPolicy({ ...editedPolicy, content: e.target.value })}
                placeholder="Enter the full policy content here..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requiresAck"
                checked={editedPolicy.requiresAcknowledgment ?? true}
                onChange={(e) => setEditedPolicy({ ...editedPolicy, requiresAcknowledgment: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="requiresAck">Requires employee acknowledgment</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              setIsCreating(false);
              setEditedPolicy({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? 'Create Policy' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PolicyEditor;
