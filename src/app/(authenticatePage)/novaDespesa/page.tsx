"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import useAdicionarDespesa, { NovaDespesa } from '../../../../hooks/useAdicionarDespesa';
import useCategoriasDespesas from '../../../../hooks/useCategoriasDespesas';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { ArrowLeft, Save, DollarSign, Calendar, Tag, FileText } from 'lucide-react';

const despesaSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valor deve ser um número positivo'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  status: z.string().min(1, 'Status é obrigatório'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  dueDate: z.string().optional(),
  paidDate: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.string().optional(),
});

type DespesaFormData = z.infer<typeof despesaSchema>;

export default function NovaDespesaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const adicionarDespesa = useAdicionarDespesa();
  const { data: categorias, isLoading: loadingCategorias, error: errorCategorias } = useCategoriasDespesas();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DespesaFormData>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      type: 'despesa',
      status: 'pendente',
      isRecurring: false,
    },
  });

  const isRecurring = watch('isRecurring');

  // Mostrar erro se não conseguir carregar categorias
  if (errorCategorias) {
    toast.error('Erro ao carregar categorias');
  }

  const onSubmit = async (data: DespesaFormData) => {
    setLoading(true);
    try {
      const novaDespesa: NovaDespesa = {
        description: data.description,
        amount: Number(data.amount),
        type: data.type,
        status: data.status,
        categoryId: Number(data.categoryId),
        dueDate: data.dueDate || undefined,
        paidDate: data.paidDate || undefined,
        isRecurring: data.isRecurring || false,
        recurringInterval: data.recurringInterval || undefined,
      };

      await adicionarDespesa.mutateAsync(novaDespesa);
      toast.success('Despesa adicionada com sucesso!');
      router.push('/main');
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      toast.error('Erro ao adicionar despesa');
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
        <h1 className="text-3xl font-bold text-gray-900">Nova Despesa</h1>
        <p className="text-gray-600 mt-2">Adicione uma nova despesa ao seu controle financeiro</p>
      </div>

        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Informações da Despesa
            </CardTitle>
            <CardDescription>
              Preencha os dados da sua nova despesa
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
                  placeholder="Ex: Supermercado, Conta de luz, etc."
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

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="categoryId" className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Categoria *
                </Label>
                <select
                  id="categoryId"
                  {...register('categoryId')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loadingCategorias}
                >
                  <option value="">
                    {loadingCategorias ? 'Carregando categorias...' : 'Selecione uma categoria'}
                  </option>
                  {categorias?.map((categoria: { id: number; name: string }) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  {...register('status')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.status ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="vencido">Vencido</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>

              {/* Data de Vencimento */}
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data de Vencimento
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register('dueDate')}
                />
              </div>

              {/* Data de Pagamento */}
              <div className="space-y-2">
                <Label htmlFor="paidDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data de Pagamento
                </Label>
                <Input
                  id="paidDate"
                  type="date"
                  {...register('paidDate')}
                />
              </div>

              {/* Despesa Recorrente */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    {...register('isRecurring')}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isRecurring">Despesa Recorrente</Label>
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
                  {loading ? 'Salvando...' : 'Salvar Despesa'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  );
}
