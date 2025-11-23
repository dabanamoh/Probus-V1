/**
 * API CONTRACT SPECIFICATIONS
 * 
 * This file defines all API contracts between frontend and backend.
 * Use these types to ensure type-safe API integration.
 * 
 * Backend developers should implement these exact interfaces.
 */

// ==================== BASE TYPES ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== AUTHENTICATION ====================

export namespace AuthAPI {
  export interface LoginRequest {
    email: string;
    password: string;
    deviceInfo?: {
      userAgent: string;
      ip?: string;
    };
  }

  export interface LoginResponse {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
  }

  export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    role?: 'employee' | 'manager' | 'hr' | 'admin';
    departmentId?: string;
  }

  export interface User {
    id: string;
    email: string;
    name: string;
    role: 'employee' | 'manager' | 'hr' | 'admin';
    departmentId?: string;
    profileImage?: string;
    createdAt: string;
    lastLogin?: string;
  }
}

// ==================== AI MONITORING ====================

export namespace AIAPI {
  export interface AnalyzeRequest {
    content: string;
    context?: {
      userId?: string;
      eventType?: string;
      module?: string;
    };
    categories: {
      harassment: boolean;
      security: boolean;
      productivity: boolean;
      policy_compliance: boolean;
    };
  }

  export interface AnalyzeResponse {
    riskScore: number;  // 0-100
    threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
    categories: string[];
    confidence: number;  // 0-1
    recommendations: string[];
    flags: {
      type: string;
      description: string;
      severity: string;
    }[];
    details?: {
      sentimentScore?: number;
      toxicityScore?: number;
      keywords?: string[];
      entities?: string[];
    };
  }

  export interface BatchEventRequest {
    events: AIMonitoringEvent[];
    config: {
      categories: Record<string, boolean>;
      privacyMode: string;
    };
  }

  export interface AIMonitoringEvent {
    id: string;
    eventType: string;
    category: string;
    severity: string;
    timestamp: string;
    userId: string;
    userRole: string;
    action: string;
    description: string;
    metadata: Record<string, any>;
    content?: any;
    context: any;
    privacy: any;
  }

  export interface AlertsResponse {
    alerts: Alert[];
    totalCount: number;
  }

  export interface Alert {
    id: string;
    type: 'harassment' | 'security' | 'productivity' | 'policy_violation';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    userId: string;
    userName: string;
    timestamp: string;
    status: 'new' | 'reviewed' | 'resolved' | 'dismissed';
    relatedEvents: string[];
  }
}

// ==================== EMPLOYEE MANAGEMENT ====================

export namespace EmployeeAPI {
  export interface Employee {
    id: string;
    name: string;
    email: string;
    phone?: string;
    position: string;
    departmentId: string;
    department?: Department;
    managerId?: string;
    manager?: Partial<Employee>;
    status: 'active' | 'on_leave' | 'terminated' | 'pending';
    dateOfBirth?: string;
    dateOfJoining: string;
    dateOfResumption?: string;
    address?: string;
    emergencyContact?: EmergencyContact;
    documents?: EmployeeDocument[];
    profileImage?: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface EmergencyContact {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  }

  export interface EmployeeDocument {
    id: string;
    type: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  }

  export interface CreateEmployeeRequest {
    name: string;
    email: string;
    phone?: string;
    position: string;
    departmentId: string;
    managerId?: string;
    dateOfBirth?: string;
    dateOfJoining: string;
    address?: string;
  }

  export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {}

  export interface Department {
    id: string;
    name: string;
    description?: string;
    managerId?: string;
    manager?: Partial<Employee>;
    employeeCount: number;
    createdAt: string;
  }
}

// ==================== TIME TRACKING ====================

export namespace TimeAPI {
  export interface ClockInRequest {
    userId: string;
    timestamp: string;
    location?: {
      latitude: number;
      longitude: number;
      accuracy?: number;
    };
    deviceInfo?: string;
  }

  export interface ClockOutRequest extends ClockInRequest {}

