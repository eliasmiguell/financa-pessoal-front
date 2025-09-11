import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface NovaDespesa {
  description: string;
  amount: number;
  type: string;
  status: string;
  categoryId: number;
  dueDate?: string;
  paidDate?: string;
  isRecurring?: boolean;
  recurringInterval?: string;
}

const useAdicionarDespesa = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (novaDespesa: NovaDespesa) => {
      const res = await makeRequest.post(
        `/api/personal-finance/expenses`, 
        {
          description: novaDespesa.description,
          amount: novaDespesa.amount,
          type: novaDespesa.type,
          status: novaDespesa.status,
          categoryId: novaDespesa.categoryId,
          dueDate: novaDespesa.dueDate,
          paidDate: novaDespesa.paidDate,
          isRecurring: novaDespesa.isRecurring || false,
          recurringInterval: novaDespesa.recurringInterval,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
    onError: (error) => {
      console.log(error);
      console.error(error);
      throw new Error(error.message || 'Erro ao salvar a despesa.');
    },
  });

  return mutate;
};

export default useAdicionarDespesa;
