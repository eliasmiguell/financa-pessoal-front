"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Edit, Trash2, Receipt, DollarSign, Calendar, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import { useBusinessExpenses, useCriarDespesaNegocio, useDeletarDespesaNegocio, useAtualizarDespesaNegocio, BusinessExpense } from '../../../../../hooks/useBusinessExpenses';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const despesaSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valor deve ser um número positivo'),
  type: z.enum(['MATERIAL', 'ALIMENTACAO', 'TRANSPORTE', 'OUTRO'], {
    required_error: 'Tipo é obrigatório',
  }),
  category: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.string().optional(),
});

type DespesaFormData = z.infer<typeof despesaSchema>;

export default function GerenciarDespesasNegocioPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.businessId as string;
  const [showForm, setShowForm] = useState(false);
  const [editingDespesa, setEditingDespesa] = useState<string | null>(null);

  const { data: despesas, isLoading } = useBusinessExpenses(businessId);
  const criarDespesa = useCriarDespesaNegocio();
  const atualizarDespesa = useAtualizarDespesaNegocio();
  const deletarDespesa = useDeletarDespesaNegocio();

  const form = useForm<DespesaFormData>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      description: '',
      amount: '',
      type: 'OUTRO',
      category: '',
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
      recurringInterval: '',
    }
  });

  const isRecurring = form.watch('isRecurring');

  const onSubmit = async (data: DespesaFormData) => {
    try {
      if (editingDespesa) {
        await atualizarDespesa.mutateAsync({
          id: editingDespesa,
          despesa: {
            description: data.description,
            amount: Number(data.amount),
            type: data.type,
            category: data.category || undefined,
            date: data.date,
            isRecurring: data.isRecurring || false,
            recurringInterval: data.recurringInterval || undefined,
          }
        });
        toast.success('Despesa atualizada com sucesso!');
      } else {
        await criarDespesa.mutateAsync({
          businessId,
          despesa: {
            description: data.description,
            amount: Number(data.amount),
            type: data.type,
            category: data.category || undefined,
            date: data.date,
            isRecurring: data.isRecurring || false,
            recurringInterval: data.recurringInterval || undefined,
          }
        });
        toast.success('Despesa criada com sucesso!');
      }
      form.reset();
      setEditingDespesa(null);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
      toast.error('Erro ao salvar despesa');
    }
  };

  const handleEdit = (despesa: BusinessExpense) => {
    setEditingDespesa(despesa.id);
    form.reset({
      description: despesa.description,
      amount: despesa.amount.toString(),
      type: despesa.type,
      category: despesa.category || '',
      date: new Date(despesa.date).toISOString().split('T')[0],
      isRecurring: despesa.isRecurring,
      recurringInterval: despesa.recurringInterval || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta despesa?')) {
      try {
        await deletarDespesa.mutateAsync(id);
        toast.success('Despesa deletada com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar despesa:', error);
        toast.error('Erro ao deletar despesa');
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTypeLabel = (type: string) => {
    const types = {
      MATERIAL: 'Material',
      ALIMENTACAO: 'Alimentação',
      TRANSPORTE: 'Transporte',
      OUTRO: 'Outro'
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Despesas do Negócio</h1>
            <p className="text-gray-600 mt-2">Gerencie as despesas do seu negócio</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Despesa
          </Button>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingDespesa ? 'Editar Despesa' : 'Nova Despesa'}</CardTitle>
            <CardDescription>{editingDespesa ? 'Edite as informações da despesa' : 'Adicione uma nova despesa ao seu negócio'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Input
                    id="description"
                    placeholder="Ex: Compra de materiais"
                    {...form.register('description')}
                    className={form.formState.errors.description ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    {...form.register('amount')}
                    className={form.formState.errors.amount ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.amount && (
                    <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <select
                    id="type"
                    {...form.register('type')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      form.formState.errors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="MATERIAL">Material</option>
                    <option value="ALIMENTACAO">Alimentação</option>
                    <option value="TRANSPORTE">Transporte</option>
                    <option value="OUTRO">Outro</option>
                  </select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...form.register('date')}
                    className={form.formState.errors.date ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.date && (
                    <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    placeholder="Ex: Materiais de maquiagem"
                    {...form.register('category')}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      {...form.register('isRecurring')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isRecurring">Despesa Recorrente</Label>
                  </div>
                </div>
                {isRecurring && (
                  <div className="space-y-2">
                    <Label htmlFor="recurringInterval">Intervalo de Recorrência</Label>
                    <select
                      id="recurringInterval"
                      {...form.register('recurringInterval')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione o intervalo</option>
                      <option value="MENSAL">Mensal</option>
                      <option value="SEMANAL">Semanal</option>
                      <option value="ANUAL">Anual</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingDespesa(null);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={criarDespesa.isPending || atualizarDespesa.isPending}>
                  {(criarDespesa.isPending || atualizarDespesa.isPending) ? 'Salvando...' : (editingDespesa ? 'Atualizar Despesa' : 'Salvar Despesa')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Despesas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {despesas?.map((despesa) => (
          <Card key={despesa.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-lg">{despesa.description}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(despesa)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(despesa.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-red-600" />
                <span>Valor: {formatCurrency(despesa.amount)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-blue-600" />
                <span>Tipo: {getTypeLabel(despesa.type)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span>Data: {formatDate(despesa.date)}</span>
              </div>
              {despesa.category && (
                <div className="text-sm text-gray-600">
                  Categoria: {despesa.category}
                </div>
              )}
              {despesa.isRecurring && (
                <div className="text-sm text-blue-600">
                  Recorrente: {despesa.recurringInterval}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {despesas?.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma despesa cadastrada</h3>
            <p className="text-gray-600 mb-4">Comece adicionando despesas ao seu negócio</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Despesa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
