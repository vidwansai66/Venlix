import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser as useClerkUser, useSession as useClerkSession, useClerk } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  profile_image?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: any; // Clerk session
  isLoaded: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoaded: false,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const { session: clerkSession } = useClerkSession();
  const { signOut: clerkSignOut } = useClerk();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (clerkLoaded) {
      if (clerkUser) {
        // Fetch profile from supabase
        supabase
          .from('users')
          .select('*')
          .eq('id', clerkUser.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setProfile(data as UserProfile);
            } else {
              setProfile(null);
            }
            setProfileLoaded(true);
          });
      } else {
        setProfile(null);
        setProfileLoaded(true);
      }
    }
  }, [clerkUser, clerkLoaded]);

  const signOut = async () => {
    await clerkSignOut();
    setProfile(null);
  };

  const isFullyLoaded = clerkLoaded && profileLoaded;

  return (
    <AuthContext.Provider value={{ 
      user: profile, 
      session: clerkSession, 
      isLoaded: isFullyLoaded, 
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const useUser = () => {
  const { user, isLoaded } = useAuth();
  return { user, isLoaded };
};
