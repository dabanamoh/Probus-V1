# Backend Integration Guide for Probus HR Application

## 🎯 Purpose
This guide helps backend developers understand the frontend functionality, data structures, and expected API responses for the Probus HR application.

---

## 📱 Small Business Consideration

### Multi-Role Access for Small Companies
In small businesses, **one person often handles multiple roles** (Owner = Admin + HR + Manager). The application supports this through:

1. **Portal Switcher Component**
   - Location: Top of sidebar and mobile header
   - Allows admins to switch between Admin, HR, Manager, and Employee portals
   - Automatically shows only portals the user has access to
   - Badge counters show pending items in each portal

2. **Role Hierarchy**
   ```
   Admin → Can access ALL portals (Admin, HR, Manager, Employee)
   HR → Can access HR + Employee portals
   Manager → Can access Manager + Employee portals
   Employee → Can only access Employee portal
   ```

---

## 🗂️ Complete Feature Map

### 1. AUTHENTICATION & USER MANAGEMENT

#### Login Flow
- **Endpoint Needed:** `POST /api/auth/login`
- **Input:** Email/Username + Password
- **Response:** User object + JWT token + Role + Permissions
- **Frontend File:** `src/portals/shared/pages/Login.tsx`
- **Mock Data:** `src/mocks/mockData.ts` (line 13-93)

```typescript
// Expected Response
{
  success: true,
  data: {
    accessToken: "jwt_token_here",
    refreshToken: "refresh_token_here",
    user: {
      id: "user-001",
      email: "user@company.com",
      username: "john.doe",
      firstName: "John",
      lastName: "Doe",
      role: "employee", // admin | hr | manager | employee
      department: "Engineering",
      position: "Software Developer",
      profilePicture: "url_to_image",
      managerId: "manager-id",
      permissions: ["read:own", "write:own"]
    }
  }
}
```

#### Registration Flow
- **Endpoint Needed:** `POST /api/auth/register`
- **Frontend File:** `src/portals/shared/pages/Registration.tsx`
- **Process:**
  1. User fills registration form with personal details + documents
  2. System creates `pending_employee` record
  3. Admin receives notification
  4. Admin approves → System generates username + password
  5. Credentials shown to admin
  6. Admin shares credentials with employee
  7. Employee logs in → First Login Wizard

#### First Login Wizard
- **Endpoint Needed:** `POST /api/users/complete-profile`
- **Frontend File:** `src/portals/shared/components/FirstLoginWizard.tsx`
- **Steps:**
  1. Change password
  2. Upload profile picture
  3. Add contact information
  4. Add emergency contact

---

### 2. ADMIN PORTAL FEATURES

#### Pending Employee Approvals
- **Page:** `/pending-employees`
- **File:** `src/portals/admin/pages/PendingEmployees.tsx`
- **Mock Data:** `mockPendingEmployees` (line 95-167)

**Endpoints Needed:**
```typescript
GET /api/admin/pending-employees
  → Returns list of pending registrations

POST /api/admin/pending-employees/:id/approve
  Body: { department, position, role }
  → Approves employee and generates credentials
  → Response: { username, password }

POST /api/admin/pending-employees/:id/reject
  Body: { reason }
  → Rejects registration
```

#### User Account Management
- **Page:** Admin Settings → Users Tab
- **File:** `src/portals/admin/components/UserManagement.tsx`

**Endpoints Needed:**
```typescript
GET /api/admin/users
  → Returns all users in system

POST /api/admin/users/:id/reset-password
  → Generates new password
  → Response: { newPassword }

DELETE /api/admin/users/:id
  → Deletes user (except admin)
  → Cannot delete users with role=admin
```

#### Departments Management
- **Page:** `/departments`
- **File:** `src/portals/admin/pages/Departments.tsx`
- **Mock Data:** `mockDepartments` (line 173-226)

**Endpoints Needed:**
```typescript
GET /api/departments
  → Returns all departments

POST /api/departments
  Body: { name, description, headOfDepartment, budget, location }

PUT /api/departments/:id
  → Updates department

DELETE /api/departments/:id
  → Deletes department (check for employees first)
```

#### Employees Management
- **Page:** `/employees`
- **File:** `src/portals/admin/pages/Employees.tsx`

**Endpoints Needed:**
```typescript
GET /api/employees
  Query: { page, limit, search, department, status }
  → Returns paginated employees

POST /api/employees
  Body: { full employee data }
  → Creates new employee

PUT /api/employees/:id
  → Updates employee

GET /api/employees/:id
  → Returns single employee details
```

#### AI Safety Dashboard
- **Page:** `/safety`
- **File:** `src/portals/admin/pages/SafetyDashboard.tsx`
- **Mock Data:** `mockSafetyIncidents` (line 361-390)

