
import React from 'react';
import { Label } from "../../../shared/ui/label";
import { Input } from "../../../shared/ui/input";
import { Textarea } from "../../../shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shared/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";

interface Department {
  id: string;
  name: string;
}

interface WorkTabProps {
  formData: {
    departmentId: string;
    dateOfResumption: string;
    jobDescription: string;
  };
  departments?: Department[];
  onInputChange: (field: string, value: string) => void;
}

const WorkTab = ({ formData, departments, onInputChange }: WorkTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="department">Department</Label>
          <Select value={formData.departmentId} onValueChange={(value) => onInputChange('departmentId', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Department</SelectItem>
              {departments?.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dateOfResumption">Date of Resumption</Label>
          <Input
            id="dateOfResumption"
            type="date"
            value={formData.dateOfResumption}
            onChange={(e) => onInputChange('dateOfResumption', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="jobDescription">Job Description</Label>
          <Textarea
            id="jobDescription"
            placeholder="Job description"
            value={formData.jobDescription}
            onChange={(e) => onInputChange('jobDescription', e.target.value)}
            className="mt-1 min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkTab;
