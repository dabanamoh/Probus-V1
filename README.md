# Probus Employee Productivity Suite

## 📖 Complete Application Guide

**📚 For detailed documentation on how to use the application from login to all dashboard features, please see:**

👉 **[APPLICATION_GUIDE.md](APPLICATION_GUIDE.md)** - Complete user manual covering:
- 🔐 Login & Authentication Process
- 🏢 Admin Dashboard - Complete Management Suite  
- 👨‍💼 Employee Dashboard - Personal Productivity Hub
- 👨‍💼 Manager Dashboard - Team Leadership Interface
- 📝 Employee Onboarding Process
- 🔧 Technical Features & AI Analytics

## Quick Demo Access

| Role | Email | Password | Dashboard |
|------|--------|----------|----------|
| **Admin** | `admin@probusemployee.com` | `AdminPass123!` | `/` (Admin Dashboard) |
| **Employee** | `employee@probusemployee.com` | `EmployeePass123!` | `/app` (Employee Dashboard) |

## Project Overview

The Probus Employee Productivity Suite is a comprehensive employee-facing dashboard that serves as the data-generation engine for the Admin Analytics Dashboard. Every interaction within this suite is monitored and analyzed by AI to generate risk assessments, KPIs, and compliance scores.

## Core Product Concept

This Employee Dashboard is a fully-functional workspace where employees perform their daily tasks (chat, email, manage tasks, clock in). All interactions are logged and sent to the backend for AI analysis in the admin panel.

## Features

### 1. Unified Landing Page / Workspace
- Daily summary dashboard showing unread messages, upcoming tasks, team announcements
- Quick clock-in/out widget with geolocation tracking
- Comprehensive employee activity statistics including:
  - Pending emails and unread chats
  - Announcements and leave days
  - Late resumption days and task completion
  - Upcoming meetings and missed calls
  - Visual charts for task completion and communication activity

### 2. Communication Hub
- Real-time chat interface (Slack/Discord-like) with direct messages and team channels
- Integrated email client for sending, receiving, and organizing emails
- Voice and video calling capabilities
- Meeting scheduling and group meeting support
- Call and meeting recording functionality

### 3. Productivity & Task Management
- Personal task manager for individual to-do lists
- Team project management with Kanban board or list view

### 4. Personal Dashboard & Tools
- Time tracking with geofenced clock-in/out
- Profile management and document access
- Company directory with searchable employee contacts

### 5. Rules & Ethics Center
- Access to company policies, code of conduct, and ethics guidelines
- Supports compliance monitoring by ensuring employee access to rules

### 6. Whistleblower Reporting
- Anonymous incident reporting system for employees to report concerns
- Confidentiality guarantees to protect employee identity
- Categories for different types of incidents (financial, HR, safety, etc.)
- Option for non-anonymous reporting with contact information
- Comprehensive reporting guidelines and immediate help resources

## Technical Implementation

### Framework & Styling
- Built with React + Vite + Tailwind CSS
- Follows the same UI components, color scheme, and framework as the Admin Dashboard

### Data Logging & Monitoring
All user activities are logged for AI analysis:

1. **User Activity Events**: Logins, logouts, session duration, page views
2. **Chat Monitoring**: Every message sent, file shared, and emoji reaction
3. **Call Monitoring**: Voice and video calls with duration and participant tracking
4. **Meeting Monitoring**: Scheduled meetings with attendance and recording status
5. **Email Monitoring**: All sent, received, and deleted emails
6. **Time Tracking**: Clock-in/out events with precise timestamps and geolocation
7. **Task/Project Updates**: Changes to task status, deadlines, and time spent

### Rebranding
All instances of "Integrity Merit" have been replaced with "Probus".

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

The Employee Dashboard is accessible at `/app` route, separate from the admin interface at `/admin`.

To populate sample chat data:
1. Navigate to the chat interface
2. Click the "Filter" icon in the chat sidebar
3. Confirm the data population when prompted

## Data Flow

1. Employee interactions in the dashboard generate audit events
2. Events are logged and sent to the backend
3. Backend processes events for AI analysis
4. AI analysis results are displayed in the Admin Analytics Dashboard

## Modules

### Employee Dashboard (User Interface)
- `/app/dashboard` - Main landing page with daily summary and activity statistics
- `/app/chat` - Real-time messaging interface with calling and meeting features
- `/app/mail` - Email client
- `/app/tasks` - Task and project management
- `/app/time` - Time tracking and clock-in/out
- `/app/profile` - Personal profile and documents
- `/app/directory` - Company employee directory
- `/app/rules` - Rules and ethics center
- `/app/whistleblower` - Anonymous incident reporting system

### Audit Logging Services
- `auditService.ts` - Core logging functionality
- `chatService.ts` - Chat event logging
- `callService.ts` - Voice/video call logging
- `meetingService.ts` - Meeting scheduling and tracking
- `emailService.ts` - Email activity logging
- `taskService.ts` - Task activity logging

### Employee Statistics
- `useEmployeeStats.ts` - Hook for fetching employee activity statistics
- `EmployeeStatsChart.tsx` - Component for visualizing employee statistics

### Whistleblower Reporting
- `Whistleblower.tsx` - Component for anonymous incident reporting

## Development Guidelines

1. All new features must implement audit logging
2. Follow the existing UI component patterns
3. Maintain consistency with the Admin Dashboard styling
4. Ensure all data-generating actions are properly logged

## Future Enhancements

1. Integration with third-party email providers (Gmail, Outlook)
2. Advanced geofencing for location-based time tracking
3. Mobile application development
4. Enhanced AI analysis dashboards
5. Advanced reporting and analytics features
6. Screen sharing capabilities
7. Advanced meeting features (polls, whiteboard, etc.)

## Demo Credentials

For authorized users and testing purposes, the following demo credentials are available:

### Admin Dashboard
- Email: `admin@probusemployee.com`
- Password: `AdminPass123!`

### Employee Dashboard
- Email: `employee@probusemployee.com`
- Password: `EmployeePass123!`

## License

This project is proprietary software developed for Probus.