**Endpoints Needed:**
```typescript
GET /api/ai/safety/incidents
  Query: { severity, status, dateFrom, dateTo }
  → Returns AI-detected incidents

POST /api/ai/safety/incidents/:id/resolve
  Body: { action, notes }
  → Marks incident as resolved

GET /api/ai/safety/analytics
  → Returns safety metrics and trends
```

---

### 3. HR PORTAL FEATURES

#### Employee Management
- **Component:** `EmployeeManagement`
- **File:** `src/portals/hr/components/EmployeeManagement.tsx`

**Endpoints:**
```typescript
// Same as Admin employee endpoints +

PUT /api/hr/employees/:id/onboard
  → Complete onboarding process

POST /api/hr/employees/:id/offboard
  → Start offboarding process
```

#### Leave Approvals
- **Component:** `HRApprovals`
- **File:** `src/portals/hr/components/HRApprovals.tsx`
- **Mock Data:** `mockLeaveRequests` (line 232-288)

**Endpoints:**
```typescript
GET /api/hr/leave-requests
  Query: { status, employeeId, dateFrom, dateTo }
  → Returns leave requests

PUT /api/hr/leave-requests/:id/approve
  → Approves leave request

PUT /api/hr/leave-requests/:id/reject
  Body: { reason }
  → Rejects leave request
```

---

### 4. MANAGER PORTAL FEATURES

#### Team Management
- **Component:** `TeamManagement`
- **File:** `src/portals/manager/components/TeamManagement.tsx`

**Endpoints:**
```typescript
GET /api/manager/team
  → Returns team members reporting to manager

GET /api/manager/team/:id/performance
  → Returns employee performance metrics

POST /api/manager/team/:id/assign-task
  Body: { title, description, dueDate, priority }
  → Assigns task to team member
```

#### Manager Approvals
- **Component:** `ManagerApprovals`
- **File:** `src/portals/manager/components/ManagerApprovals.tsx`

**Endpoints:**
```typescript
GET /api/manager/approvals
  → Returns items pending manager approval

PUT /api/manager/approvals/:id/approve
  → Approves item (leave, expense, etc.)

PUT /api/manager/approvals/:id/reject
  Body: { reason }
  → Rejects item
```

---

### 5. EMPLOYEE PORTAL FEATURES

#### My Work Dashboard
- **Page:** `/work`
- **File:** `src/portals/employee/pages/MyWork.tsx`

**Endpoints:**
```typescript
GET /api/employee/my-work
  → Returns dashboard summary (tasks, leave requests, notices)

GET /api/employee/tasks
  → Returns assigned tasks

GET /api/employee/notices
  → Returns notices for employee
```

#### Leave Management
- **Component:** `LeaveManagement`
- **File:** `src/portals/employee/components/LeaveManagement.tsx`

**Endpoints:**
```typescript
GET /api/employee/leave/balance
  → Returns leave balance by type

POST /api/employee/leave/request
  Body: { type, startDate, endDate, reason }
  → Submits leave request

GET /api/employee/leave/history
  → Returns leave history
```

#### Task Management
- **Component:** `TaskManagement`
- **File:** `src/portals/shared/components/TaskManagement.tsx`
- **Mock Data:** `mockTasks` (line 294-355)

**Endpoints:**
```typescript
GET /api/tasks
  Query: { status, assignedTo, priority }
  → Returns tasks

POST /api/tasks
  Body: { title, description, assignedTo, dueDate, priority }
  → Creates task

PUT /api/tasks/:id/status
  Body: { status: "pending" | "in_progress" | "completed" }
  → Updates task status
```

#### Employee Directory
- **Component:** `EmployeeDirectory`
- **File:** `src/portals/shared/components/EmployeeDirectory.tsx`

**Endpoints:**
```typescript
GET /api/directory
  Query: { search, department }
  → Returns employee directory
```

---

### 6. NOTIFICATIONS SYSTEM

**Component:** `NotificationCenter`
**File:** `src/portals/shared/components/NotificationCenter.tsx`

**Endpoints:**
```typescript
GET /api/notifications
  Query: { read, category }
  → Returns user notifications

PUT /api/notifications/:id/read
  → Marks notification as read

PUT /api/notifications/mark-all-read
  → Marks all as read

DELETE /api/notifications/:id
  → Deletes notification
```

**Notification Categories:**
- `registration` - New employee registrations
- `leave` - Leave requests
- `task` - Task assignments
- `approval` - Items needing approval
- `message` - Messages/communications
- `system` - System announcements

---

### 7. ACTIVITY FEED

**Component:** `ActivityFeed`
**File:** `src/portals/shared/components/ActivityFeed.tsx`

