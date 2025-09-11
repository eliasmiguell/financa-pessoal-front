"use client";

import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Shield } from "lucide-react";

interface FinancialSummaryProps {
  data: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    savings: number;
    emergencyFund: number;
  };
}

export default function FinancialSummary({ data }: FinancialSummaryProps) {
  const isPositive = data.balance >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {/* Saldo Total */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Saldo Total</p>
            <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(data.balance)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`ml-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? 'Positivo' : 'Negativo'}
          </span>
        </div>
      </div>

      {/* Receitas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Receitas</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(data.totalIncome)}
            </p>
          </div>
        </div>
      </div>

      {/* Despesas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Despesas</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(data.totalExpenses)}
            </p>
          </div>
        </div>
      </div>

      {/* Economia */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <PiggyBank className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Economia</p>
            <p className="text-2xl font-bold text-yellow-600">
              {formatCurrency(data.savings)}
            </p>
          </div>
        </div>
      </div>

      {/* Fundo de Emergência */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Fundo de Emergência</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(data.emergencyFund)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 