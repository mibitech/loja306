
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string | null;
  isMember: boolean;
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar role do usuário:', error);
        return null;
      }
      
      return data.role;
    } catch (error) {
      console.error('Erro inesperado ao buscar role:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // If email confirmation happened, automatically sign out
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at && !session?.user?.last_sign_in_at) {
          setTimeout(() => {
            signOut();
          }, 1000);
          return;
        }
        
        // Fetch user role if authenticated
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id).then(role => {
              setUserRole(role);
              setIsMember(role === 'member');
              setLoading(false);
            });
          }, 0);
        } else {
          setUserRole(null);
          setIsMember(false);
          setLoading(false);
        }
        
        // If user signed out, ensure clean state
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setUserRole(null);
          setIsMember(false);
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
      
      if (session?.user) {
        fetchUserRole(session.user.id).then(role => {
          setUserRole(role);
          setIsMember(role === 'member');
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
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
      setUserRole(null);
      setIsMember(false);
      
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
      setUserRole(null);
      setIsMember(false);
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
    userRole,
    isMember,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
