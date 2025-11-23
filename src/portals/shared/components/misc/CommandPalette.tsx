import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Command,
  Search,
  Inbox,
  Users,
  Building2,
  UserX,
  Award,
  Mail,
  Calendar,
  Bell,
  MessageCircle,
  TrendingUp,
  FileText,
  Settings,
  ClipboardCheck,
  CalendarDays,
  Clock,
  BarChart3,
  Plus,
  CheckCircle,
  Send,
  Shield
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";

import { useAuth } from '@/context/AuthContext';

interface CommandItem {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  category: 'navigation' | 'action' | 'quick';
  roles?: string[];
  keywords?: string[];
}

interface CommandPaletteProps {
  userRole?: string;
}

const CommandPalette = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'employee';
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // All available commands
  const allCommands: CommandItem[] = [
    // Universal Navigation
    { id: 'my-work', label: 'My Work', icon: Inbox, action: () => navigate('/work'), category: 'navigation', keywords: ['inbox', 'tasks', 'pending', 'approvals'] },
    { id: 'safety-ai', label: 'Safety & AI Monitoring', icon: Shield, action: () => navigate('/safety'), category: 'navigation', roles: ['admin', 'hr'], keywords: ['security', 'harassment', 'productivity', 'threats'] },
    { id: 'settings', label: 'Settings', icon: Settings, action: () => navigate('/settings'), category: 'navigation', keywords: ['email', 'profile', 'preferences'] },
    
    // Admin Navigation
    { id: 'departments', label: 'Departments', icon: Building2, action: () => navigate('/departments'), category: 'navigation', roles: ['admin'] },
    { id: 'people', label: 'People', icon: Users, action: () => navigate('/employees'), category: 'navigation', roles: ['admin'], keywords: ['employees', 'team'] },
    { id: 'offboarding', label: 'Offboarding', icon: UserX, action: () => navigate('/resignations'), category: 'navigation', roles: ['admin', 'manager', 'hr'], keywords: ['resignations', 'terminations'] },
    { id: 'recognition', label: 'Recognition', icon: Award, action: () => navigate('/rewards'), category: 'navigation', roles: ['admin'], keywords: ['rewards', 'awards'] },
    { id: 'communications', label: 'Communications', icon: Bell, action: () => navigate('/notices'), category: 'navigation', roles: ['admin'], keywords: ['notices', 'announcements'] },
    { id: 'events', label: 'Events & Calendar', icon: Calendar, action: () => navigate('/events'), category: 'navigation', roles: ['admin'], keywords: ['calendar', 'meetings'] },
    { id: 'feedback', label: 'Feedback', icon: MessageCircle, action: () => navigate('/feedbacks'), category: 'navigation', roles: ['admin'] },
    { id: 'insights', label: 'Insights', icon: TrendingUp, action: () => navigate('/kpis'), category: 'navigation', roles: ['admin'], keywords: ['kpis', 'analytics', 'reports'] },
    
    // Employee/Manager/HR Navigation
    { id: 'my-requests', label: 'My Requests', icon: ClipboardCheck, action: () => navigate('/app'), category: 'navigation', roles: ['employee', 'manager', 'hr'] },
    { id: 'directory', label: 'Directory', icon: Users, action: () => navigate('/app'), category: 'navigation', roles: ['employee', 'manager', 'hr'] },
    { id: 'time-tracking', label: 'Time Tracking', icon: Clock, action: () => navigate('/app'), category: 'navigation', roles: ['employee', 'manager', 'hr'] },
    
    // Quick Actions - Admin
    { id: 'add-employee', label: 'Add Employee', icon: Plus, action: () => navigate('/employees'), category: 'action', roles: ['admin'], keywords: ['create', 'new', 'hire'] },
    { id: 'create-department', label: 'Create Department', icon: Plus, action: () => navigate('/departments'), category: 'action', roles: ['admin'], keywords: ['add', 'new'] },
    { id: 'post-notice', label: 'Post Communication', icon: Bell, action: () => navigate('/notices'), category: 'action', roles: ['admin'], keywords: ['create', 'announce', 'new', 'notice'] },
    { id: 'schedule-event', label: 'Schedule Event', icon: CalendarDays, action: () => navigate('/events'), category: 'action', roles: ['admin'], keywords: ['create', 'new', 'meeting'] },
    { id: 'quick-setup', label: 'Quick Setup Wizard', icon: Plus, action: () => navigate('/setup'), category: 'action', roles: ['admin'], keywords: ['onboard', 'configure', 'start'] },
    
    // Quick Actions - Manager
    { id: 'approve-requests', label: 'Review Requests', icon: CheckCircle, action: () => navigate('/work'), category: 'action', roles: ['manager'], keywords: ['review', 'pending', 'approve', 'approvals'] },
    { id: 'post-team-notice', label: 'Team Communication', icon: Bell, action: () => navigate('/manager'), category: 'action', roles: ['manager'], keywords: ['announce', 'team'] },
    
    // Quick Actions - Employee
    { id: 'request-leave', label: 'Request Leave', icon: Calendar, action: () => navigate('/app'), category: 'action', roles: ['employee', 'manager', 'hr'], keywords: ['vacation', 'time off'] },
    { id: 'email-setup', label: 'Configure Email', icon: Mail, action: () => navigate('/settings'), category: 'action', roles: ['employee', 'manager', 'hr', 'admin'], keywords: ['setup', 'account'] },
  ];

  // Filter commands based on role and search
  const getFilteredCommands = useCallback(() => {
    let filtered = allCommands;
    
    // Filter by role
    if (userRole) {
      filtered = filtered.filter(cmd => !cmd.roles || cmd.roles.includes(userRole));
    }
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(cmd => {
        const labelMatch = cmd.label.toLowerCase().includes(searchLower);
        const keywordsMatch = cmd.keywords?.some(kw => kw.toLowerCase().includes(searchLower));
        return labelMatch || keywordsMatch;
      });
    }
    
    return filtered;
  }, [userRole, search, allCommands]);

  const filteredCommands = getFilteredCommands();

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      
      if (open) {
        if (e.key === 'Escape') {
          setOpen(false);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault();
          handleCommandSelect(filteredCommands[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, selectedIndex, filteredCommands]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleCommandSelect = (command: CommandItem) => {
    command.action();
    setOpen(false);
    setSearch('');
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation': return 'Navigate';
      case 'action': return 'Quick Actions';
      case 'quick': return 'Quick Access';
      default: return category;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'navigation': return <Badge variant="secondary" className="text-xs">Go to</Badge>;
      case 'action': return <Badge variant="default" className="text-xs">Action</Badge>;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0">
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="flex items-center border-b px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commands... (Ctrl+K)"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No commands found</p>
                <p className="text-sm text-gray-400 mt-1">Try searching for something else</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category} className="mb-4">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {getCategoryLabel(category)}
                  </div>
                  <div className="space-y-1">
                    {commands.map((command, idx) => {
                      const globalIdx = filteredCommands.indexOf(command);
                      const Icon = command.icon;
                      return (
                        <button
                          key={command.id}
                          onClick={() => handleCommandSelect(command)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                            selectedIndex === globalIdx
                              ? 'bg-blue-50 text-blue-900'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${selectedIndex === globalIdx ? 'text-blue-600' : 'text-gray-500'}`} />
                            <span className="font-medium">{command.label}</span>
                          </div>
                          {getCategoryBadge(command.category)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Hint */}
          <div className="border-t px-4 py-2 text-xs text-gray-500 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">Esc</kbd>
                Close
              </span>
            </div>
            <span className="text-gray-400">Press <kbd className="px-1 py-0.5 bg-white border rounded text-[10px]">Ctrl+K</kbd> anytime</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
