"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useDespesas, { useDeletarDespesa, Despesa } from '../../../../hooks/useDespesas';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Calendar, 
  Tag,
  Filter,
  Search
} from 'lucide-react';

export default function GerenciarDespesasPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const { data: despesas, isLoading, error } = useDespesas();
  const deletarDespesa = useDeletarDespesa();

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta despesa?')) {
      try {
        await deletarDespesa.mutateAsync(id);
        toast.success('Despesa deletada com sucesso!');
      } catch (error) {
        toast.error('Erro ao deletar despesa');
      }
    }
  };

  const filteredDespesas = despesas?.filter(despesa => {
    const matchesSearch = despesa.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || despesa.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      case 'pago':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'vencido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-500">Erro ao carregar despesas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Despesas</h1>
            <p className="text-gray-600 mt-2">Visualize e gerencie todas as suas despesas</p>
          </div>
          <Button onClick={() => router.push('/novaDespesa')}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Despesa
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="vencido">Vencido</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Despesas */}
      <div className="grid gap-4">
        {filteredDespesas?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma despesa encontrada</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'todos' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece adicionando sua primeira despesa'
                }
              </p>
              <Button onClick={() => router.push('/novaDespesa')}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Despesa
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredDespesas?.map((despesa) => (
            <Card key={despesa.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {despesa.description}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(despesa.status)}`}>
                        {despesa.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">{formatCurrency(despesa.amount)}</span>
                      </div>
                      
                      {despesa.category && (
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span>{despesa.category.name}</span>
                        </div>
                      )}
                      
                      {despesa.dueDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Vence em {formatDate(despesa.dueDate)}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Criado em {formatDate(despesa.createdAt)}
                      {despesa.isRecurring && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          Recorrente
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/editarDespesa/${despesa.id}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(despesa.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Resumo */}
      {filteredDespesas && filteredDespesas.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(filteredDespesas.reduce((sum, d) => sum + d.amount, 0))}
                </p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredDespesas.filter(d => d.status === 'pago').length}
                </p>
                <p className="text-sm text-gray-500">Pagas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredDespesas.filter(d => d.status === 'pendente').length}
                </p>
                <p className="text-sm text-gray-500">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
