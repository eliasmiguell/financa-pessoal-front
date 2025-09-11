"use client";
import { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
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
    localStorage.removeItem("financa:accessToken");
    localStorage.removeItem("financa:refreshToken");
  };

  useEffect(() => {
    const userJSON = localStorage.getItem("financa:user");
    const accessToken = localStorage.getItem("financa:accessToken");
    
    // Só carregar usuário se tiver token válido
    if (userJSON && accessToken) {
      try {
        const userData = JSON.parse(userJSON);
        setUser(userData);
      } catch (error) {
        console.error("Erro ao carregar usuário do localStorage:", error);
        localStorage.removeItem("financa:user");
        localStorage.removeItem("financa:accessToken");
        localStorage.removeItem("financa:refreshToken");
      }
    } else if (userJSON && !accessToken) {
      // Se tem usuário mas não tem token, limpar tudo
      console.log("Usuário encontrado mas sem token, limpando dados");
      localStorage.removeItem("financa:user");
      localStorage.removeItem("financa:accessToken");
      localStorage.removeItem("financa:refreshToken");
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