  export interface TimeRecord {
    id: string;
    userId: string;
    clockIn: string;
    clockOut?: string;
    totalHours?: number;
    location?: {
      latitude: number;
      longitude: number;
    };
    status: 'in_progress' | 'completed' | 'incomplete';
    date: string;
    createdAt: string;
  }

  export interface TimeStats {
    totalHoursToday: number;
    totalHoursWeek: number;
    totalHoursMonth: number;
    averageHoursPerDay: number;
    lateArrivals: number;
    earlyDepartures: number;
  }
}

// ==================== APPROVALS ====================

export namespace ApprovalAPI {
  export interface ApprovalRequest {
    id: string;
    type: 'leave' | 'overtime' | 'expense' | 'resource' | 'other';
    requesterId: string;
    requester: Partial<EmployeeAPI.Employee>;
    title: string;
    description: string;
    amount?: number;
    startDate?: string;
    endDate?: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    approverId?: string;
    approver?: Partial<EmployeeAPI.Employee>;
    approvedAt?: string;
    rejectionReason?: string;
    attachments?: string[];
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  }

  export interface CreateApprovalRequest {
    type: string;
    title: string;
    description: string;
    amount?: number;
    startDate?: string;
    endDate?: string;
    priority?: string;
    metadata?: Record<string, any>;
  }

  export interface ApproveRequest {
    approverId: string;
    comments?: string;
  }

  export interface RejectRequest {
    approverId: string;
    reason: string;
  }
}

// ==================== LEAVE MANAGEMENT ====================

export namespace LeaveAPI {
  export interface LeaveRequest {
    id: string;
    employeeId: string;
    employee: Partial<EmployeeAPI.Employee>;
    leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid';
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approver?: Partial<EmployeeAPI.Employee>;
    approvedAt?: string;
    rejectionReason?: string;
    createdAt: string;
  }

  export interface LeaveBalance {
    employeeId: string;
    annual: number;
    sick: number;
    personal: number;
    maternity: number;
    paternity: number;
    used: {
      annual: number;
      sick: number;
      personal: number;
      maternity: number;
      paternity: number;
    };
  }

  export interface CreateLeaveRequest {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
  }
}

// ==================== TASKS ====================

export namespace TaskAPI {
  export interface Task {
    id: string;
    title: string;
    description?: string;
    assigneeId: string;
    assignee: Partial<EmployeeAPI.Employee>;
    assignedBy: string;
    assigner: Partial<EmployeeAPI.Employee>;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    dueDate?: string;
    completedAt?: string;
    tags?: string[];
    attachments?: string[];
    createdAt: string;
    updatedAt: string;
  }

  export interface CreateTaskRequest {
    title: string;
    description?: string;
    assigneeId: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    tags?: string[];
  }

  export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
    status?: string;
  }
}

// ==================== COMMUNICATIONS ====================

export namespace CommunicationAPI {
  export interface Notice {
    id: string;
    title: string;
    content: string;
    type: 'general' | 'urgent' | 'event' | 'policy';
    priority: 'low' | 'normal' | 'high';
    author: Partial<EmployeeAPI.Employee>;
    recipients: 'all' | 'department' | 'specific';
    recipientIds?: string[];
    departmentIds?: string[];
    readBy?: string[];
    expiresAt?: string;
    publishedAt: string;
    createdAt: string;
  }

  export interface CreateNoticeRequest {
    title: string;
    content: string;
    type: string;
    priority: string;
    recipients: string;
    recipientIds?: string[];
    departmentIds?: string[];
    expiresAt?: string;
  }

  export interface ChatMessage {
    id: string;
    senderId: string;
    sender: Partial<EmployeeAPI.Employee>;
    recipientId?: string;
    recipient?: Partial<EmployeeAPI.Employee>;
    groupId?: string;
    content: string;
    messageType: 'text' | 'file' | 'image' | 'link';
    attachments?: string[];
    isRead: boolean;
    readAt?: string;
    aiRiskScore?: number;
    createdAt: string;
  }

