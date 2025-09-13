import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface BusinessIncome {
  id: string;
  description: string;
  amount: number;
  serviceId?: string;
  businessId: string;
  clientId?: string;
  date: string;
  paymentMethod: 'DINHEIRO' | 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'TRANSFERENCIA' | 'OUTRO';
  createdAt: string;
  updatedAt: string;
}

export interface NovaReceitaNegocio {
  description: string;
  amount: number;
  serviceId?: string;
  clientId?: string;
  date: string;
  paymentMethod: 'DINHEIRO' | 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'TRANSFERENCIA' | 'OUTRO';
}

// Hook para buscar receitas de um negócio
export const useBusinessIncomes = (businessId: string) => {
  return useQuery({
    queryKey: ['businessIncomes', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const response = await makeRequest.get(`/business/businesses/${businessId}/incomes`);
      return response.data as BusinessIncome[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!businessId,
  });
};

// Hook para criar receita
export const useCriarReceitaNegocio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ businessId, receita }: { businessId: string; receita: NovaReceitaNegocio }) => {
      const response = await makeRequest.post(`/business/businesses/${businessId}/incomes`, receita);
      return response.data;
    },
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({ queryKey: ['businessIncomes', businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao criar receita');
    },
  });
};

// Hook para atualizar receita
export const useAtualizarReceitaNegocio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, receita }: { id: string; receita: Partial<NovaReceitaNegocio> }) => {
      const response = await makeRequest.put(`/business/incomes/${id}`, receita);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['businessIncomes', data.businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao atualizar receita');
    },
  });
};

// Hook para deletar receita
export const useDeletarReceitaNegocio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeRequest.delete(`/business/incomes/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessIncomes'] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao deletar receita');
    },
  });
};
