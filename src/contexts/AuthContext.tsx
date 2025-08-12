
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // If user signed out, ensure clean state
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          // Clear any localStorage data
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('sb-bvrvhjxcqsjvrcdaffly-auth-token');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    try {
      // Clear state first to immediately hide restricted areas
      setSession(null);
      setUser(null);
      
      // Clear localStorage manually
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-bvrvhjxcqsjvrcdaffly-auth-token');
      
      // Then sign out from Supabase
      await supabase.auth.signOut();
      
      toast({
        title: "Sessão encerrada",
        description: "Você saiu da área restrita com sucesso.",
      });
      
      // Force page reload to ensure complete logout and redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Even if there's an error, clear the state
      setSession(null);
      setUser(null);
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-bvrvhjxcqsjvrcdaffly-auth-token');
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao encerrar a sessão.",
        variant: "destructive"
      });
      
      // Still redirect to home
      window.location.href = '/';
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
