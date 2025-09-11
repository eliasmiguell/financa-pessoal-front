"use client";

import { useState } from "react";
import FinancialSummary from "../../../components/FinancialSummary";
import ExpenseCategories from "../../../components/ExpenseCategories";
import ExpenseList from "../../../components/ExpenseList";
import IncomeList from "../../../components/IncomeList";
import FinancialGoals from "../../../components/FinancialGoals";
import SavingsSuggestions from "../../../components/SavingsSuggestions";
import BusinessSection from "../../../components/BusinessSection";
import ChartsSection from "../../../components/ChartsSection";
import useDashboardData from "../../../../hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Calendar, DollarSign, AlertCircle } from "lucide-react";
import DebugAuth from "../../../components/DebugAuth";

export default function MainDashboard() {
  const [activeTab] = useState("dashboard");
  const { data: dashboardData, isLoading } = useDashboardData();

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* Debug Auth - REMOVER DEPOIS */}
                <DebugAuth />
                
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
                        {dashboardData.upcomingExpenses.map((despesa) => (
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
                              <p className={`text-sm ${
                                despesa.status === 'vencido' ? 'text-red-500' : 'text-gray-500'
                              }`}>
                                {despesa.dueDate ? formatDate(despesa.dueDate) : 'Sem data'}
                                {despesa.status === 'vencido' && (
                                  <AlertCircle className="w-3 h-3 inline ml-1" />
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
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