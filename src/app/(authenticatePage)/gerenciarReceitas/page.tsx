"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useReceitas, { useDeletarReceita, Receita } from '../../../../hooks/useReceitas';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';

export default function GerenciarReceitasPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const { data: receitas, isLoading, error } = useReceitas();
  const deletarReceita = useDeletarReceita();

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta receita?')) {
      try {
        await deletarReceita.mutateAsync(id);
        toast.success('Receita deletada com sucesso!');
      } catch (error) {
        toast.error('Erro ao deletar receita');
      }
    }
  };

  const filteredReceitas = receitas?.filter(receita => {
    const matchesSearch = receita.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'todos' || receita.type === typeFilter;
    return matchesSearch && matchesType;
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'salario':
        return 'bg-blue-100 text-blue-800';
      case 'freelance':
        return 'bg-green-100 text-green-800';
      case 'venda':
        return 'bg-purple-100 text-purple-800';
      case 'investimento':
        return 'bg-yellow-100 text-yellow-800';
      case 'bonus':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'salario':
        return 'Salário';
      case 'freelance':
        return 'Freelance';
      case 'venda':
        return 'Venda';
      case 'investimento':
        return 'Investimento';
      case 'bonus':
        return 'Bônus';
      default:
        return 'Outros';
    }
  };

  if (isLoading) {
    return (
      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-500">Erro ao carregar receitas</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Receitas</h1>
            <p className="text-gray-600 mt-2">Visualize e gerencie todas as suas receitas</p>
          </div>
          <Button onClick={() => router.push('/novaReceita')}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Receita
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os Tipos</option>
              <option value="salario">Salário</option>
              <option value="freelance">Freelance</option>
              <option value="venda">Venda</option>
              <option value="investimento">Investimento</option>
              <option value="bonus">Bônus</option>
              <option value="outros">Outros</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Receitas */}
      <div className="grid gap-4">
        {filteredReceitas?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma receita encontrada</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || typeFilter !== 'todos' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece adicionando sua primeira receita'
                }
              </p>
              <Button onClick={() => router.push('/novaReceita')}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Receita
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredReceitas?.map((receita) => (
            <Card key={receita.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {receita.description}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(receita.type)}`}>
                        {getTypeLabel(receita.type)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">{formatCurrency(receita.amount)}</span>
                      </div>
                      
                      {receita.receivedDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Recebido em {formatDate(receita.receivedDate)}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Criado em {formatDate(receita.createdAt)}
                      {receita.isRecurring && (
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
                      onClick={() => router.push(`/gerenciarReceitas/${receita.id}/editarReceita`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(receita.id.toString())}
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
      {filteredReceitas && filteredReceitas.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(filteredReceitas.reduce((sum, r) => sum + r.amount, 0))}
                </p>
                <p className="text-sm text-gray-500">Total Recebido</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {filteredReceitas.length}
                </p>
                <p className="text-sm text-gray-500">Total de Receitas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