  export interface EmailMessage {
    id: string;
    from: string;
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
    isHtml: boolean;
    attachments?: EmailAttachment[];
    sentAt: string;
    readAt?: string;
  }

  export interface EmailAttachment {
    fileName: string;
    fileSize: number;
    mimeType: string;
    url: string;
  }
}

// ==================== PERFORMANCE & KPIs ====================

export namespace PerformanceAPI {
  export interface KPI {
    id: string;
    employeeId: string;
    employee: Partial<EmployeeAPI.Employee>;
    period: string;  // 'monthly' | 'quarterly' | 'yearly'
    startDate: string;
    endDate: string;
    metrics: {
      productivity: number;
      quality: number;
      attendance: number;
      collaboration: number;
      overallScore: number;
    };
    goals?: Goal[];
    achievements?: string[];
    areasOfImprovement?: string[];
    reviewedBy?: string;
    reviewer?: Partial<EmployeeAPI.Employee>;
    reviewedAt?: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface Goal {
    id: string;
    title: string;
    description?: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
    dueDate: string;
  }

  export interface Feedback {
    id: string;
    fromId: string;
    from: Partial<EmployeeAPI.Employee>;
    toId: string;
    to: Partial<EmployeeAPI.Employee>;
    type: 'positive' | 'constructive' | 'recognition';
    subject: string;
    content: string;
    isAnonymous: boolean;
    tags?: string[];
    createdAt: string;
  }
}

// ==================== SAFETY & COMPLIANCE ====================

export namespace SafetyAPI {
  export interface WhistleblowerReport {
    id: string;
    reporterType: 'employee' | 'external';
    reporterId?: string;  // null for anonymous
    isAnonymous: boolean;
    category: 'harassment' | 'discrimination' | 'safety' | 'fraud' | 'policy_violation' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    subject: string;
    description: string;
    incidentDate?: string;
    location?: string;
    witnessesCount?: number;
    evidence?: string[];
    status: 'submitted' | 'under_review' | 'investigating' | 'resolved' | 'closed';
    assignedTo?: string;
    investigator?: Partial<EmployeeAPI.Employee>;
    resolution?: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface PolicyDocument {
    id: string;
    title: string;
    category: string;
    content: string;
    version: string;
    effectiveDate: string;
    expiryDate?: string;
    requiresAcknowledgment: boolean;
    acknowledgedBy?: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  }
}

// ==================== ANALYTICS ====================

export namespace AnalyticsAPI {
  export interface DashboardStats {
    totalEmployees: number;
    activeEmployees: number;
    onLeaveEmployees: number;
    pendingApprovals: number;
    todayAttendance: number;
    thisMonthAbsences: number;
    averageSatisfaction: number;
    criticalAlerts: number;
  }

  export interface EmployeeActivityStats {
    userId: string;
    period: 'daily' | 'weekly' | 'monthly';
    logins: number;
    tasksCompleted: number;
    emailsSent: number;
    emailsReceived: number;
    chatMessages: number;
    hoursWorked: number;
    lateArrivals: number;
    productivity_score: number;
  }

  export interface DepartmentStats {
    departmentId: string;
    departmentName: string;
    employeeCount: number;
    activeProjects: number;
    completionRate: number;
    averageProductivity: number;
    turnoverRate: number;
  }
}

// ==================== INTEGRATIONS ====================

export namespace IntegrationAPI {
  export interface Integration {
    id: string;
    name: string;
    provider: string;
    type: 'email' | 'calendar' | 'chat' | 'storage' | 'productivity';
    status: 'connected' | 'disconnected' | 'error';
    connectedAt?: string;
    disconnectedAt?: string;
    configuration: Record<string, any>;
    permissions: string[];
    userId: string;
  }

  export interface ConnectIntegrationRequest {
    provider: string;
    type: string;
    authCode?: string;
    credentials?: Record<string, any>;
  }
}
