import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getConfig } from '@icon/config';

interface AppContextType {
  config: any;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  user: any | null;
  setUser: (user: any | null) => void;
  sessionPassword: string | null;
  setSessionPassword: (password: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [sessionPassword, setSessionPassword] = useState<string | null>(null);
  
  const config = getConfig();

  const value: AppContextType = {
    config,
    isLoading,
    setLoading,
    user,
    setUser,
    sessionPassword,
    setSessionPassword,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};