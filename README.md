# Probus Employee Productivity Suite

## 📖 Complete Application Guide

**📚 For comprehensive documentation on the application, please see:**

- 👉 **[USERFLOW.md](USERFLOW.md)** - Complete user flow documentation covering all portals and features
- 👉 **[BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md)** - Backend integration guide for API endpoints and data structures

## Overview

Probus is a comprehensive, role-based HR and employee management system with four distinct portals:
- 🔐 **Admin Portal** - Full system control and management
- 👔 **HR Portal** - Employee lifecycle and HR operations
- 👨‍💼 **Manager Portal** - Team management and leadership
- 👤 **Employee Portal** - Self-service and productivity tools

## Quick Demo Access

| Role | Email | Password | Dashboard Route |
|------|--------|----------|----------------|
| **Admin** | `admin@probusemployee.com` | `AdminPass123!` | `/admin` |
| **HR** | `hr@probusemployee.com` | `HRPass123!` | `/hr` |
| **Manager** | `manager@probusemployee.com` | `ManagerPass123!` | `/manager` |
| **Employee** | `employee@probusemployee.com` | `EmployeePass123!` | `/app` |

## Project Overview

Probus Employee Productivity Suite is a modern, full-stack HR and employee management platform designed for small to medium businesses. It provides role-based access control (RBAC) with specialized portals for different organizational roles.

## Core Features

The application provides a comprehensive suite of HR and employee management tools:
- **Multi-Portal Architecture** - Separate portals for Admin, HR, Manager, and Employee roles
- **Role-Based Access Control** - Fine-grained permissions system
- **Employee Lifecycle Management** - From onboarding to offboarding
- **Approval Workflows** - Multi-level approval system for leaves, resignations, rewards, and feedback
- **AI-Powered Safety Monitoring** - Real-time safety and compliance monitoring
- **Integrated Communication** - Built-in chat and messaging system
- **Task & Project Management** - Comprehensive task tracking and assignment
- **Time Tracking** - Clock in/out with geolocation
- **Document Management** - Secure document storage and access

## Portal-Specific Features

### Admin Portal (`/admin`)
- **Dashboard** - System overview with key metrics and statistics
- **Employee Management** - Full CRUD operations for employee records
- **Department Management** - Create and manage organizational departments
- **Pending Registrations** - Approve or reject new employee registrations
- **Approvals** - Review and process all approval requests (leaves, resignations, rewards, feedback)
- **Notices** - Create and manage company-wide announcements
- **Safety Dashboard** - AI-powered safety monitoring and compliance
- **Settings** - System configuration, user management, integrations, themes, rules & ethics
- **Events Management** - Create and manage company events
- **KPI Management** - Set and track Key Performance Indicators
- **Rewards & Recognition** - Manage employee rewards and recognition programs
- **Email Management** - Internal email system for admins

### HR Portal (`/hr`)
- **Dashboard** - HR-specific metrics and pending items
- **Employee Management** - HR view of employee lifecycle
- **Recruitment Panel** - Job postings and applicant tracking
- **Leave Approvals** - Review and approve employee leave requests
- **Policy Management** - Create and manage company policies
- **HR Reports** - Generate HR analytics and reports
- **Whistleblower Reports** - Review anonymous incident reports
- **Settings** - HR-specific configurations

### Manager Portal (`/manager`)
- **Dashboard** - Team overview and performance metrics
- **Team Management** - View and manage direct reports
- **KPI Management** - Set and track team KPIs
- **Approvals** - Approve team leave and other requests
- **Reports** - Team performance and activity reports
- **Task Assignment** - Assign and track team tasks

### Employee Portal (`/app`)
- **Dashboard** - Personal workspace with daily summary
- **My Work** - Personal tasks, notices, and leave requests
- **Leave Management** - Submit and track leave requests
- **Task Manager** - View and update assigned tasks
- **Time Tracking** - Clock in/out with geolocation
- **Directory** - Company employee directory
- **Apps** - Access to integrated applications
- **Email Client** - Internal email communication
- **Whistleblower** - Anonymous incident reporting
- **Rules & Ethics** - Access to company policies
- **Personal Reports** - View personal performance metrics
- **Activity Analytics** - Personal activity and productivity analytics
- **Settings** - Personal preferences and profile management

## Technical Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1
- **Styling**: Tailwind CSS 3.4.11 with pastel blue theme
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Routing**: React Router DOM v6.26.2
- **State Management**: React Query (TanStack Query) + Context API
- **Forms**: React Hook Form with Zod validation
- **Database**: IndexedDB (via idb) for local data storage
- **Theme**: Dark/Light mode support with next-themes

