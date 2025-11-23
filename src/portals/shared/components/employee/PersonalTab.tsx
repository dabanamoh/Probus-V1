
import React from 'react';
import { Label } from "../../../shared/ui/label";
import { Input } from "../../../shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shared/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";

interface PersonalTabProps {
  formData: {
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    emailAddress: string;
    phoneNumber: string;
    userRole: string;
    level: string;
    nationality: string;
    religion: string;
    sex: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PersonalTab = ({ formData, onInputChange }: PersonalTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            placeholder="Middle name"
            value={formData.middleName}
            onChange={(e) => onInputChange('middleName', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="emailAddress">Email Address</Label>
          <Input
            id="emailAddress"
            type="email"
            placeholder="Email address"
            value={formData.emailAddress}
            onChange={(e) => onInputChange('emailAddress', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            placeholder="Phone number"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="userRole">User Role</Label>
          <Select value={formData.userRole} onValueChange={(value) => onInputChange('userRole', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="level">Level</Label>
          <Select value={formData.level} onValueChange={(value) => onInputChange('level', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L7">L7</SelectItem>
              <SelectItem value="L8">L8</SelectItem>
              <SelectItem value="L9">L9</SelectItem>
              <SelectItem value="L10">L10</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            placeholder="Nationality"
            value={formData.nationality}
            onChange={(e) => onInputChange('nationality', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="religion">Religion</Label>
          <Input
            id="religion"
            placeholder="Religion"
            value={formData.religion}
            onChange={(e) => onInputChange('religion', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="sex">Sex</Label>
          <Select value={formData.sex} onValueChange={(value) => onInputChange('sex', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalTab;
