import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface BusinessClient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NovoCliente {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

// Hook para buscar clientes de um negócio
export const useBusinessClients = (businessId: string) => {
  return useQuery({
    queryKey: ['businessClients', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const response = await makeRequest.get(`/business/businesses/${businessId}/clients`);
      return response.data as BusinessClient[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!businessId,
  });
};

// Hook para criar cliente
export const useCriarCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ businessId, cliente }: { businessId: string; cliente: NovoCliente }) => {
      const response = await makeRequest.post(`/business/businesses/${businessId}/clients`, cliente);
      return response.data;
    },
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({ queryKey: ['businessClients', businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao criar cliente');
    },
  });
};

// Hook para atualizar cliente
export const useAtualizarCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, cliente }: { id: string; cliente: Partial<NovoCliente> }) => {
      const response = await makeRequest.put(`/business/clients/${id}`, cliente);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['businessClients', data.businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao atualizar cliente');
    },
  });
};

// Hook para deletar cliente
export const useDeletarCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeRequest.delete(`/business/clients/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessClients'] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao deletar cliente');
    },
  });
};
