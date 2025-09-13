"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Edit, Trash2, CreditCard, DollarSign, Calendar, User, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useBusinessPayments, useCriarPagamento, useDeletarPagamento, useAtualizarPagamento, useMarcarComoPago, BusinessPayment } from '../../../../../hooks/useBusinessPayments';
import { useBusinessClients } from '../../../../../hooks/useBusinessClients';
import { useBusinessServices } from '../../../../../hooks/useBusinessServices';
import { useBusinessIncomes } from '../../../../../hooks/useBusinessIncomes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const pagamentoSchema = z.object({
  amount: z.string().min(1, 'Valor é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valor deve ser um número positivo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  serviceId: z.string().optional(),
  dueDate: z.string().optional(),
  paymentMethod: z.enum(['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'TRANSFERENCIA', 'OUTRO']).optional(),
  notes: z.string().optional(),
});

type PagamentoFormData = z.infer<typeof pagamentoSchema>;

export default function GerenciarPagamentosPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.businessId as string;
  const [showForm, setShowForm] = useState(false);
  const [editingPagamento, setEditingPagamento] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    clientId: '',
    serviceId: ''
  });

  const { data: pagamentos, isLoading } = useBusinessPayments(businessId, filters);
  const { data: clientes } = useBusinessClients(businessId);
  const { data: servicos } = useBusinessServices(businessId);
  const { data: receitas } = useBusinessIncomes(businessId);
  const criarPagamento = useCriarPagamento();
  const atualizarPagamento = useAtualizarPagamento();
  const marcarComoPago = useMarcarComoPago();
  const deletarPagamento = useDeletarPagamento();

  const form = useForm<PagamentoFormData>({
    resolver: zodResolver(pagamentoSchema),
    defaultValues: {
      amount: '',
      description: '',
      clientId: '',
      serviceId: '',
      dueDate: '',
      paymentMethod: 'DINHEIRO',
      notes: '',
    }
  });

  const onSubmit = async (data: PagamentoFormData) => {
    try {
      if (editingPagamento) {
        await atualizarPagamento.mutateAsync({
          id: editingPagamento,
          pagamento: {
            amount: Number(data.amount),
            description: data.description,
            clientId: data.clientId,
            serviceId: data.serviceId || undefined,
            dueDate: data.dueDate || undefined,
            paymentMethod: data.paymentMethod,
            notes: data.notes || undefined,
          }
        });
        toast.success('Pagamento atualizado com sucesso!');
      } else {
        await criarPagamento.mutateAsync({
          businessId,
          pagamento: {
            amount: Number(data.amount),
            description: data.description,
            clientId: data.clientId,
            serviceId: data.serviceId || undefined,
            dueDate: data.dueDate || undefined,
            paymentMethod: data.paymentMethod,
            notes: data.notes || undefined,
          }
        });
        toast.success('Pagamento criado com sucesso!');
      }
      form.reset();
      setEditingPagamento(null);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
      toast.error('Erro ao salvar pagamento');
    }
  };

  const handleEdit = (pagamento: BusinessPayment) => {
    setEditingPagamento(pagamento.id);
    form.reset({
      amount: pagamento.amount.toString(),
      description: pagamento.description,
      clientId: pagamento.clientId,
      serviceId: pagamento.serviceId || '',
      dueDate: pagamento.dueDate ? new Date(pagamento.dueDate).toISOString().split('T')[0] : '',
      paymentMethod: pagamento.paymentMethod,
      notes: pagamento.notes || '',
    });
    setShowForm(true);
  };

  const handleMarkAsPaid = async (pagamento: BusinessPayment) => {
    try {
      await marcarComoPago.mutateAsync({
        id: pagamento.id,
        paymentDate: new Date().toISOString().split('T')[0]
      });
      toast.success('Pagamento marcado como pago!');
    } catch (error) {
      console.error('Erro ao marcar pagamento como pago:', error);
      toast.error('Erro ao marcar pagamento como pago');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este pagamento?')) {
      try {
        await deletarPagamento.mutateAsync(id);
        toast.success('Pagamento deletado com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar pagamento:', error);
        toast.error('Erro ao deletar pagamento');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-green-600 bg-green-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'OVERDUE': return 'text-red-600 bg-red-100';
      case 'CANCELLED': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return CheckCircle;
      case 'PENDING': return Clock;
      case 'OVERDUE': return AlertTriangle;
      case 'CANCELLED': return Trash2;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID': return 'Pago';
      case 'PENDING': return 'Pendente';
      case 'OVERDUE': return 'Vencido';
      case 'CANCELLED': return 'Cancelado';
      default: return 'Pendente';
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
            <p className="text-gray-600 mt-2">Gerencie os pagamentos dos seus clientes</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Pagamento
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago</option>
                <option value="OVERDUE">Vencido</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
            <div>
              <Label htmlFor="clientId">Cliente</Label>
              <select
                id="clientId"
                value={filters.clientId}
                onChange={(e) => setFilters({ ...filters, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {clientes?.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="serviceId">Serviço</Label>
              <select
                id="serviceId"
                value={filters.serviceId}
                onChange={(e) => setFilters({ ...filters, serviceId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {servicos?.map((servico) => (
                  <option key={servico.id} value={servico.id}>
                    {servico.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingPagamento ? 'Editar Pagamento' : 'Novo Pagamento'}</CardTitle>
            <CardDescription>{editingPagamento ? 'Edite as informações do pagamento' : 'Adicione um novo pagamento'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="clientId">Cliente *</Label>
                  <select
                    id="clientId"
                    {...form.register('clientId')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      form.formState.errors.clientId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes?.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.name}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.clientId && (
                    <p className="text-sm text-red-500">{form.formState.errors.clientId.message}</p>
                  )}
                </div>
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
                  <Label htmlFor="serviceId">Serviço</Label>
                  <select
                    id="serviceId"
                    {...form.register('serviceId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um serviço (opcional)</option>
                    {servicos?.map((servico) => (
                      <option key={servico.id} value={servico.id}>
                        {servico.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Data de Vencimento</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    {...form.register('dueDate')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                  <select
                    id="paymentMethod"
                    {...form.register('paymentMethod')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DINHEIRO">Dinheiro</option>
                    <option value="PIX">PIX</option>
                    <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                    <option value="CARTAO_DEBITO">Cartão de Débito</option>
                    <option value="TRANSFERENCIA">Transferência</option>
                    <option value="OUTRO">Outro</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    placeholder="Observações adicionais"
                    {...form.register('notes')}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPagamento(null);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={criarPagamento.isPending || atualizarPagamento.isPending}>
                  {(criarPagamento.isPending || atualizarPagamento.isPending) ? 'Salvando...' : (editingPagamento ? 'Atualizar Pagamento' : 'Salvar Pagamento')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Pagamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pagamentos?.map((pagamento) => {
          const StatusIcon = getStatusIcon(pagamento.status);
          return (
            <Card key={pagamento.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">{formatCurrency(pagamento.amount)}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    {pagamento.status === 'PENDING' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsPaid(pagamento)}
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(pagamento)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(pagamento.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <CardDescription>{pagamento.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-600" />
                  <span>{pagamento.client.name}</span>
                </div>
                {pagamento.service && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <span>{pagamento.service.name}</span>
                  </div>
                )}
                {pagamento.dueDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>Vence: {formatDate(pagamento.dueDate)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-4 h-4" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pagamento.status)}`}>
                    {getStatusText(pagamento.status)}
                  </span>
                </div>
                {pagamento.paymentDate && (
                  <div className="text-sm text-gray-600">
                    Pago em: {formatDate(pagamento.paymentDate)}
                  </div>
                )}
                {pagamento.notes && (
                  <div className="text-sm text-gray-600">
                    {pagamento.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {pagamentos?.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pagamento cadastrado</h3>
            <p className="text-gray-600 mb-4">Comece adicionando pagamentos dos seus clientes</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Pagamento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
