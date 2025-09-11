import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface NovaMeta {
  name: string;
  description?: string;
  targetAmount: number;
  deadline?: string;
  priority: 'BAIXA' | 'MEDIA' | 'ALTA';
}

const useAdicionarMeta = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (novaMeta: NovaMeta) => {
      const res = await makeRequest.post(
        `/api/personal-finance/goals`, 
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

export default useAdicionarMeta;
