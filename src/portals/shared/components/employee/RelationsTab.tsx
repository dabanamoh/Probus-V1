
import React from 'react';
import { Label } from "../../../shared/ui/label";
import { Input } from "../../../shared/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";

interface RelationsTabProps {
  formData: {
    nextOfKin: string;
    nextOfKinEmail: string;
    emergencyContact: string;
    emergencyContactEmail: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const RelationsTab = ({ formData, onInputChange }: RelationsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="nextOfKin">Next of Kin</Label>
          <Input
            id="nextOfKin"
            placeholder="Next of kin name"
            value={formData.nextOfKin}
            onChange={(e) => onInputChange('nextOfKin', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nextOfKinEmail">Next of Kin Email</Label>
          <Input
            id="nextOfKinEmail"
            type="email"
            placeholder="Next of kin email"
            value={formData.nextOfKinEmail}
            onChange={(e) => onInputChange('nextOfKinEmail', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input
            id="emergencyContact"
            placeholder="Emergency contact name"
            value={formData.emergencyContact}
            onChange={(e) => onInputChange('emergencyContact', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="emergencyContactEmail">Emergency Contact Email</Label>
          <Input
            id="emergencyContactEmail"
            type="email"
            placeholder="Emergency contact email"
            value={formData.emergencyContactEmail}
            onChange={(e) => onInputChange('emergencyContactEmail', e.target.value)}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RelationsTab;
