import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRole = 'admin' | 'employee' | 'manager' | 'hr' | null;

interface User {
    email: string;
    role: UserRole;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, role: UserRole) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const checkSession = () => {
            const role = localStorage.getItem('userRole') as UserRole;
            const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
            const isEmployee = localStorage.getItem('isEmployeeLoggedIn') === 'true';
            const isManager = localStorage.getItem('isManagerLoggedIn') === 'true';
            const isHR = localStorage.getItem('isHRLoggedIn') === 'true';

            if (role && (isAdmin || isEmployee || isManager || isHR)) {
                // In a real app, we would validate the token here
                setUser({
                    email: 'user@example.com', // Placeholder, ideally stored in local storage or JWT
                    role: role,
                });
            }
            setIsLoading(false);
        };

        checkSession();
    }, []);

    const login = (email: string, role: UserRole) => {
        setUser({ email, role });
        localStorage.setItem('userRole', role || '');

        // Maintain backward compatibility with existing code that checks these specific keys
        if (role === 'admin') localStorage.setItem('isAdminLoggedIn', 'true');
        if (role === 'employee') localStorage.setItem('isEmployeeLoggedIn', 'true');
        if (role === 'manager') localStorage.setItem('isManagerLoggedIn', 'true');
        if (role === 'hr') localStorage.setItem('isHRLoggedIn', 'true');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('isEmployeeLoggedIn');
        localStorage.removeItem('isManagerLoggedIn');
        localStorage.removeItem('isHRLoggedIn');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
