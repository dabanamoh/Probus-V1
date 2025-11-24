import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Badge } from "../../shared/ui/badge";
import {
  Search,
  User,
  Mail,
  Briefcase,
  Building2,
  Key,
  Trash2,
  RotateCcw,
  Copy,
  Eye,
  EyeOff,
  Shield,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shared/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../shared/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface UserAccount {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'manager' | 'hr' | 'admin';
  department: string;
  position: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Load users from localStorage
    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedCredentials = JSON.parse(localStorage.getItem('user_credentials') || '[]');
    
    // Add default admin and demo users
    const defaultUsers: UserAccount[] = [
      {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@probusemployee.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        department: 'Administration',
        position: 'System Administrator',
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z',
        lastLogin: new Date().toISOString()
      },
      {
        id: 'hr-1',
        username: 'hr.user',
        email: 'hr@probusemployee.com',
        firstName: 'HR',
        lastName: 'User',
        role: 'hr',
        department: 'Human Resources',
        position: 'HR Manager',
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z',
        lastLogin: new Date().toISOString()
      },
      {
        id: 'manager-1',
        username: 'manager.user',
        email: 'manager@probusemployee.com',
        firstName: 'Manager',
        lastName: 'User',
        role: 'manager',
        department: 'Engineering',
        position: 'Engineering Manager',
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z',
        lastLogin: new Date().toISOString()
      },
      {
        id: 'employee-1',
        username: 'employee.user',
        email: 'employee@probusemployee.com',
        firstName: 'Employee',
        lastName: 'User',
        role: 'employee',
        department: 'Engineering',
        position: 'Software Developer',
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z',
        lastLogin: new Date().toISOString()
      }
    ];

    // Convert stored credentials to users
    const credentialUsers: UserAccount[] = storedCredentials.map((cred: any, index: number) => ({
      id: `user-${index}`,
      username: cred.username,
      email: cred.email,
      firstName: cred.firstName,
      lastName: cred.lastName,
      role: cred.role,
      department: cred.department,
      position: cred.position,
      status: 'active',
      createdAt: cred.createdAt
    }));

    setUsers([...defaultUsers, ...credentialUsers]);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleResetPassword = (user: UserAccount) => {
    setSelectedUser(user);
    const generatedPassword = generatePassword();
    setNewPassword(generatedPassword);
    setShowResetDialog(true);
  };

  const confirmResetPassword = () => {
    if (!selectedUser) return;

    // Update password in localStorage
    const storedCredentials = JSON.parse(localStorage.getItem('user_credentials') || '[]');
    const updatedCredentials = storedCredentials.map((cred: any) => {
      if (cred.email === selectedUser.email) {
        return { ...cred, password: newPassword };
      }
      return cred;
    });
    localStorage.setItem('user_credentials', JSON.stringify(updatedCredentials));

    toast({
      title: "Password Reset Successful",
      description: `Password has been reset for ${selectedUser.firstName} ${selectedUser.lastName}`
    });

    setShowResetDialog(false);
    setSelectedUser(null);
    setNewPassword('');
    setShowPassword(false);
  };

  const handleDeleteUser = (user: UserAccount) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const confirmDeleteUser = () => {
    if (!selectedUser) return;

    // Cannot delete admin account
    if (selectedUser.role === 'admin') {
      toast({
        title: "Cannot Delete Admin",
        description: "Admin accounts cannot be deleted for security reasons",
        variant: "destructive"
      });
      setShowDeleteDialog(false);
      return;
    }

    // Remove from credentials
    const storedCredentials = JSON.parse(localStorage.getItem('user_credentials') || '[]');
    const updatedCredentials = storedCredentials.filter((cred: any) => cred.email !== selectedUser.email);
    localStorage.setItem('user_credentials', JSON.stringify(updatedCredentials));

    // Update users list
    setUsers(users.filter(u => u.id !== selectedUser.id));

    toast({
      title: "User Deleted",
      description: `${selectedUser.firstName} ${selectedUser.lastName} has been removed from the system`
    });

    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`
    });
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      hr: 'bg-blue-100 text-blue-800 border-blue-200',
      manager: 'bg-green-100 text-green-800 border-green-200',
      employee: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return (
      <Badge className={colors[role as keyof typeof colors] || colors.employee}>
        {role.toUpperCase()}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900">User Account Management</h2>
        <p className="text-blue-600 mt-1">Manage user accounts, reset passwords, and delete users</p>
      </div>

      {/* Search */}
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, email, username, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.length === 0 ? (
          <Card className="border-blue-200">
            <CardContent className="p-8 text-center text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No users found</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="border-blue-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        {user.role === 'admin' ? (
                          <Shield className="w-6 h-6 text-purple-600" />
                        ) : (
                          <User className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-blue-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          {getRoleBadge(user.role)}
                        </div>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-4 h-4" />
                        {user.department}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        {user.position}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Badge variant="outline" className="w-fit">
                          {user.status === 'active' ? '✓ Active' : '✗ Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 md:w-auto w-full">
                    <Button
                      onClick={() => handleResetPassword(user)}
                      variant="outline"
                      className="flex-1 md:flex-none border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Password
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(user)}
                      variant="outline"
                      className="flex-1 md:flex-none border-red-300 text-red-600 hover:bg-red-50"
                      disabled={user.role === 'admin'}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reset Password Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Generate a new password for {selectedUser?.firstName} {selectedUser?.lastName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-semibold text-blue-900">New Password Generated</p>
              </div>
              <p className="text-xs text-blue-700">
                A secure random password has been generated. Share this with the user via a secure channel.
              </p>
            </div>

            <div>
              <Label className="text-xs text-gray-600">New Password</Label>
              <div className="flex items-center gap-2 mt-1">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    readOnly
                    className="bg-gray-50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(newPassword, 'Password')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setNewPassword(generatePassword())}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Generate New
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowResetDialog(false);
              setNewPassword('');
              setShowPassword(false);
            }}>
              Cancel
            </Button>
            <Button onClick={confirmResetPassword} className="bg-blue-600 hover:bg-blue-700">
              Confirm Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Delete User Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>?
              This action cannot be undone. All user data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
