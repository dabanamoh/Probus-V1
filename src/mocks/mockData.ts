/**
 * Mock Data Provider
 * 
 * This file provides comprehensive mock data for the entire application
 * to help backend developers understand data structures and expected responses.
 * 
 * For Small Businesses:
 * - Admins can access all portals (Admin, HR, Manager, Employee)
 * - Mock data shows the full range of functionality
 * - All interactions are functional with realistic mock responses
 */

// ===========================
// USER & AUTHENTICATION DATA
// ===========================

export const mockUsers = [
  {
    id: 'user-admin-001',
    username: 'admin',
    email: 'admin@probusemployee.com',
    password: 'AdminPass123!', // In production, this would be hashed
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as const,
    department: 'Administration',
    position: 'System Administrator',
    phone: '+1 (555) 001-0001',
    status: 'active' as const,
    profilePicture: null,
    managerId: null,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'user-hr-001',
    username: 'hr.manager',
    email: 'hr@probusemployee.com',
    password: 'HRPass123!',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'hr' as const,
    department: 'Human Resources',
    position: 'HR Manager',
    phone: '+1 (555) 002-0002',
    status: 'active' as const,
    profilePicture: null,
    managerId: 'user-admin-001',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'user-manager-001',
    username: 'manager.user',
    email: 'manager@probusemployee.com',
    password: 'ManagerPass123!',
    firstName: 'Michael',
    lastName: 'Chen',
    role: 'manager' as const,
    department: 'Engineering',
    position: 'Engineering Manager',
    phone: '+1 (555) 003-0003',
    status: 'active' as const,
    profilePicture: null,
    managerId: 'user-admin-001',
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'user-employee-001',
    username: 'employee.user',
    email: 'employee@probusemployee.com',
    password: 'EmployeePass123!',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    role: 'employee' as const,
    department: 'Engineering',
    position: 'Software Developer',
    phone: '+1 (555) 004-0004',
    status: 'active' as const,
    profilePicture: null,
    managerId: 'user-manager-001',
    createdAt: '2024-03-01T00:00:00Z',
    lastLogin: new Date().toISOString()
  }
];

// ===========================
// PENDING EMPLOYEE REGISTRATIONS
// ===========================

export const mockPendingEmployees = [
  {
    id: 'pending-001',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@company.com',
    phone: '+1 (555) 100-0001',
    dateOfBirth: '1995-06-15',
    qualification: 'Bachelor of Science in Computer Science',
    certification: 'AWS Certified Solutions Architect',
    address: '123 Main St, San Francisco, CA 94102',
    nationality: 'American',
    religion: 'Christian',
    nextOfKin: 'Bob Johnson (Father)',
    status: 'pending' as const,
    submittedAt: '2025-11-20T10:30:00Z',
    documents: {
      hasProfilePicture: true,
      hasGovernmentId: true,
      certificateCount: 2,
      otherDocumentCount: 1
    }
  },
  {
    id: 'pending-002',
    firstName: 'David',
    lastName: 'Williams',
    email: 'david.williams@company.com',
    phone: '+1 (555) 100-0002',
    dateOfBirth: '1992-03-22',
    qualification: 'Master of Business Administration',
    certification: 'PMP, Six Sigma Black Belt',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    nationality: 'American',
    religion: 'Not specified',
    nextOfKin: 'Jennifer Williams (Wife)',
    status: 'pending' as const,
    submittedAt: '2025-11-21T14:20:00Z',
    documents: {
      hasProfilePicture: true,
      hasGovernmentId: true,
      certificateCount: 3,
      otherDocumentCount: 0
    }
  },
  {
    id: 'pending-003',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@company.com',
    phone: '+1 (555) 100-0003',
    dateOfBirth: '1998-12-05',
    qualification: 'Bachelor of Arts in Marketing',
    certification: 'Google Analytics Certified',
    address: '789 Pine Rd, Austin, TX 78701',
    nationality: 'American',
    religion: 'Catholic',
    nextOfKin: 'Carlos Garcia (Brother)',
    status: 'pending' as const,
    submittedAt: '2025-11-22T09:15:00Z',
    documents: {
      hasProfilePicture: true,
      hasGovernmentId: true,
      certificateCount: 1,
      otherDocumentCount: 2
    }
  }
];

// ===========================
// DEPARTMENTS
// ===========================

