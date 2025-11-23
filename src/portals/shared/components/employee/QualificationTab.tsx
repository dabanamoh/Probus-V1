
import React from 'react';
import { Label } from "../../../shared/ui/label";
import { Input } from "../../../shared/ui/input";
import { Textarea } from "../../../shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";

interface QualificationTabProps {
  formData: {
    qualification: string;
    certifications: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const QualificationTab = ({ formData, onInputChange }: QualificationTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Educational Qualification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="qualification">Highest Qualification</Label>
          <Input
            id="qualification"
            placeholder="Qualification"
            value={formData.qualification}
            onChange={(e) => onInputChange('qualification', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="certifications">Certifications</Label>
          <Textarea
            id="certifications"
            placeholder="Certifications (separate with commas)"
            value={formData.certifications}
            onChange={(e) => onInputChange('certifications', e.target.value)}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QualificationTab;
