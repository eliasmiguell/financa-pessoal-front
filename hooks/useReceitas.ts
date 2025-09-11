import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface Receita {
  id: number;
  description: string;
  amount: number;
  type: string;
  receivedDate?: string;
  isRecurring: boolean;
  recurringInterval?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

const useReceitas = () => {
  const query = useQuery({
    queryKey: ['receitas'],
    queryFn: async () => {
      const response = await makeRequest.get('/api/personal-finance/incomes');
      return response.data as Receita[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return query;
};

export const useDeletarReceita = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (id: number) => {
      const response = await makeRequest.delete(`/api/personal-finance/incomes/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error(error.message || 'Erro ao deletar receita.');
    },
  });

  return mutate;
};

export default useReceitas;
