"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import FinancialSummary from "@/components/FinancialSummary";
import ExpenseCategories from "@/components/ExpenseCategories";
import ExpenseList from "@/components/ExpenseList";
import IncomeList from "@/components/IncomeList";
import FinancialGoals from "@/components/FinancialGoals";
import SavingsSuggestions from "@/components/SavingsSuggestions";
import BusinessSection from "@/components/BusinessSection";
import ChartsSection from "@/components/ChartsSection";

export default function MainDashboard() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dados mockados simples para demonstração
  const mockSummary = {
    totalIncome: 5000,
    totalExpenses: 3200,
    balance: 1800,
    savings: 360,
    emergencyFund: 180
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <DashboardHeader
          user={user}
          onLogout={handleLogout}
          onMenuToggle={toggleSidebar}
          isMenuOpen={isSidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* Financial Summary */}
                <FinancialSummary data={mockSummary} />
                
                {/* Charts Section */}
                <ChartsSection />
                
                {/* Expense Categories */}
                <ExpenseCategories />
                
                {/* Savings Suggestions */}
                <SavingsSuggestions />
                
                {/* Próximas Despesas */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Próximas Despesas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Aluguel</p>
                        <p className="text-sm text-gray-500">Moradia</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">R$ 1.200,00</p>
                        <p className="text-sm text-gray-500">05/09/2024</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Conta de Luz</p>
                        <p className="text-sm text-gray-500">Serviços</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">R$ 150,00</p>
                        <p className="text-sm text-gray-500">10/09/2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "expenses" && <ExpenseList />}
            {activeTab === "income" && <IncomeList />}
            {activeTab === "goals" && <FinancialGoals />}
            {activeTab === "business" && <BusinessSection />}
            {activeTab === "analytics" && <ChartsSection />}
          </div>
        </main>
      </div>
    </div>
  );
}