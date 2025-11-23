import { IDBPDatabase } from 'idb';
import { Database } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const seedDatabase = async (db: IDBPDatabase<any>) => {
    // Check if we already have data in key tables
    const employeeCount = await db.count('employees');
    if (employeeCount > 0) return;

    console.log('Seeding database with initial data...');

    const now = new Date().toISOString();

    // Departments
    const departments = [
        { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Engineering', description: 'Software Development', manager_id: null, created_at: now, updated_at: now },
        { id: '550e8400-e29b-41d4-a716-446655440001', name: 'HR', description: 'Human Resources', manager_id: null, created_at: now, updated_at: now },
        { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Sales', description: 'Sales and Marketing', manager_id: null, created_at: now, updated_at: now }
    ];

    for (const dept of departments) {
        await db.put('departments', dept);
    }

    // Users
    const users = [
        {
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: 'john@example.com',
            password_hash: 'hashed_password',
            name: 'John Doe',
            role: 'employee',
            department_id: '550e8400-e29b-41d4-a716-446655440000',
            status: 'active',
            created_at: now,
            updated_at: now
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440001',
            email: 'jane@example.com',
            password_hash: 'hashed_password',
            name: 'Jane Smith',
            role: 'hr',
            department_id: '550e8400-e29b-41d4-a716-446655440001',
            status: 'active',
            created_at: now,
            updated_at: now
        },
        {
            id: 'admin-user-id',
            email: 'admin@example.com',
            password_hash: 'hashed_password',
            name: 'Admin User',
            role: 'admin',
            department_id: null,
            status: 'active',
            created_at: now,
            updated_at: now
        }
    ];

    for (const user of users) {
        await db.put('users', user);
    }

    // AI Events
    const aiEvents = [
        {
            id: 'event-1',
            event_type: 'login',
            category: 'security',
            severity: 'low',
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            user_role: 'employee',
            action: 'login_attempt',
            description: 'User logged in successfully',
            created_at: now
        }
    ];

    for (const event of aiEvents) {
        await db.put('ai_events', event);
    }

    // AI Alerts
    const aiAlerts = [
        {
            id: 'alert-1',
            type: 'security_breach',
            severity: 'high',
            title: 'Suspicious Login',
            description: 'Multiple failed login attempts detected',
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            status: 'open',
            created_at: now,
            updated_at: now
        }
    ];

    for (const alert of aiAlerts) {
        await db.put('ai_alerts', alert);
    }

    // Employees
    const employees = [
        {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'John Doe',
            position: 'Senior Developer',
            department_id: '550e8400-e29b-41d4-a716-446655440000',
            email: 'john@example.com',
            created_at: now,
            updated_at: now,
            level: 'L3',
            status: 'active'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Jane Smith',
            position: 'HR Manager',
            department_id: '550e8400-e29b-41d4-a716-446655440001',
            email: 'jane@example.com',
            created_at: now,
            updated_at: now,
            level: 'M1',
            status: 'active'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440002',
            name: 'Bob Johnson',
            position: 'Sales Director',
            department_id: '550e8400-e29b-41d4-a716-446655440002',
            email: 'bob@example.com',
            created_at: now,
            updated_at: now,
            level: 'D1',
            status: 'active'
        }
    ];

    for (const emp of employees) {
        await db.put('employees', emp);
    }

    // Chat Groups
    const chatGroups = [
        { id: 'group-1', name: 'General', description: 'General discussion', created_at: now },
        { id: 'group-2', name: 'Engineering', description: 'Engineering team', created_at: now },
        { id: 'group-3', name: 'Announcements', description: 'Company announcements', created_at: now }
    ];

    for (const group of chatGroups) {
        await db.put('chat_groups', group);
    }

    console.log('Database seeding completed.');
};
