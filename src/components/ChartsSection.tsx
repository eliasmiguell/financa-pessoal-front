"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import useDataGraficos from "../../hooks/useDadosGradtico";
import useDashboardData from "../../hooks/useDashboardData";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

export default function ChartsSection() {
  const { data: graphicData, isLoading: graphicLoading } = useDataGraficos();
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Dados reais dos gráficos
  const monthlyData = graphicData?.monthlyData || [];
  const categoryData = graphicData?.categoryData || [];

  if (graphicLoading || dashboardLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gráficos e Análises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Pizza - Despesas por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Despesas por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData && categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || `hsl(${index * 60}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Nenhuma despesa encontrada</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Receitas vs Despesas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Receitas vs Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData && monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
                <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Nenhum dado mensal encontrado</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Linha - Evolução Mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Evolução Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData && monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line 
                  type="monotone" 
                  dataKey="receitas" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Receitas"
                />
                <Line 
                  type="monotone" 
                  dataKey="despesas" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Despesas"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Nenhum dado mensal encontrado</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium">Total de Receitas</span>
              <span className="text-green-800 font-bold">
                {formatCurrency(dashboardData?.totalIncome || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-700 font-medium">Total de Despesas</span>
              <span className="text-red-800 font-bold">
                {formatCurrency(dashboardData?.totalExpenses || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium">Saldo Atual</span>
              <span className={`font-bold ${
                (dashboardData?.totalIncome || 0) - (dashboardData?.totalExpenses || 0) >= 0 
                  ? 'text-green-800' 
                  : 'text-red-800'
              }`}>
                {formatCurrency((dashboardData?.totalIncome || 0) - (dashboardData?.totalExpenses || 0))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 