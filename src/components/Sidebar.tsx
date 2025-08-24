"use client";

import { 
  Home, 
  Target, 
  Building2, 
  BarChart3, 
  Settings,
  Plus,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: Home,
    description: "Visão geral das finanças"
  },
  {
    id: "expenses",
    name: "Despesas",
    icon: TrendingDown,
    description: "Gerenciar despesas"
  },
  {
    id: "income",
    name: "Receitas",
    icon: TrendingUp,
    description: "Gerenciar receitas"
  },
  {
    id: "goals",
    name: "Metas",
    icon: Target,
    description: "Metas financeiras"
  },
  {
    id: "business",
    name: "Negócios",
    icon: Building2,
    description: "Gestão empresarial"
  },
  {
    id: "analytics",
    name: "Análises",
    icon: BarChart3,
    description: "Relatórios e gráficos"
  }
];

const quickActions = [
  {
    id: "add-expense",
    name: "Nova Despesa",
    icon: Plus,
    color: "text-red-600 bg-red-50 hover:bg-red-100"
  },
  {
    id: "add-income",
    name: "Nova Receita",
    icon: Plus,
    color: "text-green-600 bg-green-50 hover:bg-green-100"
  },
  {
    id: "add-goal",
    name: "Nova Meta",
    icon: Target,
    color: "text-purple-600 bg-purple-50 hover:bg-purple-100"
  }
];

export default function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header do Sidebar */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h2 className="ml-3 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Finanças
              </h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Principal */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 transition-colors duration-200
                    ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                  `} />
                  <div className="text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Ações Rápidas */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Ações Rápidas
            </h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                
                return (
                  <button
                    key={action.id}
                    className={`
                      w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${action.color}
                    `}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {action.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 