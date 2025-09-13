import { useEffect, useState } from 'react';
import { makeRequest } from '../axios';
import { ApiError } from './useUser';

export const useAuthCheck = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Verificar se estamos no cliente antes de acessar localStorage
      if (typeof window === 'undefined') {
        return;
      }

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
      } catch (error: unknown) {
        const apiError = error as ApiError;
        console.log('Token inválido ou expirado:', apiError.response);
        if (apiError.response?.status === 401) {
        
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
