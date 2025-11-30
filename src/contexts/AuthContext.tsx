import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, User } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (email: string, password: string, role?: 'officer' | 'admin') => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app start
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await AuthService.signIn(email, password);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return { success: response.success, message: response.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Sign in failed' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: 'officer' | 'admin' = 'officer') => {
    setLoading(true);
    try {
      const response = await AuthService.signUp(email, password, role);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return { success: response.success, message: response.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Sign up failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await AuthService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await AuthService.resetPassword(email);
      return { success: response.success, message: response.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Password reset failed' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
