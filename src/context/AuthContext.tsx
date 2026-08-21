'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>({
    id: 'usr-admin-01',
    name: 'Shree Vallabh',
    email: 'admin@gaushala.org',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  });

  const [role, setRoleState] = useState<UserRole>('admin');

  useEffect(() => {
    const savedRole = localStorage.getItem('gaushala_role') as UserRole;
    if (savedRole && ['admin', 'manager', 'staff', 'vet'].includes(savedRole)) {
      setRoleState(savedRole);
      if (user) setUser(prev => prev ? { ...prev, role: savedRole } : null);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('gaushala_role', newRole);
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const login = (email: string, selectedRole: UserRole) => {
    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0].toUpperCase() || 'Staff User',
      email,
      role: selectedRole
    };
    setUser(newUser);
    setRole(selectedRole);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      setRole,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
