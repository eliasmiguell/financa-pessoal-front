'use client'
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Save, DollarSign, FileText, TrendingUp } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useAtualizarReceita, useReceitasById } from "../../../../../../hooks/useReceitas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

const receitaSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valor deve ser um número positivo'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  receivedDate: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.string().optional(),
});

type ReceitaFormData = z.infer<typeof receitaSchema>;

function EditarReceitaPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  
  // Converter o ID para string e verificar se é válido
  const receitaId = id ? String(id) : '';
  const { data: receita, isLoading, error } = useReceitasById(receitaId);
  const atualizarReceita = useAtualizarReceita();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ReceitaFormData>({
    resolver: zodResolver(receitaSchema),
    defaultValues: {
      type: 'SALARIO',
      isRecurring: false,
    },
  });

  const isRecurring = watch('isRecurring');

  // Atualizar o formulário quando os dados da receita forem carregados
  useEffect(() => {
    if (receita) {
      reset({
        description: receita.description || '',
        amount: receita.amount?.toString() || '',
        type: receita.type || 'SALARIO',
        receivedDate: receita.receivedDate ? receita.receivedDate.split('T')[0] : '',
        isRecurring: receita.isRecurring || false,
        recurringInterval: receita.recurringInterval || '',
      });
    }
  }, [receita, reset]);

  const onSubmit = async (data: ReceitaFormData) => {
    if (!receita?.id) return;
    
    setLoading(true);
    try {
      const dadosAtualizacao = {
        description: data.description,
        amount: Number(data.amount),
        type: data.type,
        receivedDate: data.receivedDate || undefined,
        isRecurring: data.isRecurring || false,
        recurringInterval: data.recurringInterval || undefined,
      };

      await atualizarReceita.mutateAsync({ id: receita.id, ...dadosAtualizacao });
      toast.success('Receita atualizada com sucesso!');
      router.push('/gerenciarReceitas');
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      toast.error('Erro ao atualizar receita');
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar se o ID é válido (CUIDs são strings com pelo menos 25 caracteres)
  if (!id || receitaId.length < 25) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">ID Inválido</h1>
          <p className="text-gray-600 mb-4">O ID da receita não é válido.</p>
          <Button onClick={() => router.push('/gerenciarReceitas')}>
            Voltar para Receitas
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao Carregar</h1>
          <p className="text-gray-600 mb-4">Não foi possível carregar a receita.</p>
          <Button onClick={() => router.push('/gerenciarReceitas')}>
            Voltar para Receitas
          </Button>
        </div>
      </div>
    );
  }

  if (!receita) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Receita Não Encontrada</h1>
          <p className="text-gray-600 mb-4">A receita solicitada não foi encontrada.</p>
          <Button onClick={() => router.push('/gerenciarReceitas')}>
            Voltar para Receitas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Formulário de Edição */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">

            <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button >
          </CardTitle>
          <CardDescription>
          <div className="flex justify-between items-center">
          
          <div>
          <TrendingUp className="w-5 h-5" />
            <h1 className="text-3xl font-bold text-gray-900">Editar Receita</h1>
            <p className="text-gray-600 mt-2">Edite os dados da receita: {receita.description}</p>
          </div>
        </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Descrição *
              </Label>
              <Input
                id="description"
                placeholder="Ex: Salário, Freelance, Venda, etc."
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Valor *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                {...register('amount')}
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <select
                id="type"
                {...register('type')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="SALARIO">Salário</option>
                <option value="FREELANCE">Freelance</option>
                <option value="VENDA">Venda</option>
                <option value="INVESTIMENTO">Investimento</option>
                <option value="BONUS">Bônus</option>
                <option value="OUTRO">Outros</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Data de Recebimento */}
            <div className="space-y-2">
              <Label htmlFor="receivedDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data de Recebimento
              </Label>
              <Input
                id="receivedDate"
                type="date"
                {...register('receivedDate')}
              />
            </div>

            {/* Receita Recorrente */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  {...register('isRecurring')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isRecurring">Receita Recorrente</Label>
              </div>
            </div>

            {/* Intervalo de Recorrência */}
            {isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="recurringInterval">Intervalo de Recorrência</Label>
                <select
                  id="recurringInterval"
                  {...register('recurringInterval')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione o intervalo</option>
                  <option value="mensal">Mensal</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || atualizarReceita.isPending}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading || atualizarReceita.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditarReceitaPage;