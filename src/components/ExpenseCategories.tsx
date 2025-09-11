"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import useCategoriasCompletas, { 
  useCriarCategoria, 
  useAtualizarCategoria, 
  useDeletarCategoria,
  CategoriaCompleta 
} from "../../hooks/useCategoriasCompletas";

export default function ExpenseCategories() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoriaCompleta | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#3B82F6",
    icon: "tag",
    budget: 0
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: categories, isLoading, error } = useCategoriasCompletas();
  const criarCategoria = useCriarCategoria();
  const atualizarCategoria = useAtualizarCategoria();
  const deletarCategoria = useDeletarCategoria();

  // Debug: log do estado do modal
  console.log('Estado do modal showAddModal:', showAddModal);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!newCategory.name.trim()) {
      toast.error('Nome da categoria é obrigatório');
      return;
    }
    
    console.log('Tentando criar categoria:', newCategory);
    
    try {
      await criarCategoria.mutateAsync(newCategory);
      toast.success('Categoria criada com sucesso!');
      setShowAddModal(false);
      setNewCategory({ name: "", color: "#3B82F6", icon: "tag", budget: 0 });
    } catch (error: unknown) {
      console.error('Erro ao criar categoria:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || 
                          (error as { message?: string })?.message || 'Erro ao criar categoria';
      toast.error(errorMessage);
    }
  };

  const handleEditCategory = (category: CategoriaCompleta) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      color: category.color,
      icon: category.icon,
      budget: category.budget
    });
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    try {
      await atualizarCategoria.mutateAsync({
        id: editingCategory.id,
        ...newCategory
      });
      toast.success('Categoria atualizada com sucesso!');
      setShowEditModal(false);
      setEditingCategory(null);
      setNewCategory({ name: "", color: "#3B82F6", icon: "tag", budget: 0 });
    } catch {
      toast.error('Erro ao atualizar categoria');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        await deletarCategoria.mutateAsync(id);
        toast.success('Categoria deletada com sucesso!');
      } catch {
        toast.error('Erro ao deletar categoria');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Categorias de Despesas</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </button>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Categorias de Despesas</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </button>
        </div>
        <div className="text-center">
          <p className="text-red-500">Erro ao carregar categorias</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Categorias de Despesas
          {showAddModal && <span className="ml-2 text-sm text-blue-600">(Modal Aberto)</span>}
        </h3>
        <button
          onClick={() => {
            console.log('Botão clicado, abrindo modal...');
            setShowAddModal(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </button>
      </div>

      {categories && categories.length === 0 ? (
        <div className="text-center py-8">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
          <p className="text-gray-500">Comece criando sua primeira categoria de despesas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gasto:</span>
                  <span className="font-medium">{formatCurrency(category.totalSpent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Orçamento:</span>
                  <span className="font-medium">{formatCurrency(category.budget)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Restante:</span>
                  <span className={`font-medium ${category.remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(category.remainingBudget)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progresso</span>
                  <span>{category.percentageUsed.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      category.percentageUsed > 100 ? 'bg-red-500' : 
                      category.percentageUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(category.percentageUsed, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nova Categoria</h3>
              <button
                onClick={() => {
                  console.log('Fechando modal...');
                  setShowAddModal(false);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ícone
                </label>
                <select
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tag">Tag</option>
                  <option value="home">Casa</option>
                  <option value="car">Carro</option>
                  <option value="utensils">Comida</option>
                  <option value="shopping-cart">Compras</option>
                  <option value="heart">Saúde</option>
                  <option value="gamepad2">Lazer</option>
                  <option value="graduation-cap">Educação</option>
                  <option value="briefcase">Trabalho</option>
                  <option value="gift">Presentes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orçamento Mensal (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newCategory.budget}
                  onChange={(e) => setNewCategory({ ...newCategory, budget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={criarCategoria.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {criarCategoria.isPending ? 'Criando...' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editar Categoria</h3>
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ícone
                </label>
                <select
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tag">Tag</option>
                  <option value="home">Casa</option>
                  <option value="car">Carro</option>
                  <option value="utensils">Comida</option>
                  <option value="shopping-cart">Compras</option>
                  <option value="heart">Saúde</option>
                  <option value="gamepad2">Lazer</option>
                  <option value="graduation-cap">Educação</option>
                  <option value="briefcase">Trabalho</option>
                  <option value="gift">Presentes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orçamento Mensal (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newCategory.budget}
                  onChange={(e) => setNewCategory({ ...newCategory, budget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={atualizarCategoria.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {atualizarCategoria.isPending ? 'Atualizando...' : 'Atualizar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCategory(null);
                    setNewCategory({ name: "", color: "#3B82F6", icon: "tag", budget: 0 });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Teste Simples - Portal */}
      {showAddModal && mounted && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 99999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Modal de Teste</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-4">Se você está vendo isso, o modal está funcionando!</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  console.log('Testando criação de categoria...');
                  // Aqui você pode testar a criação
                }}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Testar API
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
} 