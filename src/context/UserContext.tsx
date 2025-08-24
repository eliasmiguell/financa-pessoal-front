"use client";
import { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserContextType {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  logout: () => void;
}

const initialValue: UserContextType = {
  user: undefined,
  setUser: () => {},
  logout: () => {},
};

export const UserContext = createContext<UserContextType>(initialValue);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};

export interface ContextProps {
  children: React.ReactNode;
}

export const UserContextProvider = ({ children }: ContextProps) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  
  const logout = () => {
    setUser(undefined);
    localStorage.removeItem("financa:user");
  };

  useEffect(() => {
    const userJSON = localStorage.getItem("financa:user");
    if (userJSON) {
      try {
        const userData = JSON.parse(userJSON);
        setUser(userData);
      } catch (error) {
        console.error("Erro ao carregar usuário do localStorage:", error);
        localStorage.removeItem("financa:user");
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("financa:user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};