export const mockDepartments = [
  {
    id: 'dept-001',
    name: 'Engineering',
    description: 'Software development and technical operations',
    headOfDepartment: 'Michael Chen',
    employeeCount: 45,
    budget: 2500000,
    location: 'Building A, Floor 3',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'dept-002',
    name: 'Human Resources',
    description: 'Employee management and organizational development',
    headOfDepartment: 'Sarah Johnson',
    employeeCount: 8,
    budget: 800000,
    location: 'Building B, Floor 2',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'dept-003',
    name: 'Sales',
    description: 'Revenue generation and client relationships',
    headOfDepartment: 'Robert Taylor',
    employeeCount: 32,
    budget: 1800000,
    location: 'Building A, Floor 1',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'dept-004',
    name: 'Marketing',
    description: 'Brand management and market strategy',
    headOfDepartment: 'Jennifer Lee',
    employeeCount: 18,
    budget: 1200000,
    location: 'Building B, Floor 3',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'dept-005',
    name: 'Finance',
    description: 'Financial planning and accounting',
    headOfDepartment: 'David Martinez',
    employeeCount: 12,
    budget: 950000,
    location: 'Building A, Floor 2',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// ===========================
// LEAVE REQUESTS
// ===========================

export const mockLeaveRequests = [
  {
    id: 'leave-001',
    employeeId: 'user-employee-001',
    employeeName: 'Emily Rodriguez',
    type: 'annual' as const,
    startDate: '2025-12-20',
    endDate: '2025-12-31',
    duration: 10,
    reason: 'Christmas vacation with family',
    status: 'pending' as const,
    submittedAt: '2025-11-15T10:00:00Z',
    approverId: 'user-manager-001',
    approverName: 'Michael Chen'
  },
  {
    id: 'leave-002',
    employeeId: 'user-employee-002',
    employeeName: 'John Smith',
    type: 'sick' as const,
    startDate: '2025-11-25',
    endDate: '2025-11-27',
    duration: 3,
    reason: 'Medical appointment and recovery',
    status: 'approved' as const,
    submittedAt: '2025-11-20T09:30:00Z',
    reviewedAt: '2025-11-20T14:00:00Z',
    approverId: 'user-manager-001',
    approverName: 'Michael Chen'
  },
  {
    id: 'leave-003',
    employeeId: 'user-employee-003',
    employeeName: 'Amanda Brown',
    type: 'personal' as const,
    startDate: '2025-12-01',
    endDate: '2025-12-03',
    duration: 3,
    reason: 'Family emergency',
    status: 'approved' as const,
    submittedAt: '2025-11-18T11:00:00Z',
    reviewedAt: '2025-11-18T15:30:00Z',
    approverId: 'user-hr-001',
    approverName: 'Sarah Johnson'
  }
];

// ===========================
// TASKS
// ===========================

export const mockTasks = [
  {
    id: 'task-001',
    title: 'Complete Q4 Performance Reviews',
    description: 'Review and evaluate all team members for Q4 performance metrics',
    assignedTo: 'user-manager-001',
    assignedToName: 'Michael Chen',
    createdBy: 'user-hr-001',
    createdByName: 'Sarah Johnson',
    priority: 'high' as const,
    status: 'in_progress' as const,
    dueDate: '2025-12-15',
    createdAt: '2025-11-01T00:00:00Z',
    category: 'HR'
  },
  {
    id: 'task-002',
    title: 'Update Employee Handbook',
    description: 'Revise company policies and update employee handbook for 2026',
    assignedTo: 'user-hr-001',
    assignedToName: 'Sarah Johnson',
    createdBy: 'user-admin-001',
    createdByName: 'Admin User',
    priority: 'medium' as const,
    status: 'pending' as const,
    dueDate: '2025-12-31',
    createdAt: '2025-11-10T00:00:00Z',
    category: 'Documentation'
  },
  {
    id: 'task-003',
    title: 'Code Review - Authentication Module',
    description: 'Review and approve pull request for new authentication system',
    assignedTo: 'user-employee-001',
    assignedToName: 'Emily Rodriguez',
    createdBy: 'user-manager-001',
    createdByName: 'Michael Chen',
    priority: 'high' as const,
    status: 'completed' as const,
    dueDate: '2025-11-20',
    completedAt: '2025-11-19T16:00:00Z',
    createdAt: '2025-11-15T00:00:00Z',
    category: 'Development'
  }
];

// ===========================
// NOTICES & ANNOUNCEMENTS
// ===========================

export const mockNotices = [
  {
    id: 'notice-001',
    title: 'Company Holiday - Thanksgiving',
    message: 'The office will be closed on Thursday, November 28th and Friday, November 29th for Thanksgiving. Emergency contacts will be available.',
    category: 'holiday' as const,
    priority: 'high' as const,
    author: 'Admin User',
    authorId: 'user-admin-001',
    publishDate: '2025-11-15T00:00:00Z',
    expiryDate: '2025-11-30T23:59:59Z',
    targetAudience: 'all' as const,
    read: false
  },
  {
    id: 'notice-002',
    title: 'New HR Policy - Remote Work',
    message: 'Updated remote work policy is now available. All employees can work remotely up to 3 days per week with manager approval.',
    category: 'policy' as const,
    priority: 'medium' as const,
    author: 'Sarah Johnson',
    authorId: 'user-hr-001',
    publishDate: '2025-11-18T00:00:00Z',
    expiryDate: null,
    targetAudience: 'all' as const,
    read: false
  },
  {
    id: 'notice-003',
    title: 'Benefits Enrollment Period',
    message: 'Annual benefits enrollment period starts December 1st. Please review and update your selections by December 15th.',
    category: 'benefits' as const,
    priority: 'high' as const,
    author: 'Sarah Johnson',
    authorId: 'user-hr-001',
    publishDate: '2025-11-20T00:00:00Z',
    expiryDate: '2025-12-15T23:59:59Z',
    targetAudience: 'all' as const,
    read: false
  }
];

// ===========================
// AI SAFETY MONITORING DATA
// ===========================

export const mockSafetyIncidents = [
  {
    id: 'incident-001',
    type: 'productivity_anomaly' as const,
    severity: 'medium' as const,
    employeeId: 'user-employee-004',
    employeeName: 'Robert Johnson',
    description: 'Unusual work pattern detected - significant drop in activity over past week',
    detectedAt: '2025-11-22T14:30:00Z',
    status: 'under_review' as const,
    aiConfidence: 0.78,
    recommendedAction: 'Schedule 1-on-1 meeting with manager'
  },
  {
    id: 'incident-002',
    type: 'security_alert' as const,
    severity: 'high' as const,
    employeeId: 'user-employee-005',
    employeeName: 'Lisa Anderson',
    description: 'Multiple failed login attempts from unusual location',
    detectedAt: '2025-11-22T09:15:00Z',
    status: 'resolved' as const,
    aiConfidence: 0.95,
    recommendedAction: 'Password reset required',
    resolvedAt: '2025-11-22T10:00:00Z'
  }
];

// ===========================
// STATISTICS & ANALYTICS
// ===========================

export const mockStatistics = {
  admin: {
    totalEmployees: 247,
    totalDepartments: 12,
    activeRecruitment: 8,
    pendingApprovals: 15,
    aiAlertsToday: 3,
    systemHealth: 98
  },
  hr: {
    totalEmployees: 247,
    pendingApprovals: 12,
    activeRecruitment: 8,
    resignations: 3,
    newHires: 15,
    pendingOnboarding: 6,
    complianceIssues: 2,
    policiesNeedReview: 4
  },
  manager: {
    teamMembers: 12,
    pendingApprovals: 8,
    safetyReports: 2,
    completedTasks: 45,
    pendingTasks: 18,
    teamEfficiency: 87
  },
  employee: {
    pendingTasks: 5,
    completedTasks: 42,
    upcomingMeetings: 3,
    unreadMessages: 7,
    leaveBalance: 15
  }
};

// ===========================
// HELPER FUNCTIONS FOR BACKEND DEVS
// ===========================

/**
 * Example API Response Structure
 * 
 * All API endpoints should return data in this format:
 */
export const apiResponseExample = {
  success: true,
  data: {
    // Your data here
  },
  message: 'Operation completed successfully',
  timestamp: new Date().toISOString(),
  pagination: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10
  }
};

/**
 * Error Response Structure
 */
export const errorResponseExample = {
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    details: ['Email is required', 'Password must be at least 8 characters']
  },
  timestamp: new Date().toISOString()
};

/**
 * Authentication Token Structure
 */
export const authTokenExample = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  expiresIn: 3600, // seconds
  tokenType: 'Bearer',
  user: {
    id: 'user-001',
    email: 'user@example.com',
    role: 'employee',
    permissions: ['read:own', 'write:own']
  }
};

export default {
  mockUsers,
  mockPendingEmployees,
  mockDepartments,
  mockLeaveRequests,
  mockTasks,
  mockNotices,
  mockSafetyIncidents,
  mockStatistics
};
