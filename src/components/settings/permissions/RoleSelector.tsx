
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AppRole = 'admin' | 'manager' | 'hr' | 'employee';

interface RoleSelectorProps {
  selectedRole: AppRole;
  onRoleChange: (role: AppRole) => void;
}

const RoleSelector = ({ selectedRole, onRoleChange }: RoleSelectorProps) => {
  return (
    <Select value={selectedRole} onValueChange={(value: AppRole) => onRoleChange(value)}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="manager">Manager</SelectItem>
        <SelectItem value="hr">HR</SelectItem>
        <SelectItem value="employee">Employee</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSelector;
