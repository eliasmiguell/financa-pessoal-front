import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';
import { NewReceita } from '../interface';

export interface Receita {
  id: string;
  description: string;
  amount: number;
  type: string;
  receivedDate?: string;
  isRecurring: boolean;
  recurringInterval?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const useReceitas = () => {
  const query = useQuery({
    queryKey: ['receitas'],
    queryFn: async () => {
      const response = await makeRequest.get('/personal-finance/incomes');
      return response.data as Receita[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return query;
};

export const useReceitasById = (id: string) => {
  
  return useQuery({
    queryKey: ['receitas', id],
    queryFn: async () => {
      if (!id || id.length < 25) {
        throw new Error('ID inválido');
      }
      const response = await makeRequest.get(`/personal-finance/incomes/${id}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!id && id.length >= 25, // Só executa a query se o ID for válido (CUID)
  });
};

export const useAdicionarReceita = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (newReceita: NewReceita) => {
      const res = await makeRequest.post(
        `/adicionarRefeita`, 
        {
          categoria_id: newReceita.categoria_id,
          conta_id: newReceita.conta_id,
          user_id: newReceita.user_id,
          descricao: newReceita.descricao,
          valor: newReceita.valor,
          tipo: newReceita.tipo,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receita'] });
    },
    onError: (error) => {
      console.log(error);
      console.error(error);
      throw new Error(error.message || 'Erro ao salvar os dados.');
    },
  });

  return mutate;
};

export interface NovaReceita {
  description: string;
  amount: number;
  type: string;
  receivedDate?: string;
  isRecurring?: boolean;
  recurringInterval?: string;
}

export const useAdicionarReceitaNova = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (novaReceita: NovaReceita) => {
      const res = await makeRequest.post(
        `/personal-finance/incomes`, 
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


export const useAtualizarReceita = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async ({ id, ...dados }: { id: string } & Partial<NovaReceita>) => {
      const response = await makeRequest.put(`/personal-finance/incomes/${id}`, dados);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error(error.message || 'Erro ao atualizar receita.');
    },
  });

  return mutate;
};

export const useDeletarReceita = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (id: string) => {
      const response = await makeRequest.delete(`/personal-finance/incomes/${id}`);
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
