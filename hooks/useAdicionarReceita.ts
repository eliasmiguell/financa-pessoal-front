import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';
import { NewReceita } from '../interface';

const useAdicionarReceita = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (newReceita: NewReceita) => {
      const res = await makeRequest.post(
        `/api/adicionarRefeita`, 
        {
          categoria_id: newReceita.categoria_id,
          conta_id: newReceita.conta_id,
          user_id: newReceita.user_id,
          descricao: newReceita.descricao,
          valor: newReceita.valor,
          tipo: newReceita.tipo,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receita'] });
    },
    onError: (error: any) => {
      console.error(error);
      throw new Error(error?.response?.data?.message || error?.message || 'Erro ao salvar os dados.');
    },
  });

  return mutate;
};

export default useAdicionarReceita;