### Key Dependencies
- `@radix-ui/*` - Accessible UI component primitives
- `react-router-dom` - Client-side routing
- `@tanstack/react-query` - Server state management
- `react-hook-form` + `zod` - Form handling and validation
- `recharts` - Data visualization
- `date-fns` - Date manipulation
- `sonner` - Toast notifications
- `lucide-react` - Icon library

### Architecture
- **Multi-Portal Design**: Separate portals with shared components
- **Protected Routes**: Role-based access control on all routes
- **Lazy Loading**: Code-splitting for better performance
- **Context Providers**: AuthContext and ThemeContext for global state
- **Local-first**: IndexedDB integration for offline capability

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd integrityment-replica-control
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:8080`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

### PowerShell Configuration (Windows)
If you encounter execution policy errors, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

## Usage

### Accessing the Application

1. **Start the server**: `npm run dev`
2. **Navigate to**: `http://localhost:8080`
3. **Login** with demo credentials (see Quick Demo Access above)
4. You'll be redirected to your role-specific portal

### Portal Routes

| Portal | Base Route | Allowed Roles |
|--------|-----------|---------------|
| Admin Portal | `/admin` | admin, owner |
| HR Portal | `/hr` | hr |
| Manager Portal | `/manager` or `/leadership` | manager, supervisor, director, hod |
| Employee Portal | `/app` | employee |
| Safety Dashboard | `/safety` | admin, hr |
| Settings | `/settings` | All authenticated users |

## Application Structure

```
src/
├── portals/
│   ├── admin/          # Admin portal components and pages
│   ├── hr/             # HR portal components and pages
│   ├── manager/        # Manager portal components and pages
│   ├── employee/       # Employee portal components and pages
│   └── shared/         # Shared components, UI, layouts, and pages
├── context/
│   ├── AuthContext.tsx # Authentication state management
│   └── ThemeContext.tsx # Theme state management
├── hooks/              # Custom React hooks
├── services/           # API and service layer
├── types/              # TypeScript type definitions
├── integrations/       # Local database and integrations
└── lib/                # Utility functions and helpers
```

## Key Features Implemented

### Authentication & Authorization
- Multi-role login system
- First-time login wizard
- Role-based route protection
- Session management
- Password validation and security

### Admin Features
- Employee registration approval workflow
- Department CRUD operations
- Company-wide notice management
- Multi-level approval system (leaves, resignations, rewards, feedback)
- User account management
- AI safety monitoring dashboard
- System settings and configurations
- Theme customization
- Integration settings
- Rules and ethics management

### HR Features
- Employee lifecycle management
- Recruitment and applicant tracking
- Leave request approvals
- Policy management
- HR analytics and reporting
- Whistleblower report review

### Manager Features
- Team overview and management
- KPI setting and tracking
- Team approval workflows
- Performance monitoring
- Team reports and analytics

### Employee Features
- Personal dashboard with activity summary
- Leave request submission and tracking
- Task management and tracking
- Time tracking with clock in/out
- Employee directory access
- Email communication
- Anonymous whistleblower reporting
- Access to company policies
- Personal performance analytics

## Development Guidelines

1. **Portal Structure**: Keep portal-specific code in respective portal folders
2. **Shared Components**: Place reusable components in `portals/shared`
3. **UI Components**: Use shadcn/ui components from `portals/shared/ui`
4. **Styling**: Follow Tailwind CSS conventions with pastel blue theme
5. **Type Safety**: Use TypeScript for all new code
6. **State Management**: Use React Query for server state, Context for global UI state
7. **Forms**: Use React Hook Form with Zod validation
8. **Icons**: Use lucide-react for consistency
9. **Routing**: Protected routes with RBAC for all authenticated pages
10. **Performance**: Lazy load heavy components and pages

## Current Status

This is **Version 1.0** of the Probus Employee Productivity Suite. The application includes:

✅ Complete multi-portal architecture
✅ Role-based access control
✅ Employee onboarding workflow
✅ Approval workflows (leaves, resignations, rewards, feedback)
✅ Department and employee management
✅ Notice and event management
✅ Time tracking with geolocation
✅ Task management
✅ Internal communication (chat, email)
✅ Whistleblower reporting
✅ AI safety monitoring
✅ Dark/Light theme support
✅ Responsive design
✅ Local database integration (IndexedDB)

## Future Enhancements

- Backend API integration
- Real-time notifications via WebSocket
- Advanced analytics and reporting
- Mobile application
- Third-party integrations (Slack, MS Teams, etc.)
- Advanced geofencing for time tracking
- Document version control
- Performance review system
- Training and learning management
- Payroll integration

## Contributing

This is a proprietary project. For contribution guidelines, please contact the development team.

## Support

For issues, questions, or feature requests, please contact the development team.

## License

This project is proprietary software developed for Probus.