
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/ui/select";

type AppRole = 'admin' | 'director' | 'hr' | 'manager' | 'supervisor' | 'employee' | string; // string for custom roles

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
        <SelectItem value="director">Director</SelectItem>
        <SelectItem value="hr">HR</SelectItem>
        <SelectItem value="manager">Manager</SelectItem>
        <SelectItem value="supervisor">Supervisor</SelectItem>
        <SelectItem value="employee">Employee</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSelector;
