"use client";

import { useState, useEffect } from "react";
import FinancialSummary from "../../../components/FinancialSummary";
import ExpenseCategories from "../../../components/ExpenseCategories";
import ExpenseList from "../../../components/ExpenseList";
import IncomeList from "../../../components/IncomeList";
import FinancialGoals from "../../../components/FinancialGoals";
import SavingsSuggestions from "../../../components/SavingsSuggestions";
import BusinessSection from "../../../components/BusinessSection";
import ChartsSection from "../../../components/ChartsSection";
import useDashboardData from "../../../../hooks/useDashboardData";
import useNegocios from "../../../../hooks/useNegocios";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Calendar, DollarSign, AlertCircle, CreditCard, Clock } from "lucide-react";
import { makeRequest } from "../../../../axios";


export default function MainDashboard() {
  const [activeTab] = useState("dashboard");
  const [allPendingPayments, setAllPendingPayments] = useState<any[]>([]);
  const { data: dashboardData, isLoading } = useDashboardData();
  const { data: negocios } = useNegocios();
  
  // Buscar pagamentos pendentes de todos os negócios
  useEffect(() => {
    const fetchPendingPayments = async () => {
      if (!negocios || negocios.length === 0) {
        setAllPendingPayments([]);
        return;
      }

      try {
        const paymentPromises = negocios.map(async (negocio) => {
          try {
            const response = await makeRequest.get(`/business/businesses/${negocio.id}/payments?status=PENDING`);
            return response.data.map((p: any) => ({ ...p, businessName: negocio.name }));
          } catch (error) {
            console.error(`Erro ao buscar pagamentos do negócio ${negocio.name}:`, error);
            return [];
          }
        });

        const allPayments = await Promise.all(paymentPromises);
        const flatPayments = allPayments.flat();
        setAllPendingPayments(flatPayments);
      } catch (error) {
        console.error('Erro ao buscar pagamentos pendentes:', error);
        setAllPendingPayments([]);
      }
    };

    fetchPendingPayments();
  }, [negocios]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                
                
                {/* Financial Summary */}
                <FinancialSummary data={dashboardData} />
                
                {/* Charts Section */}
                <ChartsSection />
                
                {/* Expense Categories */}
                <ExpenseCategories />
                
                {/* Savings Suggestions */}
                <SavingsSuggestions />
                
                {/* Próximas Despesas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Próximas Despesas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.upcomingExpenses.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhuma despesa pendente</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dashboardData.upcomingExpenses.map((despesa) => {
                          const daysUntilDue = despesa.dueDate ? 
                            Math.ceil((new Date(despesa.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
                            null;
                          
                          const getStatusColor = () => {
                            if (despesa.status === 'ATRASADO') return 'bg-red-50 border-red-200';
                            if (daysUntilDue !== null && daysUntilDue <= 3) return 'bg-yellow-50 border-yellow-200';
                            if (daysUntilDue !== null && daysUntilDue <= 7) return 'bg-orange-50 border-orange-200';
                            return 'bg-gray-50 border-gray-200';
                          };

                          const getStatusText = () => {
                            if (despesa.status === 'ATRASADO') return 'Atrasado';
                            if (daysUntilDue === null) return 'Sem data';
                            if (daysUntilDue <= 0) return 'Vence hoje';
                            if (daysUntilDue === 1) return 'Vence amanhã';
                            if (daysUntilDue <= 7) return `Vence em ${daysUntilDue} dias`;
                            return `Vence em ${daysUntilDue} dias`;
                          };

                          const getStatusTextColor = () => {
                            if (despesa.status === 'ATRASADO') return 'text-red-600';
                            if (daysUntilDue !== null && daysUntilDue <= 3) return 'text-yellow-600';
                            if (daysUntilDue !== null && daysUntilDue <= 7) return 'text-orange-600';
                            return 'text-gray-600';
                          };

                          return (
                            <div key={despesa.id} className={`p-4 rounded-lg border ${getStatusColor()}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-gray-900">{despesa.description}</p>
                                    {despesa.status === 'ATRASADO' && (
                                      <AlertCircle className="w-4 h-4 text-red-500" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 mb-2">
                                    {despesa.category?.name || 'Sem categoria'}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs">
                                    <span className={`font-medium ${getStatusTextColor()}`}>
                                      {getStatusText()}
                                    </span>
                                    {despesa.isRecurring && (
                                      <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                        Recorrente
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900 text-lg">
                                    {formatCurrency(despesa.amount)}
                                  </p>
                                  {despesa.dueDate && (
                                    <p className="text-sm text-gray-500">
                                      {formatDate(despesa.dueDate)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Resumo das próximas despesas */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-900">
                              Total das próximas despesas:
                            </span>
                            <span className="font-semibold text-blue-900">
                              {formatCurrency(
                                dashboardData.upcomingExpenses.reduce((total, despesa) => total + despesa.amount, 0)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Despesas Recentes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Despesas Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.recentExpenses.length === 0 ? (
                      <div className="text-center py-8">
                        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhuma despesa registrada</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dashboardData.recentExpenses.map((despesa) => (
                          <div key={despesa.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{despesa.description}</p>
                              <p className="text-sm text-gray-500">
                                {despesa.category?.name || 'Sem categoria'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(despesa.amount)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(despesa.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pagamentos Pendentes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Pagamentos Pendentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {allPendingPayments.length === 0 ? (
                      <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhum pagamento pendente</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {allPendingPayments.slice(0, 5).map((pagamento) => (
                          <div key={pagamento.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-yellow-600" />
                              <div>
                                <p className="font-medium text-gray-900">{pagamento.description}</p>
                                <p className="text-sm text-gray-600">
                                  {pagamento.client.name} • {pagamento.businessName}
                                </p>
                                {pagamento.dueDate && (
                                  <p className="text-xs text-yellow-600">
                                    Vence: {formatDate(pagamento.dueDate)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(pagamento.amount)}
                              </p>
                              <p className="text-xs text-yellow-600 font-medium">
                                Pendente
                              </p>
                            </div>
                          </div>
                        ))}
                        {allPendingPayments.length > 5 && (
                          <div className="text-center pt-2">
                            <p className="text-sm text-gray-500">
                              E mais {allPendingPayments.length - 5} pagamentos pendentes
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

      {activeTab === "expenses" && <ExpenseList />}
      {activeTab === "income" && <IncomeList />}
      {activeTab === "goals" && <FinancialGoals />}
      {activeTab === "business" && <BusinessSection />}
      {activeTab === "analytics" && <ChartsSection />}
    </div>
  );
}