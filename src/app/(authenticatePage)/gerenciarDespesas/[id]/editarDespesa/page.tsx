'use client'
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import {  useAtualizarDespesa, useDespesasById, useCategoriasDespesas } from '../../../../../../hooks/useDespesas';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { DespesaFormData, despesaSchema } from '@/app/(authenticatePage)/novaDespesa/page';



function EditarDespesaPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const despesaId = id ? String(id) : '';
  const { data: despesa, isLoading, error } = useDespesasById(despesaId);
  const { data: categorias } = useCategoriasDespesas();
  const atualizarDespesa = useAtualizarDespesa();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<DespesaFormData>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      type: 'FIXA',
      status: 'PENDENTE',
      isRecurring: false,
    },
  });

  const isRecurring = watch('isRecurring');

  // Atualizar o formulário quando os dados da despesa forem carregados
  useEffect(() => {
    if (despesa) {
      reset({
        description: despesa.description || '',
        amount: despesa.amount?.toString() || '',
        type: despesa.type || 'FIXA',
        dueDate: despesa.dueDate ? despesa.dueDate.split('T')[0] : '',
        isRecurring: despesa.isRecurring || false,
        recurringInterval: despesa.recurringInterval || '',
      });
    }
  }, [despesa, reset]);

  const onSubmit = async (data: DespesaFormData) => {
    if (!despesa?.id) return;
    
    setLoading(true);
    try {
      const dadosAtualizacao = {
        description: data.description,
        amount: Number(data.amount),
        type: data.type,
        dueDate: data.dueDate || undefined,
        isRecurring: data.isRecurring || false,
        recurringInterval: data.recurringInterval || undefined,
      };

      await atualizarDespesa.mutateAsync({ id: despesa.id, ...dadosAtualizacao });
      toast.success('Despesa atualizada com sucesso!');
      router.push('/gerenciarDespesas');
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      toast.error('Erro ao atualizar despesa');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 margin-6 bg-white border-gray-200 border-2 rounded-lg">
      {/* Header */}
      <div className="margin-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2 bg-gray-100" />
          Voltar
        </Button>
      <h1 className="text-3xl font-bold text-gray-900">Editar Despesa</h1>
      <p className="text-gray-600 mt-2">Edite os dados da sua despesa {despesa?.description}</p>
    </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Informações da Despesa {despesa?.description}    
          </CardTitle>
          <CardDescription>
            Preencha os dados da sua despesa {despesa?.description}
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
              >
                <option value="">
                  Selecione uma categoria
                </option>
                {categorias?.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>

            {/* Tipo de Despesa */}
            <div className="space-y-2">
              <Label htmlFor="type" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tipo de Despesa *
              </Label>
              <select
                id="type"
                {...register('type')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="FIXA">Fixa</option>
                <option value="IMPREVISTA">Imprevista</option>
                <option value="PENDENTE">Pendente</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
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
                <option value="PENDENTE">Pendente</option>
                <option value="PAGO">Pago</option>
                <option value="ATRASADO">Atrasado</option>
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

export default EditarDespesaPage;