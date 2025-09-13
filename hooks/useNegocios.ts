import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface Negocio {
  id: string;
  name: string;
  description?: string;
  type: 'SALAO' | 'MAQUIAGEM' | 'OUTRO';
  userId: string;
  createdAt: string;
  updatedAt: string;
  materials?: BusinessMaterial[];
  services?: BusinessService[];
  expenses?: BusinessExpense[];
  incomes?: BusinessIncome[];
  clients?: BusinessClient[];
  budgets?: BusinessBudget[];
}

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

export interface BusinessBudget {
  id: string;
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  totalProfit: number;
  profitMargin: number;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NovoNegocio {
  name: string;
  description?: string;
  type: 'SALAO' | 'MAQUIAGEM' | 'OUTRO';
}

const useNegocios = () => {
  const query = useQuery({
    queryKey: ['negocios'],
    queryFn: async () => {
      const response = await makeRequest.get('/business/businesses');
      return response.data as Negocio[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return query;
};

export const useCriarNegocio = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (novoNegocio: NovoNegocio) => {
      const response = await makeRequest.post('/business/businesses', novoNegocio);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error(error.message || 'Erro ao criar negócio.');
    },
  });

  return mutate;
};

export const useAtualizarNegocio = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async ({ id, ...dados }: { id: string } & Partial<NovoNegocio>) => {
      const response = await makeRequest.put(`/business/businesses/${id}`, dados);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error(error.message || 'Erro ao atualizar negócio.');
    },
  });

  return mutate;
};

export const useNegocioById = (id: string) => {
  return useQuery({
    queryKey: ['negocio', id],
    queryFn: async () => {
      if (!id || id.length < 25) {
        throw new Error('ID inválido');
      }
      const response = await makeRequest.get(`/business/businesses/${id}`);
      return response.data as Negocio;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id && id.length >= 25,
  });
};

export const useDeletarNegocio = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (id: string) => {
      const response = await makeRequest.delete(`/business/businesses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error(error.message || 'Erro ao deletar negócio.');
    },
  });

  return mutate;
};

export default useNegocios;
