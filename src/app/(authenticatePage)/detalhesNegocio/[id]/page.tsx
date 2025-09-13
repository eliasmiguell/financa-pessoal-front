"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useNegocioById } from '../../../../../hooks/useNegocios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Building2, 
  Calendar, 
  DollarSign,
  Package,
  Wrench,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  CreditCard
} from 'lucide-react';

export default function DetalhesNegocioPage() {
  const router = useRouter();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  const negocioId = id ? String(id) : '';
  const { data: negocio, isLoading, error } = useNegocioById(negocioId);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateTotalRevenue = () => {
    if (!negocio?.incomes) return 0;
    return negocio.incomes.reduce((sum, income) => sum + income.amount, 0);
  };

  const calculateTotalExpenses = () => {
    if (!negocio?.expenses) return 0;
    return negocio.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const calculateProfit = () => {
    return calculateTotalRevenue() - calculateTotalExpenses();
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !negocio) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao Carregar</h1>
          <p className="text-gray-600 mb-4">Não foi possível carregar o negócio.</p>
          <Button onClick={() => router.push('/gerenciarNegocios')}>
            Voltar para Negócios
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Building2 },
    { id: 'materials', label: 'Materiais', icon: Package },
    { id: 'services', label: 'Serviços', icon: Wrench },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'finances', label: 'Finanças', icon: DollarSign },
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">{negocio.name}</h1>
            <p className="text-gray-600 mt-2">{negocio.description || 'Sem descrição'}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {negocio.type === 'SALAO' ? 'Salão de Beleza' : 
                 negocio.type === 'MAQUIAGEM' ? 'Maquiagem' : 'Outro'}
              </span>
              <span>Criado em {formatDate(negocio.createdAt)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/editarNegocio/${negocio.id}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Resumo Financeiro */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(calculateTotalRevenue())}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Despesas Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(calculateTotalExpenses())}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Lucro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                calculateProfit() >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(calculateProfit())}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Margem de Lucro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {calculateTotalRevenue() > 0 
                  ? `${((calculateProfit() / calculateTotalRevenue()) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Materiais</h3>
            <Button onClick={() => router.push(`/gerenciarMateriais/${negocio.id}`)}>
              <Plus className="w-4 h-4 mr-2" />
              Gerenciar Materiais
            </Button>
          </div>
          {negocio.materials && negocio.materials.length > 0 ? (
            <div className="grid gap-4">
              {negocio.materials.map((material) => (
                <Card key={material.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{material.name}</h4>
                        <p className="text-sm text-gray-600">{material.description}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>Custo: {formatCurrency(material.cost)}</span>
                          <span>Quantidade: {material.quantity} {material.unit}</span>
                          <span>Estoque Mín: {material.minStock}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                      <div className="flex gap-1">
                
                </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum material cadastrado</h3>
                <p className="text-gray-500 mb-4">Comece adicionando materiais ao seu negócio</p>
                <Button onClick={() => router.push(`/gerenciarMateriais/${negocio.id}`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Gerenciar Materiais
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Serviços</h3>
            <Button onClick={() => router.push(`/gerenciarServicos/${negocio.id}`)}>
              <Plus className="w-4 h-4 mr-2" />
              Gerenciar Serviços
            </Button>
          </div>
          {negocio.services && negocio.services.length > 0 ? (
            <div className="grid gap-4">
              {negocio.services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>Preço: {formatCurrency(service.price)}</span>
                          <span>Custo Total: {formatCurrency(service.totalCost)}</span>
                          <span>Lucro: {formatCurrency(service.profit)}</span>
                          <span>Margem: {service.profitMargin.toFixed(1)}%</span>
                        </div>
                      </div>
                      
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço cadastrado</h3>
                <p className="text-gray-500 mb-4">Comece adicionando serviços ao seu negócio</p>
                <Button onClick={() => router.push(`/gerenciarServicos/${negocio.id}`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Gerenciar Serviços
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Clientes</h3>
            <Button onClick={() => router.push(`/gerenciarClientes/${negocio.id}`)}>
              <Plus className="w-4 h-4 mr-2" />
              Gerenciar Clientes
            </Button>
          </div>
          {negocio.clients && negocio.clients.length > 0 ? (
            <div className="grid gap-4">
              {negocio.clients.map((client) => (
                <Card key={client.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{client.name}</h4>
                        {client.email && <p className="text-sm text-gray-600">{client.email}</p>}
                        {client.phone && <p className="text-sm text-gray-600">{client.phone}</p>}
                        {client.address && <p className="text-sm text-gray-600">{client.address}</p>}
                        {client.notes && <p className="text-sm text-gray-500 mt-2">{client.notes}</p>}
                      </div>
                      
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente cadastrado</h3>
                <p className="text-gray-500 mb-4">Comece adicionando clientes ao seu negócio</p>
                <Button onClick={() => router.push(`/gerenciarClientes/${negocio.id}`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Gerenciar Clientes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'finances' && (
        <div className="space-y-6">
          {/* Botões de Ação */}
          <div className="flex gap-4">
            <Button onClick={() => router.push(`/gerenciarReceitasNegocio/${negocio.id}`)}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Gerenciar Receitas
            </Button>
            <Button onClick={() => router.push(`/gerenciarDespesasNegocio/${negocio.id}`)}>
              <TrendingDown className="w-4 h-4 mr-2" />
              Gerenciar Despesas
            </Button>
            <Button onClick={() => router.push(`/gerenciarPagamentos/${negocio.id}`)}>
              <CreditCard className="w-4 h-4 mr-2" />
              Gerenciar Pagamentos
            </Button>
          </div>

          {/* Receitas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {negocio.incomes && negocio.incomes.length > 0 ? (
                <div className="space-y-3">
                  {negocio.incomes.map((income) => (
                    <div key={income.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">{income.description}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(income.date)} • {income.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(income.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma receita registrada</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Despesas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {negocio.expenses && negocio.expenses.length > 0 ? (
                <div className="space-y-3">
                  {negocio.expenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(expense.date)} • {expense.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma despesa registrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
