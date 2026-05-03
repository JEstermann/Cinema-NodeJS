import React, { createContext, useState, useCallback, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { auth } from '../api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const setupLogoutTimer = useCallback((token: string) => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = (payload.exp - now) * 1000;
        
        if (timeUntilExpiry > 0) {
          console.log(`Token expires in ${Math.round(timeUntilExpiry / 1000)} seconds`);
          logoutTimerRef.current = setTimeout(() => {
            console.log('Token expired, logging out...');
            localStorage.clear();
            setUser(null);
            window.location.href = '/login';
          }, timeUntilExpiry);
        }
      }
    } catch (error) {
      console.error('Error setting up logout timer:', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.userId) {
          setUser({
            id: payload.userId,
            email: localStorage.getItem('userEmail') || 'unknown',
            role: payload.role || 'USER'
          });
          setupLogoutTimer(token);
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, [setupLogoutTimer]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await auth.login(email, password);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userEmail', data.user.email);
      setUser(data.user);
      setupLogoutTimer(data.accessToken);
    } catch (error) {
      throw error;
    }
  }, [setupLogoutTimer]);

  const signup = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await auth.signup(email, password);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      setupLogoutTimer(data.accessToken);
    } catch (error) {
      throw error;
    }
  }, [setupLogoutTimer]);

  const logout = useCallback(async () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    try {
      await auth.logout();
    } finally {
      localStorage.clear();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
