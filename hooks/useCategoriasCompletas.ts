import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface CategoriaCompleta {
  id: number;
  name: string;
  color: string;
  icon: string;
  budget: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
}

export interface NovaCategoria {
  name: string;
  color: string;
  icon: string;
  budget: number;
}

export interface ApiError {
  message: string;
  response?: {
    data?: unknown;
    status?: number;
    statusText?: string;
  };
}

const useCategoriasCompletas = () => {
  const query = useQuery({
    queryKey: ['categorias-completas'],
    queryFn: async () => {
      const response = await makeRequest.get('/personal-finance/categories');
      return response.data as CategoriaCompleta[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return query;
};

export const useCriarCategoria = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (novaCategoria: NovaCategoria) => {
      console.log('Enviando dados para API:', novaCategoria);
      const response = await makeRequest.post('/personal-finance/categories', novaCategoria);
      console.log('Resposta da API:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias-completas'] });
      queryClient.invalidateQueries({ queryKey: ['categorias-despesas'] });
    },
    onError: (error: ApiError) => {
      console.error('Erro no hook useCriarCategoria:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    },
  });

  return mutate;
};

export const useAtualizarCategoria = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async ({ id, ...dados }: { id: number } & Partial<NovaCategoria>) => {
      const response = await makeRequest.put(`/personal-finance/categories/${id}`, dados);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias-completas'] });
      queryClient.invalidateQueries({ queryKey: ['categorias-despesas'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error(error.message || 'Erro ao atualizar categoria.');
    },
  });

  return mutate;
};

export const useDeletarCategoria = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (id: number) => {
      const response = await makeRequest.delete(`/personal-finance/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias-completas'] });
      queryClient.invalidateQueries({ queryKey: ['categorias-despesas'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error(error.message || 'Erro ao deletar categoria.');
    },
  });

  return mutate;
};

export default useCategoriasCompletas;
