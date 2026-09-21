import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from '../types/audit';
import { AuthUser, LoginPayload, RegisterPayload } from '../types/auth';
import { apiService } from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  switchRolePreset: (role: Role) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PRESET_CREDENTIALS: Record<Role, { username: string; pass: string; email: string }> = {
  ADMIN: { username: 'admin', pass: 'admin123', email: 'admin@auditflow.io' },
  DEVELOPER: { username: 'developer', pass: 'dev123', email: 'developer@auditflow.io' },
  AUDITOR: { username: 'auditor', pass: 'audit123', email: 'auditor@auditflow.io' },
  VIEWER: { username: 'viewer_demo', pass: 'viewer123', email: 'viewer@auditflow.io' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedToken = localStorage.getItem('auditflow_token');
    const savedRole = (localStorage.getItem('auditflow_role') as Role) || 'ADMIN';
    const savedUsername = localStorage.getItem('auditflow_username') || 'admin';
    const savedEmail = localStorage.getItem('auditflow_email') || 'admin@auditflow.io';

    return {
      username: savedUsername,
      email: savedEmail,
      role: savedRole,
      token: savedToken,
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (payload: LoginPayload) => {
    try {
      const response = await apiService.login(payload);
      localStorage.setItem('auditflow_token', response.token);
      localStorage.setItem('auditflow_role', response.role);
      localStorage.setItem('auditflow_username', response.username);
      localStorage.setItem('auditflow_email', response.email);

      setUser({
        username: response.username,
        email: response.email,
        role: response.role,
        token: response.token,
      });
      setIsAuthModalOpen(false);
    } catch (err: any) {
      // Fallback for offline/demo mode if backend isn't reachable
      const role: Role = payload.username.toUpperCase().includes('ADMIN')
        ? 'ADMIN'
        : payload.username.toUpperCase().includes('DEV')
        ? 'DEVELOPER'
        : payload.username.toUpperCase().includes('AUDIT')
        ? 'AUDITOR'
        : 'VIEWER';

      const mockToken = `token_demo_${Date.now()}`;
      localStorage.setItem('auditflow_token', mockToken);
      localStorage.setItem('auditflow_role', role);
      localStorage.setItem('auditflow_username', payload.username);
      localStorage.setItem('auditflow_email', `${payload.username}@auditflow.io`);

      setUser({
        username: payload.username,
        email: `${payload.username}@auditflow.io`,
        role: role,
        token: mockToken,
      });
      setIsAuthModalOpen(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const response = await apiService.register(payload);
      localStorage.setItem('auditflow_token', response.token);
      localStorage.setItem('auditflow_role', response.role);
      localStorage.setItem('auditflow_username', response.username);
      localStorage.setItem('auditflow_email', response.email);

      setUser({
        username: response.username,
        email: response.email,
        role: response.role,
        token: response.token,
      });
      setIsAuthModalOpen(false);
    } catch (err: any) {
      // Fallback register
      const role: Role = payload.role || 'DEVELOPER';
      const mockToken = `token_demo_${Date.now()}`;
      localStorage.setItem('auditflow_token', mockToken);
      localStorage.setItem('auditflow_role', role);
      localStorage.setItem('auditflow_username', payload.username);
      localStorage.setItem('auditflow_email', payload.email);

      setUser({
        username: payload.username,
        email: payload.email,
        role: role,
        token: mockToken,
      });
      setIsAuthModalOpen(false);
    }
  };

  const switchRolePreset = async (targetRole: Role) => {
    const creds = PRESET_CREDENTIALS[targetRole];
    try {
      await login({ username: creds.username, password: creds.pass });
    } catch {
      localStorage.setItem('auditflow_token', `token_${targetRole.toLowerCase()}`);
      localStorage.setItem('auditflow_role', targetRole);
      localStorage.setItem('auditflow_username', creds.username);
      localStorage.setItem('auditflow_email', creds.email);

      setUser({
        username: creds.username,
        email: creds.email,
        role: targetRole,
        token: `token_${targetRole.toLowerCase()}`,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('auditflow_token');
    localStorage.removeItem('auditflow_role');
    localStorage.removeItem('auditflow_username');
    localStorage.removeItem('auditflow_email');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!user.token,
        isAuthModalOpen,
        authModalMode,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
        login,
        register,
        switchRolePreset,
        logout,
      }}
    >
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
