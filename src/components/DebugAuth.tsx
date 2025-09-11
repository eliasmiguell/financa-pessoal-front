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
      const response = await fetch('https://api-financa-pessoal.onrender.com/api/personal-finance/categories', {
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
      <div className="mt-2 flex gap-2">
        <button 
          onClick={testAPI}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
        >
          Testar API
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
