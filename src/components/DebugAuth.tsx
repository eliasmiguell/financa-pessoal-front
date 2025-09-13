"use client";

import { useEffect, useState } from 'react';

export default function DebugAuth() {
  const [authInfo, setAuthInfo] = useState<{
    accessToken: string;
    refreshToken: string;
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
  }>({
    accessToken: '',
    refreshToken: '',
    hasAccessToken: false,
    hasRefreshToken: false
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("financa:accessToken");
    const refreshToken = localStorage.getItem("financa:refreshToken");
    
    setAuthInfo({
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : 'Não encontrado',
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'Não encontrado',
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken
    });
  }, []);

  const testAPI = async () => {
    try {
      const response = await fetch('http://localhost:8004/api/personal-finance/categories', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("financa:accessToken")}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      console.log('Teste API:', { status: response.status, data });
      alert(`Status: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Erro no teste:', error);
      alert(`Erro: ${error}`);
    }
  };

  const testLogin = async () => {
    try {
      const response = await fetch('http://localhost:8004/api/authlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: 'eliasperreiramiguel@gmail.com',
          password: '123456'
        })
      });
      
      const data = await response.json();
      console.log('Teste Login:', { status: response.status, data });
      
      if (response.status === 200 && data.accessToken) {
        // Salvar tokens
        localStorage.setItem("financa:accessToken", data.accessToken);
        localStorage.setItem("financa:refreshToken", data.refreshToken);
        localStorage.setItem("financa:user", JSON.stringify(data.user));
        
        alert(`Login bem-sucedido!\nUsuário: ${data.user.name}\nTokens salvos no localStorage`);
        
        // Recarregar a página para atualizar o estado
        window.location.reload();
      } else {
        alert(`Erro no login: ${data.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert(`Erro: ${error}`);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("financa:accessToken");
    localStorage.removeItem("financa:refreshToken");
    localStorage.removeItem("financa:user");
    window.location.reload();
  };

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      <h3 className="font-bold">Debug de Autenticação</h3>
      <div className="text-sm">
        <p><strong>Access Token:</strong> {authInfo.accessToken}</p>
        <p><strong>Refresh Token:</strong> {authInfo.refreshToken}</p>
        <p><strong>Tem Access Token:</strong> {authInfo.hasAccessToken ? 'Sim' : 'Não'}</p>
        <p><strong>Tem Refresh Token:</strong> {authInfo.hasRefreshToken ? 'Sim' : 'Não'}</p>
      </div>
      <div className="mt-2 flex gap-2 flex-wrap">
        <button 
          onClick={testAPI}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
        >
          Testar API
        </button>
        <button 
          onClick={testLogin}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Testar Login
        </button>
        <button 
          onClick={clearAuth}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Limpar Auth
        </button>
      </div>
    </div>
  );
}
