"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useMetas, { useDeletarMeta, Meta } from '../../../../hooks/useMetas';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Target, 
  Calendar, 
  DollarSign,
  Filter,
  Search,
  AlertCircle
} from 'lucide-react';

export default function GerenciarMetasPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('todos');
  const { data: metas, isLoading, error } = useMetas();
  const deletarMeta = useDeletarMeta();

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta meta?')) {
      try {
        await deletarMeta.mutateAsync(id);
        toast.success('Meta deletada com sucesso!');
      } catch (error) {
        toast.error('Erro ao deletar meta');
      }
    }
  };

  const filteredMetas = metas?.filter(meta => {
    const matchesSearch = meta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (meta.description && meta.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = priorityFilter === 'todos' || meta.priority === priorityFilter;
    return matchesSearch && matchesPriority;
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'ALTA':
        return 'bg-red-100 text-red-800';
      case 'MEDIA':
        return 'bg-yellow-100 text-yellow-800';
      case 'BAIXA':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
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
          <p className="text-red-500">Erro ao carregar metas</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Metas</h1>
            <p className="text-gray-600 mt-2">Visualize e gerencie todas as suas metas financeiras</p>
          </div>
          <Button onClick={() => router.push('/novaMeta')}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
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
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todas as Prioridades</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Média</option>
              <option value="BAIXA">Baixa</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Metas */}
      <div className="grid gap-4">
        {filteredMetas?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma meta encontrada</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || priorityFilter !== 'todos' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando sua primeira meta financeira'
                }
              </p>
              <Button onClick={() => router.push('/novaMeta')}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Meta
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredMetas?.map((meta) => {
            const progress = getProgressPercentage(meta.currentAmount, meta.targetAmount);
            const isOverdueDeadline = meta.deadline && isOverdue(meta.deadline);
            
            return (
              <Card key={meta.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {meta.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(meta.priority)}`}>
                          {meta.priority}
                        </span>
                        {isOverdueDeadline && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Vencida
                          </span>
                        )}
                      </div>
                      
                      {meta.description && (
                        <p className="text-gray-600 mb-3">{meta.description}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium">{formatCurrency(meta.currentAmount)} / {formatCurrency(meta.targetAmount)}</span>
                        </div>
                        
                        {meta.deadline && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className={isOverdueDeadline ? 'text-red-600' : ''}>
                              {formatDate(meta.deadline)}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span>{progress.toFixed(1)}% concluído</span>
                        </div>
                      </div>

                      {/* Barra de Progresso */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progress >= 100 ? 'bg-green-500' : 
                            progress >= 75 ? 'bg-blue-500' : 
                            progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Criado em {formatDate(meta.createdAt)}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/editarMeta/${meta.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(meta.id)}
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
      {filteredMetas && filteredMetas.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(filteredMetas.reduce((sum, m) => sum + m.currentAmount, 0))}
                </p>
                <p className="text-sm text-gray-500">Total Arrecadado</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(filteredMetas.reduce((sum, m) => sum + m.targetAmount, 0))}
                </p>
                <p className="text-sm text-gray-500">Meta Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredMetas.filter(m => getProgressPercentage(m.currentAmount, m.targetAmount) >= 100).length}
                </p>
                <p className="text-sm text-gray-500">Concluídas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredMetas.filter(m => m.deadline && isOverdue(m.deadline)).length}
                </p>
                <p className="text-sm text-gray-500">Vencidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
