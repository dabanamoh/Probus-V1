
import React from 'react';
import { Label } from "../../../shared/ui/label";
import { Input } from "../../../shared/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";

interface AddressTabProps {
  formData: {
    country: string;
    city: string;
    street: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const AddressTab = ({ formData, onInputChange }: AddressTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="Country"
            value={formData.country}
            onChange={(e) => onInputChange('country', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="City"
            value={formData.city}
            onChange={(e) => onInputChange('city', e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            placeholder="Street address"
            value={formData.street}
            onChange={(e) => onInputChange('street', e.target.value)}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressTab;
