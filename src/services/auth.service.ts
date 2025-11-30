import { supabase } from './supabase.frontend.service';
import { Database } from '../types/database.types';

export interface User {
  id: string;
  email: string;
  role: 'officer' | 'admin';
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export class AuthService {
  // Sign up a new user
  static async signUp(email: string, password: string, role: 'officer' | 'admin' = 'officer'): Promise<AuthResponse> {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return {
          success: false,
          message: authError.message,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Failed to create user account',
        };
      }

      // 2. Create user profile in our users table
      // Note: We use upsert here because sometimes the trigger might have already created the user
      // or if the user was deleted from auth but not from public.users
      const { data: userData, error: userError } = await (supabase
        .from('users') as any)
        .upsert({
          id: authData.user.id,
          email: authData.user.email!,
          role: role,
        }, { onConflict: 'id' })
        .select()
        .single();

      if (userError) {
        console.error('Failed to create user profile:', userError);
        // Auth user was created but profile failed - they can still sign in
        return {
          success: true,
          message: 'Account created successfully. Please check your email to verify your account.',
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            role: 'officer', // default role
            created_at: authData.user.created_at,
          },
        };
      }

      return {
        success: true,
        message: 'Account created successfully. Please check your email to verify your account.',
        user: userData,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
      };
    }
  }

  // Sign in existing user
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return {
          success: false,
          message: authError.message,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Get user profile from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      const user: User = userData || {
        id: authData.user.id,
        email: authData.user.email!,
        role: 'officer', // default role
        created_at: authData.user.created_at,
      };

      return {
        success: true,
        message: 'Signed in successfully',
        user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
      };
    }
  }

  // Sign out user
  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: true,
        message: 'Signed out successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
      };
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        return null;
      }

      // Get user profile from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError || !userData) {
        // Return basic user info if profile doesn't exist
        return {
          id: authUser.id,
          email: authUser.email!,
          role: 'officer', // default role
          created_at: authUser.created_at,
        };
      }

      return userData;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // Reset password
  static async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/reset-password`
        : 'http://localhost:3000/reset-password'; // fallback for server-side
        
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
      };
    }
  }
}
