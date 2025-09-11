import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface Despesa {
  id: number;
  description: string;
  amount: number;
  type: string;
  status: string;
  categoryId: number;
  dueDate?: string;
  paidDate?: string;
  isRecurring: boolean;
  recurringInterval?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
    color: string;
    icon: string;
  };
}

const useDespesas = () => {
  const query = useQuery({
    queryKey: ['despesas'],
    queryFn: async () => {
      const response = await makeRequest.get('/api/personal-finance/expenses');
      return response.data as Despesa[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return query;
};

export const useDeletarDespesa = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (id: number) => {
      const response = await makeRequest.delete(`/api/personal-finance/expenses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error(error.message || 'Erro ao deletar despesa.');
    },
  });

  return mutate;
};

export default useDespesas;
