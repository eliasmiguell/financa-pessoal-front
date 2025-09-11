"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useNegocios, { useDeletarNegocio, Negocio } from '../../../../hooks/useNegocios';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Building2, 
  Calendar, 
  DollarSign,
  Filter,
  Search,
  Users,
  Package,
  Wrench
} from 'lucide-react';

export default function GerenciarNegociosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: negocios, isLoading, error } = useNegocios();
  const deletarNegocio = useDeletarNegocio();

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este negócio?')) {
      try {
        await deletarNegocio.mutateAsync(id);
        toast.success('Negócio deletado com sucesso!');
      } catch (error) {
        toast.error('Erro ao deletar negócio');
      }
    }
  };

  const filteredNegocios = negocios?.filter(negocio => {
    const matchesSearch = negocio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (negocio.description && negocio.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateTotalRevenue = (negocio: Negocio) => {
    if (!negocio.incomes) return 0;
    return negocio.incomes.reduce((sum: number, income: any) => sum + (income.amount || 0), 0);
  };

  const calculateTotalExpenses = (negocio: Negocio) => {
    if (!negocio.expenses) return 0;
    return negocio.expenses.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
          <p className="text-red-500">Erro ao carregar negócios</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Negócios</h1>
            <p className="text-gray-600 mt-2">Visualize e gerencie todos os seus negócios</p>
          </div>
          <Button onClick={() => router.push('/novoNegocio')}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Negócio
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
                  placeholder="Buscar por nome ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Negócios */}
      <div className="grid gap-4">
        {filteredNegocios?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum negócio encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando seu primeiro negócio'
                }
              </p>
              <Button onClick={() => router.push('/novoNegocio')}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Negócio
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredNegocios?.map((negocio) => {
            const totalRevenue = calculateTotalRevenue(negocio);
            const totalExpenses = calculateTotalExpenses(negocio);
            const profit = totalRevenue - totalExpenses;
            
            return (
              <Card key={negocio.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {negocio.name}
                        </h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Ativo
                        </span>
                      </div>
                      
                      {negocio.description && (
                        <p className="text-gray-600 mb-4">{negocio.description}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-600">{formatCurrency(totalRevenue)}</span>
                          <span className="text-xs text-gray-500">Receita</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-red-600">{formatCurrency(totalExpenses)}</span>
                          <span className="text-xs text-gray-500">Despesas</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(profit)}
                          </span>
                          <span className="text-xs text-gray-500">Lucro</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Criado em {formatDate(negocio.createdAt)}</span>
                        </div>
                      </div>

                      {/* Estatísticas */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{negocio.clients?.length || 0} clientes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>{negocio.materials?.length || 0} materiais</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wrench className="w-3 h-3" />
                          <span>{negocio.services?.length || 0} serviços</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{(negocio.incomes?.length || 0) + (negocio.expenses?.length || 0)} transações</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/detalhesNegocio/${negocio.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(negocio.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Resumo */}
      {filteredNegocios && filteredNegocios.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Resumo Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {filteredNegocios.length}
                </p>
                <p className="text-sm text-gray-500">Total de Negócios</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(filteredNegocios.reduce((sum, n) => sum + calculateTotalRevenue(n), 0))}
                </p>
                <p className="text-sm text-gray-500">Receita Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(filteredNegocios.reduce((sum, n) => sum + calculateTotalExpenses(n), 0))}
                </p>
                <p className="text-sm text-gray-500">Despesas Totais</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(filteredNegocios.reduce((sum, n) => sum + (calculateTotalRevenue(n) - calculateTotalExpenses(n)), 0))}
                </p>
                <p className="text-sm text-gray-500">Lucro Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
