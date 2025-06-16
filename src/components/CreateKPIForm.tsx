
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  category: z.string().min(1, 'KPI Category is required'),
  target: z.number().min(1, 'Target must be at least 1').max(100, 'Target cannot exceed 100'),
  description: z.string().optional(),
  scoring_criteria: z.string().min(1, 'Scoring criteria is required'),
});

interface CreateKPIFormProps {
  onClose: () => void;
}

const CreateKPIForm = ({ onClose }: CreateKPIFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      target: 80,
      description: '',
      scoring_criteria: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    console.log('Creating KPI with values:', values);
    
    try {
      // TODO: Replace with actual Supabase mutation when database is set up
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "KPI Created",
        description: "New KPI has been created successfully.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create KPI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scoringOptions = [
    { value: 'percentage', label: 'Percentage (0-100%)' },
    { value: 'numeric', label: 'Numeric Score' },
    { value: 'rating', label: 'Rating Scale (1-5)' },
    { value: 'binary', label: 'Pass/Fail' },
  ];

  return (
    <div className="mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>KPI Category *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Supplier Value, Price Negotiation" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target (%) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="80"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a brief description of this KPI..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scoring_criteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scoring Method *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scoring method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {scoringOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Performance Scale Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Performance Scale</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>• <span className="font-medium text-red-700">0-20%:</span> Poor performance</div>
              <div>• <span className="font-medium text-orange-700">21-40%:</span> Below average</div>
              <div>• <span className="font-medium text-yellow-700">41-60%:</span> Meets expectations</div>
              <div>• <span className="font-medium text-blue-700">61-80%:</span> Good performance</div>
              <div>• <span className="font-medium text-green-700">81-100%:</span> Outstanding</div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create KPI'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateKPIForm;
