import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import supabase, { auth } from '@/db/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  refreshUser: (user: User) => Promise<void>;
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
    set({ loading: true });
    const { data: { user } } = await auth.getUser();
    if (user) {
        await get().refreshUser(user);
    } else {
        set({ user: null });
    }
    set({ loading: false });
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
  },
  refreshUser: async (user: User) => {

    const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

    if (error) throw error;

    set({ user: { ...data } });
  }
}));

const setupAuthListener = () => {
  const { setUser, refreshUser } = useAuthStore.getState();
  
  return auth.onAuthStateChange((event, session) => {
      console.debug('Auth event:', event); // Helpful for debugging
      
      setTimeout(async () => {
          const currentState = useAuthStore.getState();
          
          if (session?.user) {
              if (!currentState.user || currentState.user.id !== session.user.id) {
                  refreshUser(session.user);
              }
          } else if (currentState.user !== null) {
              setUser(null);
          }
      }, 0);
  });
};

export const initializeAuth = async () => {
  await useAuthStore.getState().initialize();
  return setupAuthListener();
};