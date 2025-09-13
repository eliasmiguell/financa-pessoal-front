import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface BusinessPayment {
  id: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paymentDate?: string;
  dueDate?: string;
  clientId: string;
  client: BusinessClient;
  serviceId?: string;
  service?: BusinessService;
  incomeId?: string;
  income?: BusinessIncome;
  businessId: string;
  paymentMethod: 'DINHEIRO' | 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'TRANSFERENCIA' | 'OUTRO';
  notes?: string;
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

export interface BusinessService {
  id: string;
  name: string;
  description?: string;
  price: number;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessIncome {
  id: string;
  description: string;
  amount: number;
  businessId: string;
  date: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface NovoPagamento {
  amount: number;
  description: string;
  clientId: string;
  serviceId?: string;
  dueDate?: string;
  paymentMethod?: 'DINHEIRO' | 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'TRANSFERENCIA' | 'OUTRO';
  notes?: string;
}

// Hook para buscar pagamentos de um negócio
export const useBusinessPayments = (businessId: string, filters?: {
  status?: string;
  clientId?: string;
  serviceId?: string;
}) => {
  return useQuery({
    queryKey: ['businessPayments', businessId, filters],
    queryFn: async () => {
      if (!businessId) return [];
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.clientId) params.append('clientId', filters.clientId);
      if (filters?.serviceId) params.append('serviceId', filters.serviceId);
      
      const response = await makeRequest.get(`/business/businesses/${businessId}/payments?${params.toString()}`);
      return response.data as BusinessPayment[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!businessId,
  });
};

// Hook para criar pagamento
export const useCriarPagamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ businessId, pagamento }: { businessId: string; pagamento: NovoPagamento }) => {
      const response = await makeRequest.post(`/business/businesses/${businessId}/payments`, pagamento);
      return response.data;
    },
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({ queryKey: ['businessPayments', businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao criar pagamento');
    },
  });
};

// Hook para atualizar pagamento
export const useAtualizarPagamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, pagamento }: { id: string; pagamento: Partial<NovoPagamento> & { status?: string; paymentDate?: string; incomeId?: string } }) => {
      const response = await makeRequest.put(`/business/payments/${id}`, pagamento);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['businessPayments', data.businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao atualizar pagamento');
    },
  });
};

// Hook para marcar pagamento como pago
export const useMarcarComoPago = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, incomeId, paymentMethod, paymentDate }: { 
      id: string; 
      incomeId?: string; 
      paymentMethod?: string; 
      paymentDate?: string; 
    }) => {
      const response = await makeRequest.put(`/business/payments/${id}/mark-paid`, {
        incomeId,
        paymentMethod,
        paymentDate
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['businessPayments', data.businessId] });
      queryClient.invalidateQueries({ queryKey: ['businessIncomes', data.businessId] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao marcar pagamento como pago');
    },
  });
};

// Hook para deletar pagamento
export const useDeletarPagamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeRequest.delete(`/business/payments/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessPayments'] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
    },
    onError: (error) => {
      console.error(error);
      throw new Error('Erro ao deletar pagamento');
    },
  });
};
