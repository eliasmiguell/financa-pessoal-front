import { useEffect, useState } from 'react';
import { makeRequest } from '../axios';

export const useAuthCheck = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("financa:accessToken");
      const refreshToken = localStorage.getItem("financa:refreshToken");
      
      if (!accessToken || !refreshToken) {
        console.log('Sem tokens, usuário não autenticado');
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        // Testar se o token ainda é válido fazendo uma requisição simples
        await makeRequest.get('/personal-finance/categories');
        console.log('Token válido, usuário autenticado');
        setIsAuthenticated(true);
      } catch (error: any) {
        console.log('Token inválido ou expirado:', error.response?.status);
        if (error.response?.status === 401) {
          // O interceptor do axios já vai tentar renovar o token
          // Se não conseguir, vai limpar os dados e redirecionar
          setIsAuthenticated(false);
        }
      } finally {
        setIsValidating(false);
      }
    };

    checkAuth();
  }, []);

  return { isValidating, isAuthenticated };
};
