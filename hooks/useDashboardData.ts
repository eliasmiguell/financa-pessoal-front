import { useQuery } from '@tanstack/react-query';
import useDespesas from './useDespesas';
import useReceitas from './useReceitas';
import useMetas from './useMetas';

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savings: number;
  emergencyFund: number;
  recentExpenses: any[];
  upcomingExpenses: any[];
  goalsProgress: any[];
}

const useDashboardData = () => {
  const { data: despesas, isLoading: loadingDespesas } = useDespesas();
  const { data: receitas, isLoading: loadingReceitas } = useReceitas();
  const { data: metas, isLoading: loadingMetas } = useMetas();

  const isLoading = loadingDespesas || loadingReceitas || loadingMetas;

  // Calcular totais
  const totalIncome = receitas?.reduce((sum, receita) => sum + receita.amount, 0) || 0;
  const totalExpenses = despesas?.reduce((sum, despesa) => sum + despesa.amount, 0) || 0;
  const balance = totalIncome - totalExpenses;

  // Calcular economia (20% das receitas)
  const savings = totalIncome * 0.2;

  // Fundo de emergência (3 meses de despesas)
  const emergencyFund = totalExpenses * 3;

  // Despesas recentes (últimas 5)
  const recentExpenses = despesas
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) || [];

  // Próximas despesas (pendentes e próximas ao vencimento)
  const upcomingExpenses = despesas
    ?.filter(despesa => despesa.status === 'pendente' || despesa.status === 'vencido')
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5) || [];

  // Progresso das metas
  const goalsProgress = metas?.map(meta => ({
    ...meta,
    progress: (meta.currentAmount / meta.targetAmount) * 100
  })) || [];

  const data: DashboardData = {
    totalIncome,
    totalExpenses,
    balance,
    savings,
    emergencyFund,
    recentExpenses,
    upcomingExpenses,
    goalsProgress
  };

  return {
    data,
    isLoading,
    error: null
  };
};

export default useDashboardData;
