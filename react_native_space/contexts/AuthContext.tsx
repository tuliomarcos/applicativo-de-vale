import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { SignupPayload, User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments?.[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/');
    } else if (user && (inAuthGroup || (segments?.length ?? 0) === 0)) {
      // Redirect to home if authenticated and in auth screens
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  async function loadUser() {
    try {
      const token = await storage.getToken();
      if (token) {
        const { user: userData } = await api.getMe();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      await storage.clear();
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const { token, user: userData } = await api.login(email, password);
      await storage.setToken(token);
      await storage.setUser(userData);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  }

  async function signup(data: SignupPayload) {
    try {
      const { token, user: userData } = await api.signup(data);
      await storage.setToken(token);
      await storage.setUser(userData);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    await storage.clear();
    setUser(null);
    router.replace('/');
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
