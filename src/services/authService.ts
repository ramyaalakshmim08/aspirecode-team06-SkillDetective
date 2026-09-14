// =============================================================================
// Skill Detective — Authentication Service
// Bridges Supabase Auth and Local Development Storage Engine
// =============================================================================

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { StorageAdapter, StoredUserAccount } from './storageAdapter';
import { Profile, User } from '../types';

export interface AuthSession {
  user: User;
  profile: Profile;
}

export class AuthService {
  /**
   * Register a new student or admin account
   */
  public static async signUp(
    email: string, 
    password: string, 
    fullName: string
  ): Promise<{ session: AuthSession | null; error: string | null }> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Production Supabase Auth if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: fullName }
          }
        });

        if (error) return { session: null, error: error.message };
        if (!data.user) return { session: null, error: 'Registration failed to create user.' };

        // Determine role (check if matches initial admin env)
        const initialAdminEmail = import.meta.env.VITE_INITIAL_ADMIN_EMAIL?.toLowerCase();
        const role = (initialAdminEmail && cleanEmail === initialAdminEmail) ? 'admin' : 'student';

        // Check or insert profile into PostgreSQL
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        let profile: Profile;
        if (!profileData) {
          const { data: newProfile, error: profileErr } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: cleanEmail,
              full_name: fullName,
              role,
              level: 1,
              xp: 0,
              lives: 4,
              max_lives: 4,
              onboarding_completed: false
            })
            .select()
            .single();

          if (profileErr) return { session: null, error: profileErr.message };
          profile = newProfile;
        } else {
          profile = profileData;
        }

        const user: User = {
          id: data.user.id,
          email: cleanEmail,
          role,
          createdAt: data.user.created_at
        };

        StorageAdapter.setCurrentUserId(user.id);
        return { session: { user, profile }, error: null };
      } catch (err: any) {
        return { session: null, error: err.message || 'An unexpected error occurred during signup.' };
      }
    }

    // 2. Local Multi-User Storage Adapter (Zero-config dev mode)
    const existing = StorageAdapter.getUserByEmail(cleanEmail);
    if (existing) {
      return { session: null, error: 'An account with this email address already exists.' };
    }

    if (password.length < 6) {
      return { session: null, error: 'Password must be at least 6 characters long.' };
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const initialAdminEmail = import.meta.env.VITE_INITIAL_ADMIN_EMAIL?.toLowerCase();
    const role = (initialAdminEmail && cleanEmail === initialAdminEmail) ? 'admin' : 'student';

    const newAccount: StoredUserAccount = {
      id: userId,
      email: cleanEmail,
      passwordHash: btoa(password), // Simple encoding for local test simulation
      fullName,
      role,
      createdAt: new Date().toISOString()
    };

    StorageAdapter.saveUser(newAccount);
    const profile = StorageAdapter.createInitialProfile(userId, cleanEmail, fullName, role);
    StorageAdapter.setCurrentUserId(userId);

    const user: User = {
      id: userId,
      email: cleanEmail,
      role,
      createdAt: newAccount.createdAt
    };

    return { session: { user, profile }, error: null };
  }

  /**
   * Log into an existing account
   */
  public static async signIn(
    email: string, 
    password: string
  ): Promise<{ session: AuthSession | null; error: string | null }> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Supabase Auth
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) return { session: null, error: error.message };
        if (!data.user) return { session: null, error: 'User account not found.' };

        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileErr || !profile) {
          return { session: null, error: 'Failed to retrieve user profile.' };
        }

        const user: User = {
          id: data.user.id,
          email: cleanEmail,
          role: profile.role || 'student',
          createdAt: data.user.created_at
        };

        StorageAdapter.setCurrentUserId(user.id);
        return { session: { user, profile }, error: null };
      } catch (err: any) {
        return { session: null, error: err.message || 'Authentication failed.' };
      }
    }

    // 2. Local Storage Adapter
    const account = StorageAdapter.getUserByEmail(cleanEmail);
    if (!account) {
      return { session: null, error: 'No account found with this email address.' };
    }

    if (account.passwordHash !== btoa(password)) {
      return { session: null, error: 'Invalid password. Please check your credentials.' };
    }

    let profile = StorageAdapter.getProfile(account.id);
    if (!profile) {
      profile = StorageAdapter.createInitialProfile(account.id, account.email, account.fullName, account.role);
    }

    StorageAdapter.setCurrentUserId(account.id);

    const user: User = {
      id: account.id,
      email: account.email,
      role: account.role,
      createdAt: account.createdAt
    };

    return { session: { user, profile }, error: null };
  }

  /**
   * Signs out the current active session
   */
  public static async signOut(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase signOut error:', err);
      }
    }
    StorageAdapter.setCurrentUserId(null);
  }

  /**
   * Retrieves current active session if one exists
   */
  public static async getCurrentSession(): Promise<AuthSession | null> {
    // 1. Supabase Auth
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (profile) {
            StorageAdapter.setCurrentUserId(data.session.user.id);
            return {
              user: {
                id: data.session.user.id,
                email: data.session.user.email || '',
                role: profile.role || 'student',
                createdAt: data.session.user.created_at
              },
              profile
            };
          }
        }
      } catch (err) {
        console.error('Supabase session retrieval error:', err);
      }
    }

    // 2. Local Storage Adapter
    const userId = StorageAdapter.getCurrentUserId();
    if (!userId) return null;

    const account = StorageAdapter.getUserById(userId);
    const profile = StorageAdapter.getProfile(userId);

    if (!account || !profile) {
      StorageAdapter.setCurrentUserId(null);
      return null;
    }

    return {
      user: {
        id: account.id,
        email: account.email,
        role: account.role,
        createdAt: account.createdAt
      },
      profile
    };
  }

  /**
   * Request password reset
   */
  public static async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
      if (error) return { success: false, message: error.message };
      return { success: true, message: 'Password reset link sent to your email.' };
    }

    const account = StorageAdapter.getUserByEmail(cleanEmail);
    if (!account) {
      return { success: false, message: 'No account found with this email address.' };
    }

    return { success: true, message: 'A password reset confirmation has been initiated for this account.' };
  }

  /**
   * Permanently delete user account
   */
  public static async deleteAccount(userId: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('profiles').delete().eq('id', userId);
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error deleting account on Supabase:', err);
      }
    }

    StorageAdapter.deleteUserAccount(userId);
    return true;
  }
}
