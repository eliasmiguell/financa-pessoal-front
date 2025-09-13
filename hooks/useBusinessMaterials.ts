import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface BusinessMaterial {
  id: string;
  name: string;
  description?: string;
  cost: number;
  quantity: number;
  unit: string;
  usagePerClient?: number;
  minStock: number;
  supplier?: string;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NovoMaterial {
  name: string;
  description?: string;
  cost: number;
  quantity: number;
  unit: string;
  usagePerClient?: number;
  minStock?: number;
  supplier?: string;
}

// Hook para buscar materiais de um negócio
export const useBusinessMaterials = (businessId: string) => {
  return useQuery({
    queryKey: ['businessMaterials', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const response = await makeRequest.get(`/business/businesses/${businessId}/materials`);
      return response.data as BusinessMaterial[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!businessId,
  });
};

// Hook para criar material
export const useCriarMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ businessId, material }: { businessId: string; material: NovoMaterial }) => {
      const response = await makeRequest.post(`/business/businesses/${businessId}/materials`, material);
      return response.data;
    },
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({ queryKey: ['businessMaterials', businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao criar material');
    },
  });
};

// Hook para atualizar material
export const useAtualizarMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, material }: { id: string; material: Partial<NovoMaterial> }) => {
      const response = await makeRequest.put(`/business/materials/${id}`, material);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['businessMaterials', data.businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao atualizar material');
    },
  });
};

// Hook para deletar material
export const useDeletarMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeRequest.delete(`/business/materials/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessMaterials'] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao deletar material');
    },
  });
};
