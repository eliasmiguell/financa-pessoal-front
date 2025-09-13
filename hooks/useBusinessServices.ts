import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface BusinessService {
  id: string;
  name: string;
  description?: string;
  price: number;
  materials: string; // JSON string
  laborCost: number;
  laborHours: number;
  foodCost: number;
  transportCost: number;
  materialCost: number;
  totalCost: number;
  profit: number;
  profitMargin: number;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NovoServico {
  name: string;
  description?: string;
  price: number;
  materials: string; // JSON string
  laborCost: number;
  laborHours?: number;
  foodCost?: number;
  transportCost?: number;
  materialCost?: number;
}

// Hook para buscar serviços de um negócio
export const useBusinessServices = (businessId: string) => {
  return useQuery({
    queryKey: ['businessServices', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const response = await makeRequest.get(`/business/businesses/${businessId}/services`);
      return response.data as BusinessService[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!businessId,
  });
};

// Hook para criar serviço
export const useCriarServico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ businessId, servico }: { businessId: string; servico: NovoServico }) => {
      const response = await makeRequest.post(`/business/businesses/${businessId}/services`, servico);
      return response.data;
    },
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({ queryKey: ['businessServices', businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao criar serviço');
    },
  });
};

// Hook para atualizar serviço
export const useAtualizarServico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, servico }: { id: string; servico: Partial<NovoServico> }) => {
      const response = await makeRequest.put(`/business/services/${id}`, servico);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['businessServices', data.businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao atualizar serviço');
    },
  });
};

// Hook para deletar serviço
export const useDeletarServico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeRequest.delete(`/business/services/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessServices'] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao deletar serviço');
    },
  });
};
