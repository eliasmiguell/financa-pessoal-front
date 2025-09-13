import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';
import { NovaReceita } from './useReceitas';

export interface Despesa {
  id: string;
  description: string;
  amount: number;
  type: string;
  status: string;
  categoryId: string;
  dueDate?: string;
  paidDate?: string;
  isRecurring: boolean;
  recurringInterval?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
}
export interface Categoria {
  id: string;
  name: string;
  color: string;
  icon: string;
  budget: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
export interface NovaDespesa {
  description: string;
  amount: number;
  type: 'FIXA' | 'IMPREVISTA' | 'PENDENTE';
  status: 'PAGO' | 'PENDENTE' | 'ATRASADO';
  categoryId: string;
  dueDate?: string;
  paidDate?: string;
  isRecurring?: boolean;
  recurringInterval?: string;
}

export const useCategoriasDespesas = () => {
  const query = useQuery({
    queryKey: ['categorias-despesas'],
    queryFn: async () => {
      const response = await makeRequest.get('/personal-finance/categories');
      return response.data as Categoria[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
 console.log('query teste', query);
  return query;
};



export const useAdicionarDespesa = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (novaDespesa: NovaDespesa) => {
      const res = await makeRequest.post(`/personal-finance/expenses`, 
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

export const useDespesasById = (id: string) => {
 
  return useQuery({
    queryKey: ['despesas', id],
    queryFn: async () => {
      if (!id || id.length < 25) {
        throw new Error('ID inválido');
      }
      const response = await makeRequest.get(`/personal-finance/expenses/${id}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!id && id.length >= 25, // Só executa a query se o ID for válido (CUID)
  });
};


export const useAtualizarDespesa = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async ({ id, ...dados }: { id: string } & Partial<NovaDespesa>) => {
      const response = await makeRequest.put(`/personal-finance/expenses/${id}`, dados);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error(error.message || 'Erro ao atualizar despesa.');
    },
  });

  return mutate;
};

const useDespesas = () => {
  const query = useQuery({
    queryKey: ['despesas'],
    queryFn: async () => {
      const response = await makeRequest.get('/personal-finance/expenses');
      return response.data as Despesa[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return query;
};

export const useDeletarDespesa = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (id: string) => {
      const response = await makeRequest.delete(`/personal-finance/expenses/${id}`);
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
