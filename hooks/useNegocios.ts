import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface Negocio {
  id: number;
  name: string;
  description?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  materials?: any[];
  services?: any[];
  expenses?: any[];
  incomes?: any[];
  clients?: any[];
}

const useNegocios = () => {
  const query = useQuery({
    queryKey: ['negocios'],
    queryFn: async () => {
      const response = await makeRequest.get('/api/business');
      return response.data as Negocio[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return query;
};

export const useDeletarNegocio = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (id: number) => {
      const response = await makeRequest.delete(`/api/business/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error(error.message || 'Erro ao deletar negócio.');
    },
  });

  return mutate;
};

export default useNegocios;
