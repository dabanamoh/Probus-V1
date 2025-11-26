# Probus MVP - Detailed User Flow Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Authentication & Onboarding](#authentication--onboarding)
4. [Admin Portal Flow](#admin-portal-flow)
5. [HR Portal Flow](#hr-portal-flow)
6. [Manager/Leadership Portal Flow](#managerleadership-portal-flow)
7. [Employee Portal Flow](#employee-portal-flow)
8. [Cross-Portal Features](#cross-portal-features)
9. [Detailed Interaction Flows](#detailed-interaction-flows)
10. [State Management & Data Flow](#state-management--data-flow)
11. [UI/UX Patterns](#uiux-patterns)

---

## Overview

Probus is a comprehensive role-based employee management system built with React 18.3.1, TypeScript, and Vite. The application features four distinct portals with specialized workflows and a modern pastel blue UI theme with dark mode support.

### Portal Overview
- **Admin Portal** - For administrators and owners (full system control)
- **HR Portal** - For human resources staff (employee lifecycle management)
- **Manager/Leadership Portal** - For managers, supervisors, directors, and heads of departments (team management)
- **Employee Portal** - For regular employees (self-service and productivity)

### Key Technologies
- **Frontend**: React 18.3.1, TypeScript, Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API, React Query
- **UI Components**: shadcn/ui, lucide-react icons
- **Database**: Local IndexedDB (local-db integration)
- **Authentication**: Context-based auth with role-based access control (RBAC)

---

## System Architecture

### Application Structure
```
Probus Application
├── Public Routes
│   ├── /login - Login page
│   ├── /register - Registration page
│   └── /onboarding - Employee onboarding
│
├── Protected Routes (RBAC)
│   ├── Admin Portal (/admin, /)
│   │   ├── Roles: admin, owner
│   │   └── Auto-redirect for other roles
│   ├── HR Portal (/hr)
│   │   ├── Roles: hr
│   │   └── Full employee management access
│   ├── Manager Portal (/manager, /leadership)
│   │   ├── Roles: manager, supervisor, director, hod
│   │   └── Team-specific access
│   └── Employee Portal (/app)
│       ├── Roles: employee
│       └── Self-service access
│
├── Shared Routes (Multi-role)
│   ├── /settings - Available to all authenticated users
│   ├── /notifications - Admin only
│   ├── /safety - Admin and HR
│   └── /first-login - First-time login wizard
│
└── Global Components
    ├── FloatingChat - Available on all pages
    ├── CommandPalette - Ctrl+K anywhere
    └── ThemeToggle - Light/Dark mode
```

### Role-Based Route Protection
```
Route Access Matrix:
┌─────────────────┬───────┬─────┬─────────┬──────────┐
│ Route           │ Admin │ HR  │ Manager │ Employee │
├─────────────────┼───────┼─────┼─────────┼──────────┤
│ /admin          │   ✓   │  ✗  │    ✗    │    ✗     │
│ /hr             │   ✗   │  ✓  │    ✗    │    ✗     │
│ /manager        │   ✗   │  ✗  │    ✓    │    ✗     │
│ /app            │   ✗   │  ✗  │    ✗    │    ✓     │
│ /settings       │   ✓   │  ✓  │    ✓    │    ✓     │
│ /safety         │   ✓   │  ✓  │    ✗    │    ✗     │
│ /notifications  │   ✓   │  ✗  │    ✗    │    ✗     │
└─────────────────┴───────┴─────┴─────────┴──────────┘
```

---

## Authentication & Onboarding

### 1. Registration Flow (Detailed)
**Entry Point:** `/register`  
**Component:** `Registration.tsx`  
**State Management:** Local state + AuthContext

#### Step-by-Step Flow:

```
┌─────────────────────────────────────────────────────────────┐
│                    REGISTRATION PAGE                        │
└─────────────────────────────────────────────────────────────┘

STEP 1: Initial Page Load
├─ Component renders Registration form
├─ Form fields initialized (empty state)
├─ Password strength indicator ready
├─ Role selector displays all available roles
└─ Submit button disabled (no data)

STEP 2: User Input - Personal Information
├─ First Name Field
│  ├─ Input type: text
│  ├─ Validation: Required, min 2 characters, letters only
│  ├─ Real-time validation on blur
│  └─ Error display: Red border + error message below field
├─ Last Name Field
│  ├─ Input type: text
│  ├─ Validation: Required, min 2 characters, letters only
│  ├─ Real-time validation on blur
│  └─ Error display: Red border + error message below field
├─ Email Field
│  ├─ Input type: email
│  ├─ Validation: Required, valid email format, unique check
│  ├─ Real-time validation on blur
│  ├─ Async validation: Check if email exists (debounced 500ms)
│  └─ Error states:
│     ├─ Invalid format: "Please enter a valid email"
│     ├─ Already exists: "Email already registered"
│     └─ Visual: Red border + error icon
└─ Phone Field (Optional)
   ├─ Input type: tel
   ├─ Format: Auto-formats to (XXX) XXX-XXXX
   ├─ Validation: Optional, but if entered must be valid
   └─ Visual helper: Placeholder shows format

STEP 3: User Input - Password Creation
├─ Password Field
│  ├─ Input type: password (toggleable to text)
│  ├─ Show/Hide password icon (eye icon)
│  ├─ Validation Requirements:
│  │  ├─ Minimum 8 characters
│  │  ├─ At least 1 uppercase letter
│  │  ├─ At least 1 lowercase letter
│  │  ├─ At least 1 number
│  │  └─ At least 1 special character
│  ├─ Password Strength Indicator (Real-time)
│  │  ├─ Weak (Red): < 4 requirements met
│  │  ├─ Medium (Yellow): 4 requirements met
│  │  └─ Strong (Green): All requirements met
│  └─ Visual Feedback:
│     ├─ Progress bar shows strength
│     └─ Checklist shows met requirements
└─ Confirm Password Field
   ├─ Input type: password (toggleable to text)
   ├─ Validation: Must match password field
   ├─ Real-time validation on input
   └─ Error: "Passwords do not match" (if mismatch)

STEP 4: Role Selection
├─ Role Dropdown/Radio Group
│  ├─ Options Available:
│  │  ├─ Employee (Default selected)
│  │  ├─ Manager
│  │  ├─ HR
│  │  └─ Admin (May require special code/invitation)
│  ├─ Each role shows description on hover
│  ├─ Admin role may show "Invitation code required"
│  └─ Visual: Card-style selection with icons
└─ Department Selection (If role requires)
   ├─ Dropdown with department list
   ├─ Fetched from backend/local storage
   └─ Required for Employee, Manager roles

STEP 5: Terms & Conditions
├─ Checkbox: "I agree to Terms & Conditions"
│  ├─ Required to submit
│  ├─ Link to terms opens in modal/new tab
│  └─ Visual: Unchecked = disabled submit button
└─ Privacy Policy checkbox (optional)
   └─ Link to privacy policy

STEP 6: Form Validation & Submission
├─ User clicks "Register" button
├─ Client-side validation runs
│  ├─ All required fields filled?
│  ├─ All validations passed?
│  ├─ Terms accepted?
│  └─ If any fail:
│     ├─ Scroll to first error
│     ├─ Focus on error field
│     └─ Display error summary at top
├─ If validation passes:
│  ├─ Button shows loading spinner
│  ├─ Button text: "Registering..."
│  └─ Form fields disabled
└─ Submit to backend
   ├─ API Call: POST /api/auth/register
   ├─ Payload: { firstName, lastName, email, password, role, department }
   └─ Response handling:

STEP 7: Server Response Handling
├─ SUCCESS (Status 201)
│  ├─ User account created (status: pending)
│  ├─ Display success message:
│  │  ├─ Title: "Registration Successful!"
│  │  ├─ Message: "Your account is pending admin approval."
│  │  └─ Sub-message: "You'll receive an email when approved."
│  ├─ Visual: Green success banner with checkmark
│  ├─ Auto-redirect to login page (5 second countdown)
│  └─ Clear form data
├─ ERROR (Status 4xx/5xx)
│  ├─ 409 - Email already exists
│  │  └─ Show: "Email already registered. Try logging in."
│  ├─ 400 - Validation error
│  │  └─ Show specific field errors
│  ├─ 500 - Server error
│  │  └─ Show: "Registration failed. Please try again."
│  └─ Visual: Red error banner at top of form
└─ Re-enable form for corrections

STEP 8: Post-Registration
├─ Email sent to user:
│  ├─ Subject: "Registration Received - Pending Approval"
│  ├─ Body: Contains registration details
│  └─ Next steps information
├─ Email sent to admin:
│  ├─ Subject: "New Registration - Action Required"
│  ├─ Body: User details + approval link
│  └─ Direct link to pending registrations
└─ User data stored:
   ├─ Status: pending
   ├─ Created timestamp
   └─ Awaiting admin approval
```

#### Registration Form UI Elements:

**Form Layout:**
```
┌────────────────────────────────────────────────────┐
│                 REGISTER                           │
│  Create your account to get started               │
├────────────────────────────────────────────────────┤
│                                                    │
│  First Name*         Last Name*                   │
│  [____________]      [____________]                │
│                                                    │
│  Email Address*                                    │
│  [_______________________________]  ✓/✗           │
│  └─ Checking availability...                      │
│                                                    │
│  Password*                        👁              │
│  [_______________________________]                │
│  Strength: [▓▓▓░░░] Medium                       │
│  ✓ 8+ characters  ✓ Uppercase  ✗ Number          │
│                                                    │
│  Confirm Password*                👁              │
│  [_______________________________]                │
│                                                    │
│  Select Your Role*                                │
│  ┌─────────┬─────────┬─────────┬─────────┐       │
│  │Employee │ Manager │   HR    │  Admin  │       │
│  │   👤    │   👔    │   📋    │   🔐    │       │
│  │    ○    │    ○    │    ○    │    ○    │       │
│  └─────────┴─────────┴─────────┴─────────┘       │
│                                                    │
│  Department (for Employee/Manager)                │
│  [▼ Select Department _______________]            │
│                                                    │
│  ☐ I agree to Terms & Conditions*                │
│     and Privacy Policy                            │
│                                                    │
│  [         Register Account         ]            │
│                                                    │
│  Already have an account? Login                   │
└────────────────────────────────────────────────────┘
```

#### Validation Rules Summary:

| Field | Required | Min Length | Max Length | Pattern | Async Check |
|-------|----------|------------|------------|---------|-------------|
| First Name | Yes | 2 | 50 | Letters only | No |
| Last Name | Yes | 2 | 50 | Letters only | No |
| Email | Yes | - | 100 | Valid email | Uniqueness |
| Password | Yes | 8 | - | Complex | No |
| Confirm Password | Yes | - | - | Match password | No |
| Role | Yes | - | - | - | No |
| Department | Conditional | - | - | - | No |
| Terms | Yes | - | - | - | No |

### 2. Login Flow (Detailed)
**Entry Point:** `/login`  
**Component:** `Login.tsx`  
**Authentication:** Context-based with JWT tokens

#### Step-by-Step Flow:

```
┌────────────────────────────────────────────────────────────┐
│                      LOGIN PAGE                             │
└────────────────────────────────────────────────────────────┘

STEP 1: Page Load & Initialization
├─ Check for existing session
│  ├─ Check localStorage for auth token
│  ├─ If valid token exists:
│  │  ├─ Validate token with server
│  │  ├─ If valid: Auto-redirect to user's portal
│  │  └─ If invalid: Clear token, show login form
│  └─ If no token: Show login form
├─ Check URL for redirect parameter
│  └─ Store intended destination for post-login redirect
├─ Display login form
└─ Focus on email input field

STEP 2: Email Input
├─ Email Field
│  ├─ Input type: email
│  ├─ Autocomplete: email
│  ├─ Validation on blur:
│  │  ├─ Required check
│  │  └─ Valid email format check
│  ├─ Visual states:
│  │  ├─ Default: Gray border
│  │  ├─ Focus: Blue border (pastel blue)
│  │  ├─ Error: Red border + error icon
│  │  └─ Valid: Blue border
│  └─ Error messages:
│     ├─ Empty: "Email is required"
│     └─ Invalid: "Please enter a valid email address"
└─ Remember email checkbox (optional)
   ├─ If checked: Save email to localStorage
   └─ Pre-fill on next visit

STEP 3: Password Input
├─ Password Field
│  ├─ Input type: password (toggleable)
│  ├─ Show/Hide button (eye icon)
│  │  ├─ Click to toggle visibility
│  │  └─ Icon changes: closed eye ↔ open eye
│  ├─ Validation:
│  │  └─ Required (no format check on login)
│  ├─ Autocomplete: current-password
│  └─ Error message:
│     └─ Empty: "Password is required"
└─ Forgot Password link
   ├─ Click opens password reset flow
   └─ Navigates to /forgot-password

STEP 4: Additional Options
├─ Remember Me Checkbox
│  ├─ If checked: Extended session (30 days)
│  ├─ If unchecked: Session expires on browser close
│  └─ Visual: Checkbox with label
└─ Login Button State
   ├─ Disabled if:
   │  ├─ Email is empty
   │  ├─ Password is empty
   │  └─ Form is submitting
   └─ Enabled: Blue background, white text

STEP 5: Form Submission
├─ User clicks "Login" button (or presses Enter)
├─ Client-side validation
│  ├─ Email format valid?
│  ├─ Password not empty?
│  └─ If validation fails: Show errors, stop
├─ If validation passes:
│  ├─ Disable form inputs
│  ├─ Button shows loading spinner
│  ├─ Button text: "Signing in..."
│  └─ Prevent multiple submissions
└─ API Call: POST /api/auth/login
   ├─ Payload: { email, password, rememberMe }
   ├─ Headers: { Content-Type: application/json }
   └─ Timeout: 10 seconds

STEP 6: Authentication Response Handling

├─ SUCCESS (Status 200)
│  ├─ Response contains:
│  │  ├─ token: JWT authentication token
│  │  ├─ user: { id, name, email, role, isFirstLogin }
│  │  └─ expiresIn: Token expiration time
│  ├─ Store authentication data:
│  │  ├─ localStorage.setItem('authToken', token)
│  │  ├─ localStorage.setItem('user', JSON.stringify(user))
│  │  └─ If rememberMe: Set long expiration
│  ├─ Update AuthContext state:
│  │  ├─ setUser(user)
│  │  ├─ setIsAuthenticated(true)
│  │  └─ setRole(user.role)
│  └─ Check user status:
│     ├─ If user.isFirstLogin === true:
│     │  ├─ Navigate to /first-login
│     │  └─ Show First Login Wizard
│     └─ If user.isFirstLogin === false:
│        ├─ Get user's role
│        └─ Redirect to appropriate portal:
│           ├─ admin/owner → /admin
│           ├─ hr → /hr
│           ├─ manager/supervisor/director/hod → /manager
│           └─ employee → /app
│
├─ ERROR RESPONSES
│  ├─ 401 Unauthorized - Invalid Credentials
│  │  ├─ Error message: "Invalid email or password"
│  │  ├─ Visual: Red alert banner at top of form
│  │  ├─ Increment failed attempt counter
│  │  ├─ If attempts >= 3:
│  │  │  ├─ Show CAPTCHA
│  │  │  └─ Or temporarily lock account (5 mins)
│  │  ├─ Clear password field
│  │  ├─ Focus on password field
│  │  └─ Re-enable form
│  │
│  ├─ 403 Forbidden - Account Pending
│  │  ├─ Error message: "Your account is pending admin approval"
│  │  ├─ Sub-message: "You'll receive an email when approved"
│  │  ├─ Visual: Yellow warning banner
│  │  └─ Show contact admin button
│  │
│  ├─ 403 Forbidden - Account Suspended
│  │  ├─ Error message: "Your account has been suspended"
│  │  ├─ Sub-message: "Please contact HR for assistance"
│  │  ├─ Visual: Red warning banner
│  │  └─ Show contact button
│  │
│  ├─ 429 Too Many Requests
│  │  ├─ Error message: "Too many login attempts"
│  │  ├─ Sub-message: "Please try again in X minutes"
│  │  ├─ Disable login button
│  │  └─ Show countdown timer
│  │
│  └─ 500 Server Error
│     ├─ Error message: "Login failed. Please try again"
│     ├─ Sub-message: "If problem persists, contact support"
│     ├─ Log error to monitoring service
│     └─ Re-enable form
│
└─ NETWORK ERROR
   ├─ No internet connection
   ├─ Error message: "No internet connection"
   ├─ Visual: Gray offline indicator
   └─ Re-enable form when connection restored

STEP 7: Post-Login Actions
├─ Log login event
│  ├─ Event: user_login
│  ├─ Timestamp: current time
│  ├─ IP address: user's IP
│  ├─ Device: browser info
│  └─ Location: geolocation (if permitted)
├─ Initialize user session
│  ├─ Load user preferences
│  ├─ Load theme preference (light/dark)
│  ├─ Set up real-time connections (if any)
│  └─ Preload critical data
├─ Show welcome message (toast)
│  └─ "Welcome back, [Name]!"
└─ Redirect to portal dashboard

STEP 8: Session Management
├─ Set up token refresh
│  ├─ Refresh token before expiration
│  ├─ Silent refresh in background
│  └─ Update localStorage with new token
├─ Set up activity tracking
│  ├─ Track user interactions
│  └─ Reset idle timer on activity
└─ Set up session timeout
   ├─ Default: 30 minutes inactivity
   ├─ Show warning at 25 minutes
   └─ Auto-logout at 30 minutes
```

#### Login Form UI Elements:

**Form Layout:**
```
┌────────────────────────────────────────────────────┐
│                 WELCOME BACK                           │
│         Sign in to your Probus account                │
├────────────────────────────────────────────────────┤
│                                                    │
│  Email Address                                     │
│  [_______________________________]                │
│                                                    │
│  Password                         👁              │
│  [_______________________________]                │
│                                                    │
│  ☐ Remember me        Forgot password?           │
│                                                    │
│  [            Sign In            ]                │
│                                                    │
│  ─────────── OR ───────────                    │
│                                                    │
│  Don't have an account? Register                  │
└────────────────────────────────────────────────────┘
```

#### Login States & Transitions:

```
State Machine:

IDLE (Initial)
  │
  ├─ User enters email → VALIDATING_EMAIL
  │  ├─ Valid → IDLE_WITH_EMAIL
  │  └─ Invalid → ERROR_EMAIL
  │
  ├─ User enters password → READY_TO_SUBMIT
  │
  ├─ User clicks submit → SUBMITTING
  │  ├─ Success → AUTHENTICATED
  │  │  ├─ First login → REDIRECTING_TO_WIZARD
  │  │  └─ Not first login → REDIRECTING_TO_PORTAL
  │  ├─ Invalid credentials → ERROR_AUTH
  │  ├─ Account pending → ERROR_PENDING
  │  ├─ Network error → ERROR_NETWORK
  │  └─ Server error → ERROR_SERVER
  │
  └─ Session exists → AUTO_REDIRECTING
```

### 3. Employee Onboarding Flow (Detailed)
**Entry Point:** `/onboarding`  
**Component:** `Onboarding.tsx`  
**For:** New employees (first-time setup)

#### Complete Onboarding Journey:

```
┌────────────────────────────────────────────────────────────┐
│              EMPLOYEE ONBOARDING WIZARD                     │
│                   Multi-Step Process                         │
└────────────────────────────────────────────────────────────┘

STEP 1: Welcome Screen (Step 1 of 8)
├─ Display welcome message
│  ├─ Company logo
│  ├─ "Welcome to [Company Name]!"
│  ├─  Employee name displayed
│  └─ Brief introduction to onboarding process
├─ Progress indicator: [▓░░░░░░░] 1/8
├─ Estimated time: "~15 minutes to complete"
├─ Navigation:
│  ├─ "Get Started" button (primary action)
│  └─ "Skip for now" link (saves progress, continues to portal)
└─ Auto-save enabled (all progress saved automatically)

STEP 2: Personal Information (Step 2 of 8)
├─ Progress: [▓▓░░░░░░] 2/8
├─ Pre-filled data from registration:
│  ├─ First Name (read-only)
│  ├─ Last Name (read-only)
│  └─ Email (read-only)
├─ Additional fields to complete:
│  ├─ Phone Number*
│  │  ├─ Format: Auto-formatted
│  │  ├─ Validation: Valid phone number
│  │  └─ Country code selection
│  ├─ Date of Birth*
│  │  ├─ Date picker component
│  │  ├─ Validation: Must be 18+ years
│  │  └─ Format: MM/DD/YYYY
│  ├─ Gender (Optional)
│  │  ├─ Dropdown: Male/Female/Other/Prefer not to say
│  │  └─ Privacy notice displayed
│  ├─ Address*
│  │  ├─ Street Address
│  │  ├─ City
│  │  ├─ State/Province
│  │  ├─ ZIP/Postal Code
│  │  └─ Country
│  └─ Emergency Contact*
│     ├─ Contact Name
│     ├─ Relationship
│     └─ Contact Phone
├─ Validation: All required fields must be filled
└─ Navigation:
   ├─ "Back" button (returns to Step 1)
   ├─ "Next" button (saves & continues)
   └─ "Save & Exit" link (saves progress, exits to portal)

STEP 3: Employment Details (Step 3 of 8)
├─ Progress: [▓▓▓░░░░░] 3/8
├─ Display assigned information:
│  ├─ Employee ID (auto-generated, read-only)
│  ├─ Start Date (from HR, read-only)
│  ├─ Department (assigned, read-only)
│  └─ Position/Title (assigned, read-only)
├─ Employment Type (read-only)
│  ├─ Full-time/Part-time/Contract
│  └─ Shows benefits eligibility
├─ Work Location
│  ├─ Office/Remote/Hybrid (if applicable)
│  └─ If Hybrid: Select office days
├─ Direct Manager (assigned, read-only)
│  ├─ Shows manager's name
│  ├─ Shows manager's contact
│  └─ "Send introduction message" button
└─ Review and confirm employment details

STEP 4: Documents Upload (Step 4 of 8)
├─ Progress: [▓▓▓▓░░░░] 4/8
├─ Required Documents:
│  ├─ Government-issued ID*
│  │  ├─ Accepted: Passport, Driver's License, National ID
│  │  ├─ File types: PDF, JPG, PNG
│  │  ├─ Max size: 5MB
│  │  ├─ Upload interface: Drag & drop or click to browse
│  │  └─ Preview after upload
│  ├─ Tax Forms*
│  │  ├─ W-4 (US) or equivalent
│  │  ├─ Pre-filled form template available
│  │  └─ Fill online or upload completed form
│  ├─ Bank Details (for direct deposit)*
│  │  ├─ Bank Name
│  │  ├─ Account Number
│  │  ├─ Routing Number
│  │  ├─ Account Type (Checking/Savings)
│  │  └─ Void check upload (optional)
│  └─ Proof of Education (if required)
│     ├─ Degree certificates
│     ├─ Transcripts
│     └─ Professional certifications
├─ Optional Documents:
│  ├─ Professional licenses
│  ├─ Vaccination records
│  └─ Background check consent
├─ Upload progress indicators for each document
├─ Document verification status:
│  ├─ Uploaded ✓
│  ├─ Pending review ⏳
│  └─ Approved/Rejected ✓/✗
└─ Security notice: "All documents are encrypted and stored securely"

STEP 5: Company Policies & Handbook (Step 5 of 8)
├─ Progress: [▓▓▓▓▓░░░] 5/8
├─ Display policies to review:
│  ├─ Employee Handbook
│  │  ├─ Embedded PDF viewer
│  │  ├─ Table of contents navigation
│  │  ├─ Search functionality
│  │  ├─ Download option
│  │  └─ Bookmark feature
│  ├─ Code of Conduct*
│  │  ├─ Must read to continue
│  │  ├─ Scroll tracking (must reach end)
│  │  └─ Acknowledgment checkbox required
│  ├─ Privacy Policy*
│  │  ├─ GDPR/Privacy compliance info
│  │  └─ Data handling procedures
│  ├─ IT & Security Policies*
│  │  ├─ Acceptable use policy
│  │  ├─ Password requirements
│  │  ├─ Device usage
│  │  └─ Data security guidelines
│  └─ Benefits Information
│     ├─ Health insurance
│     ├─ Retirement plans
│     ├─ Paid time off
│     └─ Other perks
├─ Acknowledgment Section:
│  ├─ ☐ "I have read and understood the Employee Handbook"*
│  ├─ ☐ "I agree to abide by the Code of Conduct"*
│  ├─ ☐ "I acknowledge the Privacy Policy"*
│  └─ ☐ "I agree to IT & Security Policies"*
├─ Digital signature:
│  ├─ Name (auto-filled)
│  ├─ Date (auto-filled)
│  └─ Signature capture (type name to sign)
└─ All policies stored with timestamps for legal compliance

STEP 6: Benefits Enrollment (Step 6 of 8)
├─ Progress: [▓▓▓▓▓▓░░] 6/8
├─ Health Insurance (if eligible)
│  ├─ Plan options displayed:
│  │  ├─ Basic Plan
│  │  ├─ Standard Plan
│  │  └─ Premium Plan
│  ├─ Each plan shows:
│  │  ├─ Monthly premium
│  │  ├─ Coverage details
│  │  ├─ Deductible
│  │  └─ Co-pay info
│  ├─ Add dependents:
│  │  ├─ Spouse
│  │  └─ Children
│  └─ Cost calculator shows total monthly cost
├─ Retirement Plan (401k or equivalent)
│  ├─ Contribution percentage selector
│  ├─ Company match information
│  ├─ Investment options
│  └─ Calculator shows projected growth
├─ Other Benefits:
│  ├─ Dental insurance
│  ├─ Vision insurance
│  ├─ Life insurance
│  ├─ Disability insurance
│  └─ FSA/HSA options
├─ Option to skip:
│  └─ "I'll enroll later" (must enroll within 30 days)
└─ Summary of selected benefits with costs

STEP 7: System Setup & Preferences (Step 7 of 8)
├─ Progress: [▓▓▓▓▓▓▓░] 7/8
├─ Profile Picture
│  ├─ Upload photo or use avatar
│  ├─ Crop/resize tool
│  ├─ Preview in different sizes
│  └─ File requirements: JPG/PNG, max 2MB
├─ Theme Preference
│  ├─ Light mode
│  ├─ Dark mode
│  └─ Auto (system preference)
├─ Notification Preferences
│  ├─ Email notifications
│  │  ├─ Task assignments
│  │  ├─ Approvals
│  │  ├─ Messages
│  │  └─ Company announcements
│  ├─ In-app notifications
│  │  ├─ Real-time alerts
│  │  └─ Frequency settings
│  └─ Browser notifications (requires permission)
├─ Working Hours & Availability
│  ├─ Set typical work hours
│  ├─ Time zone selection
│  └─ Out-of-office auto-responder setup
├─ Language & Locale
│  ├─ Preferred language
│  ├─ Date format
│  └─ Number format
└─ Accessibility Options
   ├─ Font size
   ├─ High contrast mode
   └─ Screen reader support

STEP 8: Review & Complete (Step 8 of 8)
├─ Progress: [▓▓▓▓▓▓▓▓] 8/8
├─ Summary of all entered information:
│  ├─ Personal Information ✓
│  ├─ Employment Details ✓
│  ├─ Documents Uploaded ✓ (3/3 required)
│  ├─ Policies Acknowledged ✓
│  ├─ Benefits Selected ✓
│  └─ Preferences Set ✓
├─ Edit links for each section
├─ Important next steps:
│  ├─ IT will set up your email (within 24 hours)
│  ├─ Manager will contact you with first assignments
│  ├─ HR orientation scheduled for [Date]
│  └─ Access to full employee portal granted
├─ Final confirmation:
│  └─ "I confirm all information is accurate"*
└─ "Complete Onboarding" button
   ├─ Submits all data
   ├─ Sends confirmation email
   ├─ Notifies HR & Manager
   ├─ Updates employee status to "Active"
   └─ Redirects to Employee Portal Dashboard

Post-Onboarding:
├─ Welcome email sent with:
│  ├─ Login credentials reminder
│  ├─ Quick start guide
│  ├─ Important contacts
│  └─ Links to resources
├─ Manager notified:
│  ├─ Employee has completed onboarding
│  └─ Ready for first day
├─ HR dashboard updated:
│  ├─ Onboarding status: Complete
│  └─ All documents reviewed
└─ Employee gains full portal access
```

#### Onboarding Progress Tracking:

```
Progress Persistence:
├─ All data auto-saved to localStorage
├─ Synced to server every 30 seconds
├─ User can exit and resume anytime
├─ Progress indicator shows completion %
├─ "Resume Onboarding" prompt on login if incomplete
└─ Admin/HR can view onboarding status in real-time
```

---

## Admin Portal Flow

**Base Route:** `/admin`
**Roles:** Admin, Owner

### Dashboard
```
Admin Dashboard
  ├─ View Overview Statistics
  │  ├─ Total Employees
  │  ├─ Pending Approvals
  │  ├─ Active Departments
  │  └─ System Health
  └─ Quick Actions
      ├─ Clock In/Out
      └─ View Recent Activity
```

### Navigation Menu
```
Admin Portal Navigation
  ├─ Approvals (/admin/approvals)
  │  └─ Review and approve/reject employee requests
  ├─ Notifications (/notifications)
  │  └─ View system notifications
  ├─ Safety & AI (/safety)
  │  ├─ AI Monitoring Dashboard
  │  ├─ Productivity Analytics
  │  └─ Safety Compliance
  ├─ Employees (/employees)
  │  ├─ View all employees
  │  ├─ Filter and search
  │  └─ View employee details
  ├─ Pending Registrations (/pending-employees)
  │  ├─ Review new registration requests
  │  └─ Approve/Reject accounts
  ├─ Departments (/departments)
  │  ├─ View all departments
  │  ├─ Create new department
  │  ├─ Edit department details
  │  └─ Assign employees
  ├─ Notices (/notices)
  │  ├─ Create company-wide notices
  │  ├─ Edit existing notices
  │  └─ Delete notices
  └─ Settings (/settings)
      ├─ Company Settings
      ├─ Security Settings
      ├─ Notification Settings
      └─ Permissions Management
```

### Approval Flow
```
Admin Approvals
  ├─ View pending approvals
  ├─ Select approval item
  ├─ Review details
  │  ├─ Employee information
  │  ├─ Request type (leave, overtime, etc.)
  │  └─ Supporting documents
  ├─ Make decision
  │  ├─ Approve → Update status → Notify employee
  │  └─ Reject → Add reason → Notify employee
  └─ Return to approvals list
```

---

## HR Portal Flow

**Base Route:** `/hr`
**Roles:** HR

### Dashboard
```
HR Dashboard
  ├─ HR Overview Statistics
  │  ├─ Total Employees
  │  ├─ Pending Approvals
  │  ├─ Active Recruitment
  │  ├─ New Hires
  │  └─ Pending Onboarding
  └─ Quick Actions
      └─ Clock In/Out
```

### Navigation Menu
```
HR Portal Navigation
  ├─ Dashboard
  ├─ My Work (Approvals)
  │  └─ HR-specific approval requests
  ├─ Tasks
  │  └─ HR task management
  ├─ Leave
  │  └─ Leave request management
  ├─ Notifications
  ├─ Directory
  │  ├─ Search employees
  │  ├─ View employee profiles
  │  └─ Quick actions (Message/Call)
  ├─ Employees
  │  ├─ Employee Management
  │  ├─ View employee list
  │  └─ Employee details
  ├─ Whistleblower
  │  └─ Review anonymous reports
  └─ Settings
```

### Employee Management Flow
```
HR Employee Management
  ├─ View employee list
  ├─ Filter employees
  │  ├─ By department
  │  ├─ By status
  │  └─ By hire date
  ├─ Select employee
  ├─ View/Edit employee details
  │  ├─ Personal information
  │  ├─ Employment details
  │  ├─ Documents
  │  └─ Performance records
  └─ Save changes
```

---

## Manager/Leadership Portal Flow

**Base Route:** `/manager` or `/leadership`
**Roles:** Manager, Supervisor, Director, Head of Department

### Dashboard
```
Manager Dashboard
  ├─ Team Overview Statistics
  │  ├─ Team Members
  │  ├─ Pending Approvals
  │  └─ Team Performance
  └─ Quick Actions
      └─ Clock In/Out
```

### Navigation Menu
```
Manager Portal Navigation
  ├─ Dashboard
  ├─ My Work (Approvals)
  │  └─ Team approval requests
  ├─ Tasks
  │  └─ Task management
  ├─ Leave
  │  └─ Team leave management
  ├─ Notifications
  ├─ Directory
  │  └─ Company directory
  ├─ Team
  │  ├─ View team members
  │  ├─ Team performance
  │  └─ Team assignments
  ├─ Whistleblower
  │  └─ Review reports (if authorized)
  └─ Settings
```

### Team Management Flow
```
Manager Team Management
  ├─ View team members
  ├─ Select team member
  ├─ View details
  │  ├─ Current tasks
  │  ├─ Performance metrics
  │  └─ Attendance record
  ├─ Assign tasks
  ├─ Review work
  └─ Provide feedback
```

### Approval Flow (Manager)
```
Manager Approvals
  ├─ View pending team requests
  ├─ Select request
  ├─ Review details
  ├─ Make decision
  │  ├─ Approve → Goes to HR/Admin (if required)
  │  └─ Reject → Notify employee
  └─ Return to approvals
```

---

## Employee Portal Flow

**Base Route:** `/app`
**Roles:** Employee

### Dashboard
```
Employee Dashboard
  ├─ Personal Statistics
  │  ├─ Pending Tasks
  │  └─ Completed Tasks
  └─ Quick Actions
      └─ Clock In/Out
```

### Navigation Menu
```
Employee Portal Navigation
  ├─ Dashboard
  ├─ My Work (Approvals)
  │  ├─ View my requests
  │  ├─ Request status
  │  └─ Create new request
  ├─ Tasks
  │  ├─ View assigned tasks
  │  ├─ Create personal task
  │  ├─ Update task status
  │  └─ Complete tasks
  ├─ Leave
  │  ├─ Request leave
  │  ├─ View leave balance
  │  └─ Leave history
  ├─ Notifications
  ├─ Directory
  │  ├─ Search colleagues
  │  └─ Contact employees (Message/Call → Opens Floating Chat)
  ├─ Whistleblower
  │  └─ Submit anonymous report
  └─ Settings
      ├─ Profile settings
      ├─ Notification preferences
      └─ Theme settings
```

### Leave Request Flow
```
Employee Leave Request
  ├─ Navigate to Leave Management
  ├─ Click "Request Leave"
  ├─ Fill request form
  │  ├─ Leave type
  │  ├─ Start date
  │  ├─ End date
  │  ├─ Reason
  │  └─ Upload documents (optional)
  ├─ Submit request
  ├─ Request goes to Manager
  │  ├─ Manager approves → Goes to HR
  │  │  └─ HR approves → Request approved
  │  └─ Manager/HR rejects → Request rejected
  └─ Employee receives notification
```

### Task Management Flow
```
Employee Task Management
  ├─ View task list
  │  ├─ Personal tasks
  │  ├─ Assigned tasks
  │  └─ Group tasks
  ├─ Select task
  ├─ View task details
  ├─ Update status
  │  ├─ To Do
  │  ├─ In Progress
  │  └─ Completed
  └─ Add time spent
```

### Whistleblower Report Flow
```
Whistleblower Reporting
  ├─ Navigate to Whistleblower
  ├─ Fill report form
  │  ├─ Subject
  │  ├─ Category
  │  ├─ Detailed description
  │  └─ Choose anonymity
  │     ├─ Anonymous → No contact info
  │     └─ Non-anonymous → Provide contact
  ├─ Submit report
  ├─ Report goes to compliance team
  └─ Employee receives confirmation
```

---

## Cross-Portal Features

### 1. Floating Chat
**Access:** Global (all portals)

```
Floating Chat Flow
  ├─ Click message icon (or from Directory)
  ├─ Chat window opens
  ├─ Select conversation type
  │  ├─ Direct Chat → Select employee → Start chat
  │  └─ Group Chat → Select group → Join/Create
  ├─ Send message
  │  ├─ Text message
  │  ├─ File attachment
  │  └─ Voice/Video call (if initiated)
  ├─ Minimize/Maximize chat
  └─ Close chat
```

### 2. Directory Integration
**Access:** All portals

```
Directory Flow
  ├─ Navigate to Directory
  ├─ Search employees
  │  ├─ By name
  │  ├─ By department
  │  └─ By position
  ├─ View employee card
  ├─ Quick actions
  │  ├─ Message → Opens Floating Chat
  │  └─ Call → Opens Floating Chat (voice call)
  └─ View full profile (if authorized)
```

### 3. Notifications
**Access:** All portals

```
Notifications Flow
  ├─ Click notifications icon
  ├─ View notifications list
  │  ├─ Unread notifications
  │  └─ Read notifications
  ├─ Select notification
  ├─ View details
  ├─ Take action (if applicable)
  │  ├─ Approve/Reject
  │  └─ View related item
  └─ Mark as read
```

### 4. Time Tracking
**Access:** Employee, Manager, HR portals

```
Time Tracking Flow
  ├─ Click "Clock In" button
  ├─ System captures location (if enabled)
  ├─ Record clock-in time
  ├─ Work session active
  │  ├─ Option to take break
  │  └─ Break time tracked separately
  ├─ Click "Clock Out" button
  ├─ System captures location
  ├─ Record clock-out time
  └─ Calculate total work hours
```

### 5. Apps Integration
**Access:** Employee Portal

```
Apps Integration Flow
  ├─ Navigate to Apps
  ├─ View connected integrations
  ├─ Click "Launch App" on any integration
  ├─ Opens Floating Chat
  └─ Chat available for communication
```

### 6. Theme Toggle
**Access:** All portals

```
Theme Toggle Flow
  ├─ Click theme toggle icon (sidebar)
  ├─ System switches theme
  │  ├─ Light mode
  │  └─ Dark mode
  └─ Preference saved
```

### 7. Command Palette
**Access:** All portals (Ctrl+K)

```
Command Palette Flow
  ├─ Press Ctrl+K
  ├─ Command palette opens
  ├─ Type to search
  │  ├─ Navigation commands
  │  ├─ Quick actions
  │  └─ Employee search
  ├─ Select command
  └─ Execute action
```

---

## Common User Journeys

### Journey 1: New Employee First Day
```
1. Employee receives registration link
2. Completes registration form
3. Account pending admin approval
4. Admin approves account
5. Employee receives approval notification
6. Employee logs in (first time)
7. First Login Wizard guides setup
8. Redirected to Onboarding flow
9. Completes onboarding steps
10. Access to Employee Portal granted
11. Employee clocks in for first time
12. Starts working on assigned tasks
```

### Journey 2: Leave Request Approval Chain
```
1. Employee submits leave request
2. Manager receives notification
3. Manager reviews and approves request
4. HR receives notification
5. HR reviews and approves request
6. Employee receives approval notification
7. Leave is added to calendar
8. Manager and HR can see leave on schedule
```

### Journey 3: Admin Managing Employees
```
1. Admin logs in to Admin Portal
2. Views dashboard statistics
3. Navigates to Pending Registrations
4. Reviews new employee registration
5. Approves registration
6. Navigates to Employees
7. Views all employees
8. Assigns employee to department
9. Employee receives department assignment notification
10. Manager receives new team member notification
```

### Journey 4: HR Onboarding New Employee
```
1. HR receives notification of approved employee
2. HR navigates to Employees
3. Initiates onboarding process
4. Uploads employee documents
5. Assigns manager to employee
6. Sets up employee profile
7. Sends welcome email with login credentials
8. Employee completes onboarding
9. HR marks onboarding as complete
```

---

## Error Handling & Edge Cases

### 1. Unauthorized Access
```
User attempts to access restricted page
  ├─ System checks user role
  ├─ Role not authorized
  ├─ Redirect to appropriate portal
  └─ Show error message
```

### 2. Session Timeout
```
User session expires
  ├─ User attempts action
  ├─ System detects expired session
  ├─ Redirect to login page
  └─ Show "Session expired" message
```

### 3. Network Error
```
Network connection lost
  ├─ System detects network error
  ├─ Show offline indicator
  ├─ Queue actions (if possible)
  └─ Retry when connection restored
```

### 4. Form Validation Errors
```
User submits invalid form
  ├─ System validates input
  ├─ Validation fails
  ├─ Highlight error fields
  ├─ Show error messages
  └─ User corrects errors → Resubmit
```

---

## Mobile Responsiveness

All portals are responsive and adapt to mobile devices:
- Collapsible sidebars
- Mobile-optimized navigation
- Touch-friendly buttons
- Responsive tables and cards
- Mobile menu toggle

---

## Security & Permissions

### Role-Based Access Control (RBAC)
- Each portal has specific role requirements
- Routes are protected by role checks
- Unauthorized access is redirected
- Sensitive actions require re-authentication

### Data Privacy
- Employee data visible only to authorized roles
- Whistleblower reports are anonymous
- Personal information is protected
- Audit logs track all sensitive actions

---

## Future Enhancements

Potential user flows for future versions:
- Performance review cycle
- Training and certification tracking
- Asset management
- Expense reimbursement
- Advanced analytics and reporting
- Mobile app integration
- API integrations with external systems

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Application:** Probus MVP
