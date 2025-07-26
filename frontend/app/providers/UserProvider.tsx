'use client';
// @ts-nocheck
import { createContext, useContext, useEffect, useState } from 'react';
import getCurrentUser from "@/app/actions/getCurrentUser";

interface User {
  username?: string;
  firstName?: string;
  lastName?: string;
  emailId?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      getCurrentUser(storedToken).then(userData => {
        if (userData) {
          setUser(userData);
        } else {
          // Token might be expired, clear everything
          setUser(null);
          setToken(null);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }).catch(() => {
        // Token validation failed, clear everything
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      });
    } else {
      setUser(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    // Save user and token to localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [user, token]);

  const refreshUser = async () => {
    const currentToken = token || localStorage.getItem('authToken');
    if (currentToken) {
      try {
        const userData = await getCurrentUser(currentToken);
        if (userData) {
          setUser(userData);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error refreshing user:', error);
        logout();
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 