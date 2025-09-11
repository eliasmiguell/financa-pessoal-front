import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface NovaReceita {
  description: string;
  amount: number;
  type: string;
  receivedDate?: string;
  isRecurring?: boolean;
  recurringInterval?: string;
}

const useAdicionarReceitaNova = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (novaReceita: NovaReceita) => {
      const res = await makeRequest.post(
        `/api/personal-finance/incomes`, 
        {
          description: novaReceita.description,
          amount: novaReceita.amount,
          type: novaReceita.type,
          receivedDate: novaReceita.receivedDate,
          isRecurring: novaReceita.isRecurring || false,
          recurringInterval: novaReceita.recurringInterval,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
      queryClient.invalidateQueries({ queryKey: ['saldo'] });
    },
    onError: (error) => {
      console.log(error);
      console.error(error);
      throw new Error(error.message || 'Erro ao salvar a receita.');
    },
  });

  return mutate;
};

export default useAdicionarReceitaNova;
