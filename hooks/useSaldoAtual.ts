import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export const useSaldoAtual = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['saldoAtual'],
    queryFn: async () => {
      const response = await makeRequest.get('/api/adicionarRefeita'); 
      return response.data.saldo;
    }
  });

  return{ data, isLoading, isError}
};

export const UltimasTransacoes = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['ultimasTransacoes'],
    queryFn: async () => {
      const response = await makeRequest.get('/api/adicionarRefeita/ultimas');
      return response.data
    }
  });

  return{ data, isLoading, isError}
}
