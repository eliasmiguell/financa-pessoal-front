import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface Categoria {
  id: number;
  name: string;
  color: string;
  icon: string;
  budget: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

const useCategoriasDespesas = () => {
  const query = useQuery({
    queryKey: ['categorias-despesas'],
    queryFn: async () => {
      const response = await makeRequest.get('/api/personal-finance/categories');
      return response.data as Categoria[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return query;
};

export default useCategoriasDespesas;
