
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface ResignationRequestFormProps {
  onClose: () => void;
}

const ResignationRequestForm = ({ onClose }: ResignationRequestFormProps) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    request_type: '',
    description: '',
    request_date: new Date().toISOString().split('T')[0],
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees } = useQuery({
    queryKey: ['employees-for-resignation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, position, date_of_resumption')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      let documentsUrl = null;
      
      if (uploadedFile) {
        setIsUploading(true);
        const fileExt = uploadedFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resignation-documents')
          .upload(fileName, uploadedFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('resignation-documents')
          .getPublicUrl(fileName);
          
        documentsUrl = publicUrl;
        setIsUploading(false);
      }

      const { error } = await supabase
        .from('resignations_terminations')
        .insert({
          ...data,
          documents_url: documentsUrl,
          status: 'pending',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resignations'] });
      toast({
        title: "Request Created",
        description: "Resignation/termination request has been created successfully.",
      });
      onClose();
    },
    onError: () => {
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to create resignation/termination request.",
        variant: "destructive",
      });
    },
  });

  const calculateYearsOfService = (employeeId: string) => {
    const employee = employees?.find(emp => emp.id === employeeId);
    if (!employee?.date_of_resumption) return 0;
    
    const startDate = new Date(employee.date_of_resumption);
    const currentDate = new Date();
    const yearsDiff = currentDate.getFullYear() - startDate.getFullYear();
    
    return yearsDiff;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employee_id || !formData.request_type || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const yearsOfService = calculateYearsOfService(formData.employee_id);
    
    createRequestMutation.mutate({
      ...formData,
      years_of_service: yearsOfService,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="space-y-6 mt-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="employee">Employee *</Label>
          <Select 
            value={formData.employee_id} 
            onValueChange={(value) => setFormData({...formData, employee_id: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees?.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name} - {employee.position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="request_type">Request Type *</Label>
          <Select 
            value={formData.request_type} 
            onValueChange={(value) => setFormData({...formData, request_type: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select request type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="resignation">Resignation</SelectItem>
              <SelectItem value="termination">Termination</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="request_date">Request Date</Label>
          <Input
            type="date"
            value={formData.request_date}
            onChange={(e) => setFormData({...formData, request_date: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            placeholder="Provide details about the resignation/termination request..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="documents">Supporting Documents</Label>
          <div className="mt-2">
            {!uploadedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload documents
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      PDF, DOC, DOCX up to 10MB
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createRequestMutation.isPending || isUploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createRequestMutation.isPending || isUploading ? 'Creating...' : 'Create Request'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResignationRequestForm;
