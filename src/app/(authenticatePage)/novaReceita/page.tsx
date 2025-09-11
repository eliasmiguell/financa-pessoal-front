"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import useAdicionarReceitaNova, { NovaReceita } from '../../../../hooks/useAdicionarReceitaNova';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { ArrowLeft, Save, DollarSign, Calendar, FileText, TrendingUp } from 'lucide-react';

const receitaSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valor deve ser um número positivo'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  receivedDate: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.string().optional(),
});

type ReceitaFormData = z.infer<typeof receitaSchema>;

export default function NovaReceitaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const adicionarReceita = useAdicionarReceitaNova();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ReceitaFormData>({
    resolver: zodResolver(receitaSchema),
    defaultValues: {
      type: 'salario',
      isRecurring: false,
    },
  });

  const isRecurring = watch('isRecurring');

  const onSubmit = async (data: ReceitaFormData) => {
    setLoading(true);
    try {
      const novaReceita: NovaReceita = {
        description: data.description,
        amount: Number(data.amount),
        type: data.type,
        receivedDate: data.receivedDate || undefined,
        isRecurring: data.isRecurring || false,
        recurringInterval: data.recurringInterval || undefined,
      };

      await adicionarReceita.mutateAsync(novaReceita);
      toast.success('Receita adicionada com sucesso!');
      router.push('/main');
    } catch (error) {
      console.error('Erro ao adicionar receita:', error);
      toast.error('Erro ao adicionar receita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Nova Receita</h1>
        <p className="text-gray-600 mt-2">Adicione uma nova receita ao seu controle financeiro</p>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Informações da Receita
          </CardTitle>
          <CardDescription>
            Preencha os dados da sua nova receita
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
                <option value="salario">Salário</option>
                <option value="freelance">Freelance</option>
                <option value="venda">Venda</option>
                <option value="investimento">Investimento</option>
                <option value="bonus">Bônus</option>
                <option value="outros">Outros</option>
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
                disabled={loading}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Receita'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
