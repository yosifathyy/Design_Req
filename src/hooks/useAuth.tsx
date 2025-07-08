import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string, name: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return;
    }

    setProfile(data);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Handle email not confirmed error
    if (authError?.message === 'Email not confirmed') {
      setLoading(false);
      return { 
        data: null, 
        error: new Error('Please check your email and click the confirmation link before signing in.') 
      };
    }

    if (authError) {
      setLoading(false);
      return { data: null, error: authError };
    }

    // Update last login timestamp
    if (data?.session?.user) {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.session.user.id);
    }

    setLoading(false);
    return { data: data?.session || null, error: null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    // Create auth user
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !data.user) {
      setLoading(false);
      return { data: null, error: authError || new Error('User creation failed') };
    }

    // Create profile in users table
    const { error: profileError } = await supabase.from('users').insert([
      {
        id: data.user.id,
        email,
        name,
        role: 'user',
        status: 'active',
        xp: 0,
        level: 1,
      },
    ]);

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      setLoading(false);
      return { data: null, error: new Error('Failed to create user profile. Please try again.') };
    }

    setLoading(false);
    return { 
      data: data.session, 
      error: null 
    };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const updateProfile = async (updates: any) => {
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error) {
      setProfile(data);
    }

    return { data, error };
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}