import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface BusinessExpense {
  id: string;
  description: string;
  amount: number;
  type: 'MATERIAL' | 'ALIMENTACAO' | 'TRANSPORTE' | 'OUTRO';
  category?: string;
  businessId: string;
  date: string;
  isRecurring: boolean;
  recurringInterval?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NovaDespesaNegocio {
  description: string;
  amount: number;
  type: 'MATERIAL' | 'ALIMENTACAO' | 'TRANSPORTE' | 'OUTRO';
  category?: string;
  date: string;
  isRecurring?: boolean;
  recurringInterval?: string;
}

// Hook para buscar despesas de um negócio
export const useBusinessExpenses = (businessId: string) => {
  return useQuery({
    queryKey: ['businessExpenses', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const response = await makeRequest.get(`/business/businesses/${businessId}/expenses`);
      return response.data as BusinessExpense[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!businessId,
  });
};

// Hook para criar despesa
export const useCriarDespesaNegocio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ businessId, despesa }: { businessId: string; despesa: NovaDespesaNegocio }) => {
      const response = await makeRequest.post(`/business/businesses/${businessId}/expenses`, despesa);
      return response.data;
    },
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({ queryKey: ['businessExpenses', businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao criar despesa');
    },
  });
};

// Hook para atualizar despesa
export const useAtualizarDespesaNegocio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, despesa }: { id: string; despesa: Partial<NovaDespesaNegocio> }) => {
      const response = await makeRequest.put(`/business/expenses/${id}`, despesa);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['businessExpenses', data.businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao atualizar despesa');
    },
  });
};

// Hook para deletar despesa
export const useDeletarDespesaNegocio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeRequest.delete(`/business/expenses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessExpenses'] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao deletar despesa');
    },
  });
};
