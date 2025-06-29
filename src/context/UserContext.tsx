import React, { createContext, useContext, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { Profile } from '../lib/supabase';

interface UserContextType {
  user: Profile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<Profile>) => Promise<{ data: Profile | null; error: string | null }>;
  updateProgress: (problemsSolved?: number, studyMinutes?: number, xpEarned?: number) => Promise<{ data: any; error: string | null }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading, error, updateProfile, updateProgress } = useProfile();

  return (
    <UserContext.Provider value={{
      user: profile,
      loading,
      error,
      updateProfile,
      updateProgress,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};