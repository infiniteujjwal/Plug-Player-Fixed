import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import api from '../lib/api';

// Helper to manage the user cookie
const setUserCookie = (user: User | null) => {
    if (user) {
        document.cookie = `plugplayers-user=${JSON.stringify(user)}; path=/; max-age=86400`; // Expires in 1 day
    } else {
        document.cookie = 'plugplayers-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
};

const getUserCookie = (): User | null => {
    if (typeof window === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + 'plugplayers-user' + '=([^;]+)'));
    if (match) {
        try {
            return JSON.parse(decodeURIComponent(match[2]));
        } catch (error) {
            console.error("Failed to parse user cookie", error);
            return null;
        }
    }
    return null;
};


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<boolean>;
  verifyAndLogin: (email: string, otp: string) => Promise<{success: boolean, message: string}>;
  register: (details: { name: string; email: string; role: Role; orgName?: string }) => Promise<{success: boolean, message: string}>;
  logout: () => void;
  updateUserAvatar: (avatarUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = getUserCookie();
    if (storedUser) {
        setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string) => {
    setLoading(true);
    try {
        const foundUser = await api.login(email);
        if (foundUser && foundUser.id) {
            setUser(foundUser);
            setUserCookie(foundUser);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    } finally {
        setLoading(false);
    }
  }, []);
  
  const register = useCallback(async (details: { name: string; email: string; role: Role; orgName?: string }) => {
      setLoading(true);
      try {
          const response = await api.register(details);
          return { success: true, message: 'Registration initiated! Please check your email for an OTP.' };
      } catch (error: any) {
          const message = error?.info?.message || 'An account with this email already exists.';
          return { success: false, message };
      } finally {
          setLoading(false);
      }
  }, []);

  const verifyAndLogin = useCallback(async (email: string, otp: string) => {
    setLoading(true);
    try {
        await api.verifyOtp(email, otp);
    } catch (error) {
        setLoading(false);
        return { success: false, message: 'Invalid OTP. Please try again.' };
    }
    
    const success = await login(email);
    setLoading(false);
    if (success) {
        return { success: true, message: 'Verification successful!' };
    }
    return { success: false, message: 'Could not log you in after verification. Please try again.' };
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    setUserCookie(null);
    window.location.href = '/login'; // Use href for a full page reload to clear state
  }, []);

  const updateUserAvatar = useCallback((avatarUrl: string) => {
    setUser(currentUser => {
        if (currentUser) {
            const updatedUser = { ...currentUser, avatarUrl };
            setUserCookie(updatedUser);
            return updatedUser;
        }
        return null;
    });
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, verifyAndLogin, updateUserAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
