import axios from 'axios';

export const makeRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  withCredentials: true
})

makeRequest.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("financa:accessToken")
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

makeRequest.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const originalRequest = error.config
  
  // Verificar se é erro 401 e se não foi tentado refresh ainda
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    const refreshToken = localStorage.getItem("financa:refreshToken")
    
    console.log('Token expirado, tentando refresh...', { refreshToken: !!refreshToken });
    
    if (!refreshToken) {
      console.log('Sem refresh token, limpando dados e redirecionando para login');
      localStorage.removeItem("financa:accessToken");
      localStorage.removeItem("financa:refreshToken");
      localStorage.removeItem("financa:user");
      // Aguardar um pouco antes de redirecionar para evitar loops
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
      return Promise.reject(error)
    }
    
    try {
      // Usar endpoint correto para refresh
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      });
      
      console.log('Refresh token bem-sucedido:', res.data);
      
      // O backend retorna o novo token no cookie, mas vamos também salvar no localStorage
      if (res.data.accessToken) {
        localStorage.setItem("financa:accessToken", res.data.accessToken);
      }
      
      // Tentar novamente a requisição original
      originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("financa:accessToken")}`;
      return makeRequest(originalRequest);
      
    } catch (refreshError) {
      console.log('Erro no refresh token:', refreshError);
      localStorage.removeItem("financa:accessToken");
      localStorage.removeItem("financa:refreshToken");
      localStorage.removeItem("financa:user");
      // Aguardar um pouco antes de redirecionar para evitar loops
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
      return Promise.reject(refreshError)
    }
  }
  
  return Promise.reject(error);
})