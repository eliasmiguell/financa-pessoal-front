"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Edit, Trash2, TrendingUp, DollarSign, Calendar, CreditCard, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { useBusinessIncomes, useCriarReceitaNegocio, useDeletarReceitaNegocio, useAtualizarReceitaNegocio, BusinessIncome } from '../../../../../hooks/useBusinessIncomes';
import { useBusinessServices } from '../../../../../hooks/useBusinessServices';
import { useBusinessClients } from '../../../../../hooks/useBusinessClients';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const receitaSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valor deve ser um número positivo'),
  serviceId: z.string().optional(),
  clientId: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
  paymentMethod: z.enum(['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'TRANSFERENCIA', 'OUTRO'], {
    required_error: 'Método de pagamento é obrigatório',
  }),
});

type ReceitaFormData = z.infer<typeof receitaSchema>;

export default function GerenciarReceitasNegocioPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.businessId as string;
  const [showForm, setShowForm] = useState(false);
  const [editingReceita, setEditingReceita] = useState<string | null>(null);

  const { data: receitas, isLoading } = useBusinessIncomes(businessId);
  const { data: servicos } = useBusinessServices(businessId);
  const { data: clientes } = useBusinessClients(businessId);
  const criarReceita = useCriarReceitaNegocio();
  const atualizarReceita = useAtualizarReceitaNegocio();
  const deletarReceita = useDeletarReceitaNegocio();

  const form = useForm<ReceitaFormData>({
    resolver: zodResolver(receitaSchema),
    defaultValues: {
      description: '',
      amount: '',
      serviceId: '',
      clientId: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'DINHEIRO',
    }
  });

  const onSubmit = async (data: ReceitaFormData) => {
    try {
      if (editingReceita) {
        await atualizarReceita.mutateAsync({
          id: editingReceita,
          receita: {
            description: data.description,
            amount: Number(data.amount),
            serviceId: data.serviceId || undefined,
            clientId: data.clientId || undefined,
            date: data.date,
            paymentMethod: data.paymentMethod,
          }
        });
        toast.success('Receita atualizada com sucesso!');
      } else {
        await criarReceita.mutateAsync({
          businessId,
          receita: {
            description: data.description,
            amount: Number(data.amount),
            serviceId: data.serviceId || undefined,
            clientId: data.clientId || undefined,
            date: data.date,
            paymentMethod: data.paymentMethod,
          }
        });
        toast.success('Receita criada com sucesso!');
      }
      form.reset();
      setEditingReceita(null);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      toast.error('Erro ao salvar receita');
    }
  };

  const handleEdit = (receita: BusinessIncome) => {
    setEditingReceita(receita.id);
    form.reset({
      description: receita.description,
      amount: receita.amount.toString(),
      serviceId: receita.serviceId || '',
      clientId: receita.clientId || '',
      date: new Date(receita.date).toISOString().split('T')[0],
      paymentMethod: receita.paymentMethod,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta receita?')) {
      try {
        await deletarReceita.mutateAsync(id);
        toast.success('Receita deletada com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar receita:', error);
        toast.error('Erro ao deletar receita');
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

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      DINHEIRO: 'Dinheiro',
      PIX: 'PIX',
      CARTAO_CREDITO: 'Cartão de Crédito',
      CARTAO_DEBITO: 'Cartão de Débito',
      TRANSFERENCIA: 'Transferência',
      OUTRO: 'Outro'
    };
    return methods[method as keyof typeof methods] || method;
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
            <h1 className="text-3xl font-bold text-gray-900">Receitas do Negócio</h1>
            <p className="text-gray-600 mt-2">Gerencie as receitas do seu negócio</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Receita
          </Button>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingReceita ? 'Editar Receita' : 'Nova Receita'}</CardTitle>
            <CardDescription>{editingReceita ? 'Edite as informações da receita' : 'Adicione uma nova receita ao seu negócio'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Input
                    id="description"
                    placeholder="Ex: Maquiagem para festa"
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
                  <Label htmlFor="serviceId">Serviço</Label>
                  <select
                    id="serviceId"
                    {...form.register('serviceId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um serviço</option>
                    {servicos?.map((servico) => (
                      <option key={servico.id} value={servico.id}>
                        {servico.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientId">Cliente</Label>
                  <select
                    id="clientId"
                    {...form.register('clientId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes?.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.name}
                      </option>
                    ))}
                  </select>
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
                  <Label htmlFor="paymentMethod">Método de Pagamento *</Label>
                  <select
                    id="paymentMethod"
                    {...form.register('paymentMethod')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      form.formState.errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="DINHEIRO">Dinheiro</option>
                    <option value="PIX">PIX</option>
                    <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                    <option value="CARTAO_DEBITO">Cartão de Débito</option>
                    <option value="TRANSFERENCIA">Transferência</option>
                    <option value="OUTRO">Outro</option>
                  </select>
                  {form.formState.errors.paymentMethod && (
                    <p className="text-sm text-red-500">{form.formState.errors.paymentMethod.message}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingReceita(null);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={criarReceita.isPending || atualizarReceita.isPending}>
                  {(criarReceita.isPending || atualizarReceita.isPending) ? 'Salvando...' : (editingReceita ? 'Atualizar Receita' : 'Salvar Receita')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Receitas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {receitas?.map((receita) => (
          <Card key={receita.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg">{receita.description}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(receita)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(receita.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>Valor: {formatCurrency(receita.amount)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Pagamento: {getPaymentMethodLabel(receita.paymentMethod)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span>Data: {formatDate(receita.date)}</span>
              </div>
              {receita.serviceId && servicos && (
                <div className="text-sm text-gray-600">
                  Serviço: {servicos.find(s => s.id === receita.serviceId)?.name}
                </div>
              )}
              {receita.clientId && clientes && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>Cliente: {clientes.find(c => c.id === receita.clientId)?.name}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {receitas?.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma receita cadastrada</h3>
            <p className="text-gray-600 mb-4">Comece adicionando receitas ao seu negócio</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Receita
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
