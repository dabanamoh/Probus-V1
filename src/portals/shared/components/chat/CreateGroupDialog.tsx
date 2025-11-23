import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Employee } from '@/types/chat';

interface CreateGroupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employees: Employee[];
    onCreateGroup: (name: string, memberIds: string[]) => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
    open,
    onOpenChange,
    employees,
    onCreateGroup
}) => {
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

    const handleCreate = () => {
        onCreateGroup(newGroupName, selectedEmployees);
        setNewGroupName('');
        setSelectedEmployees([]);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="groupName">Group Name</Label>
                        <Input
                            id="groupName"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="Enter group name"
                        />
                    </div>
                    <div>
                        <Label>Select Members</Label>
                        <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-2">
                            {employees.map(employee => (
                                <div key={employee.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`group-employee-${employee.id}`}
                                        checked={selectedEmployees.includes(employee.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedEmployees([...selectedEmployees, employee.id]);
                                            } else {
                                                setSelectedEmployees(selectedEmployees.filter(id => id !== employee.id));
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`group-employee-${employee.id}`} className="flex items-center gap-2 cursor-pointer w-full">
                                        <Avatar className="w-6 h-6">
                                            <AvatarFallback className="bg-[#E6F3FF] text-[#0095FF] text-xs">
                                                {employee.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{employee.name}</span>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={!newGroupName.trim() || selectedEmployees.length === 0}
                            className="bg-[#0095FF] hover:bg-[#0080E6] text-white"
                        >
                            Create Group
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGroupDialog;
