"use client";

import useDashboardData from '../../hooks/useDashboardData';
import useDespesas from '../../hooks/useDespesas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingDown, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface Suggestion {
  type: 'warning' | 'info' | 'tip' | 'success';
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export default function SavingsSuggestions() {
  const { data: dashboardData } = useDashboardData();
  const { data: despesas } = useDespesas();

  // Calcular sugestões baseadas nos dados
  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    
    if (!dashboardData || !despesas) return suggestions;

    const { totalIncome, totalExpenses, balance } = dashboardData;
    
    // Sugestão 1: Gastos excessivos
    if (totalExpenses > totalIncome * 0.8) {
      suggestions.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Gastos Elevados',
        description: 'Seus gastos representam mais de 80% da sua renda. Considere reduzir despesas desnecessárias.',
        action: 'Revisar despesas',
        priority: 'high'
      });
    }

    // Sugestão 2: Economia insuficiente
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    if (savingsRate < 20) {
      suggestions.push({
        type: 'info',
        icon: Target,
        title: 'Meta de Poupança',
        description: `Você está poupando ${savingsRate.toFixed(1)}% da sua renda. A meta recomendada é 20%.`,
        action: 'Aumentar poupança',
        priority: 'medium'
      });
    }

    // Sugestão 3: Categorias com maior gasto
    const categoryTotals = despesas.reduce((acc: Record<string, number>, despesa) => {
      const category = despesa.category?.name || 'Outros';
      acc[category] = (acc[category] || 0) + despesa.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];

    if (topCategory && (topCategory[1] as number) > totalIncome * 0.3) {
      suggestions.push({
        type: 'tip',
        icon: Lightbulb,
        title: 'Categoria com Maior Gasto',
        description: `${topCategory[0]} representa ${((topCategory[1] as number) / totalIncome * 100).toFixed(1)}% da sua renda.`,
        action: 'Otimizar gastos',
        priority: 'medium'
      });
    }

    // Sugestão 4: Parabéns por economizar bem
    if (savingsRate >= 20) {
      suggestions.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Excelente Controle!',
        description: `Você está poupando ${savingsRate.toFixed(1)}% da sua renda. Continue assim!`,
        action: 'Manter disciplina',
        priority: 'low'
      });
    }

    return suggestions.slice(0, 3); // Máximo 3 sugestões
  };

  const suggestions = generateSuggestions();

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-red-500';
      case 'info': return 'text-blue-500';
      case 'tip': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-red-50 border-red-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'tip': return 'bg-yellow-50 border-yellow-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Sugestões de Economia
        </CardTitle>
        <CardDescription>
          Dicas personalizadas para melhorar suas finanças
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Parabéns!</h3>
            <p className="text-gray-600">Suas finanças estão em ótimo estado. Continue assim!</p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => {
            const IconComponent = suggestion.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getBgColor(suggestion.type)}`}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className={`w-5 h-5 mt-0.5 ${getIconColor(suggestion.type)}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {suggestion.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {suggestion.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {suggestion.action}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
} 