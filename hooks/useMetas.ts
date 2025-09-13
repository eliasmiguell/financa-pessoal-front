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
export interface NovaMeta {
  name: string;
  description?: string;
  targetAmount: number;
  deadline?: string;
  priority: 'BAIXA' | 'MEDIA' | 'ALTA';
}

const useMetas = () => {
  const query = useQuery({
    queryKey: ['metas'],
    queryFn: async () => {
      const response = await makeRequest.get('/personal-finance/goals');
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
      const response = await makeRequest.delete(`/personal-finance/goals/${id}`);
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




export const useAdicionarMeta = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (novaMeta: NovaMeta) => {
      const res = await makeRequest.post(
        `/personal-finance/goals`, 
        {
          name: novaMeta.name,
          description: novaMeta.description,
          targetAmount: novaMeta.targetAmount,
          deadline: novaMeta.deadline,
          priority: novaMeta.priority,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] });
    },
    onError: (error) => {
      console.log(error);
      console.error(error);
      throw new Error(error.message || 'Erro ao salvar a meta.');
    },
  });

  return mutate;
};

export default useMetas;