**Endpoints:**
```typescript
GET /api/activity
  Query: { limit, offset }
  → Returns recent activities

POST /api/activity/log
  Body: { type, actor, action, target, metadata }
  → Logs activity
```

**Activity Types:**
- `user_created` / `user_updated` / `user_deleted`
- `leave_requested` / `leave_approved` / `leave_rejected`
- `task_created` / `task_completed`
- `message_sent`
- `notice_posted`

---

## 📊 Data Structures

### User Object
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  department: string;
  position: string;
  phone: string;
  status: 'active' | 'inactive';
  profilePicture?: string;
  managerId?: string;
  createdAt: string;
  lastLogin: string;
}
```

### Leave Request
```typescript
interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'study' | 'casual' | 'maternity' | 'paternity';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  duration: number; // days
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  approverId?: string;
  rejectionReason?: string;
}
```

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  createdBy: string;
  createdByName: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  category: string;
}
```

---

## 🔐 Security Considerations

1. **Password Requirements:**
   - Minimum 8 characters
   - Must include: uppercase, lowercase, number, special character
   - Hashed using bcrypt (cost factor: 12)

2. **JWT Tokens:**
   - Access token expiry: 1 hour
   - Refresh token expiry: 7 days
   - Store in httpOnly cookies (preferred) or localStorage

3. **Role-based Access Control:**
   - Check user role on every protected route
   - Admin can access all endpoints
   - HR can access HR + employee data
   - Manager can access their team data
   - Employee can access only their own data

4. **Data Validation:**
   - All inputs must be validated server-side
   - Sanitize all user inputs to prevent XSS/SQL injection
   - Use prepared statements for database queries

---

## 🧪 Testing Endpoints

### Quick Test Scenarios

1. **Small Business Owner Scenario:**
   ```
   - Login as admin
   - Switch to HR portal (via Portal Switcher)
   - Approve pending employee
   - Switch to Manager portal
   - Approve team leave request
   - Switch back to Admin portal
   - View all activities
   ```

2. **Employee Onboarding:**
   ```
   - New employee registers
   - Check /api/admin/pending-employees (should show new registration)
   - Admin approves (gets credentials)
   - Employee logs in with generated username
   - First login wizard (password change)
   - Employee dashboard loads
   ```

3. **Leave Request Flow:**
   ```
   - Employee submits leave request
   - Check /api/manager/approvals (manager should see request)
   - Manager approves
   - Check /api/notifications (employee should get notification)
   - Verify leave balance updated
   ```

---

## 📝 Frontend State Management

### LocalStorage Keys
```
- user_credentials: Array of approved users
- notifications_{email}: User-specific notifications
- activities_{role}: Role-specific activities
- profileCompleted: Boolean for first login check
- setupComplete: Boolean for admin setup
```

### Authentication Flow
```
1. Login → Store JWT in localStorage/cookie
2. Every API call → Include JWT in Authorization header
3. Token expires → Use refresh token
4. Logout → Clear all localStorage + cookies
```

---

## 🎨 UI/UX Functional Elements

### All Interactive Elements are Functional:

1. **Buttons:**
   - All buttons trigger actions (no placeholders)
   - Disabled states properly handled
   - Loading states show during async operations

2. **Forms:**
   - All form submissions handled
   - Validation feedback provided
   - Success/error messages displayed

3. **Tabs:**
   - All tabs functional with content
   - State persists during session

4. **Modals/Dialogs:**
   - Open/close properly
   - Data passed correctly
   - Actions execute and close

5. **Navigation:**
   - All links work
   - No broken routes
   - Proper redirects

---

## 🚀 API Response Standards

### Success Response
```json
{
  "success": true,
  "data": { },
  "message": "Operation completed successfully",
  "timestamp": "2025-11-22T10:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": ["Email is required"]
  },
  "timestamp": "2025-11-22T10:00:00Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10
  }
}
```

---

## 📞 Questions for Backend Team?

Contact frontend developer with:
- Unclear data structures
- Missing endpoint specifications
- Integration issues
- Performance concerns

---

## ✅ Checklist for Backend Implementation

- [ ] User authentication (login/register/logout)
- [ ] User management (CRUD operations)
- [ ] Password reset functionality
- [ ] Pending employee approvals
- [ ] Department management
- [ ] Leave request system
- [ ] Task management
- [ ] Notification system
- [ ] Activity logging
- [ ] Employee directory
- [ ] AI safety monitoring
- [ ] Role-based access control
- [ ] File upload handling (profile pictures, documents)
- [ ] Email notifications (optional)
- [ ] WebSocket for real-time updates (optional)

---

**Last Updated:** November 22, 2025  
**Frontend Version:** 1.0.0  
**Mock Data Location:** `/src/mocks/mockData.ts`
