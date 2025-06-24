import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import supabase from '@/db/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  createUserProfile: (user: User) => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),

  initialize: async () => {
    try {
      set({ loading: true });

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      set({ 
        session, 
        user: session?.user ?? null,
        loading: false,
        initialized: true 
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        set({ 
          session, 
          user: session?.user ?? null,
          loading: false 
        });

        // Create user profile if it doesn't exist
        if (event === 'SIGNED_IN' && session?.user) {
          await get().createUserProfile(session.user);
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false, initialized: true });
    }
  },

  createUserProfile: async (user: User) => {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        // Create new user profile
        const { error } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name,
            avatar_url: user.user_metadata?.avatar_url,
            username: user.user_metadata?.preferred_username || 
                     user.email?.split('@')[0] || 
                     `user_${user.id.slice(0, 8)}`
          });

        if (error) {
          console.error('Error creating user profile:', error);
        }
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true });

      const redirectUrl = import.meta.env.VITE_PUBLIC_FRONTEND_URL + '/auth/callback';
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        set({ loading: false });
        throw error;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      set({ loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      set({ 
        user: null, 
        session: null, 
        loading: false 
      });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ loading: false });
      throw error;
    }
  }
}));