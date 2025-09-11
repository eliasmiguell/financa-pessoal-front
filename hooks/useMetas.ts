import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface Meta {
  id: number;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  priority: 'BAIXA' | 'MEDIA' | 'ALTA';
  userId: number;
  createdAt: string;
  updatedAt: string;
}

const useMetas = () => {
  const query = useQuery({
    queryKey: ['metas'],
    queryFn: async () => {
      const response = await makeRequest.get('/api/personal-finance/goals');
      return response.data as Meta[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return query;
};

export const useDeletarMeta = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (id: number) => {
      const response = await makeRequest.delete(`/api/personal-finance/goals/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error(error.message || 'Erro ao deletar meta.');
    },
  });

  return mutate;
};

export default useMetas;
