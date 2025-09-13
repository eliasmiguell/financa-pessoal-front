"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2, Scissors, DollarSign, Clock, TrendingUp, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import { useBusinessServices, useCriarServico, useDeletarServico, useAtualizarServico, BusinessService } from '../../../../../hooks/useBusinessServices';
import { useBusinessMaterials } from '../../../../../hooks/useBusinessMaterials';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const servicoSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.string().min(1, 'Preço é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Preço deve ser um número positivo'),
  laborCost: z.string().min(1, 'Custo da mão de obra é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Custo deve ser um número positivo'),
  laborHours: z.string().min(1, 'Horas de trabalho é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Horas deve ser um número positivo'),
  foodCost: z.string().optional(),
  transportCost: z.string().optional(),
  selectedMaterials: z.array(z.object({
    materialId: z.string(),
    quantity: z.number().min(1, 'Quantidade deve ser pelo menos 1')
  })).optional(),
});

type ServicoFormData = z.infer<typeof servicoSchema>;


export default function GerenciarServicosPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.businessId as string;
  const [showForm, setShowForm] = useState(false);
  const [editingServico, setEditingServico] = useState<string | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<Array<{materialId: string, quantity: number}>>([]);
  const { data: servicos, isLoading } = useBusinessServices(businessId);
  const { data: materiais } = useBusinessMaterials(businessId);
  const criarServico = useCriarServico();
  const atualizarServico = useAtualizarServico();
  const deletarServico = useDeletarServico();

  const form = useForm<ServicoFormData>({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      laborCost: '',
      laborHours: '1',
      foodCost: '0',
      transportCost: '0',
      selectedMaterials: [],
    }
  });

  const onSubmit = async (data: ServicoFormData) => {
    try {
      // Calcular custos automaticamente
      const laborCost = Number(data.laborCost);
      const laborHours = Number(data.laborHours);
      const foodCost = Number(data.foodCost || 0);
      const transportCost = Number(data.transportCost || 0);
      
      // Calcular custo dos materiais selecionados
      let materialCost = 0;
      if (selectedMaterials.length > 0) {
        materialCost = selectedMaterials.reduce((total, mat) => {
          const material = materiais?.find(m => m.id === mat.materialId);
          return total + (material ? material.cost * mat.quantity : 0);
        }, 0);
      }

      if (editingServico) {
        await atualizarServico.mutateAsync({
          id: editingServico,
          servico: {
            name: data.name,
            description: data.description || undefined,
            price: Number(data.price),
            materials: JSON.stringify(selectedMaterials),
            laborCost,
            laborHours,
            foodCost,
            transportCost,
            materialCost,
          }
        });
        toast.success('Serviço atualizado com sucesso!');
      } else {
        await criarServico.mutateAsync({
          businessId,
          servico: {
            name: data.name,
            description: data.description || undefined,
            price: Number(data.price),
            materials: JSON.stringify(selectedMaterials),
            laborCost,
            laborHours,
            foodCost,
            transportCost,
            materialCost,
          }
        });
        toast.success('Serviço criado com sucesso!');
      }
      form.reset();
      setSelectedMaterials([]);
      setEditingServico(null);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      toast.error('Erro ao salvar serviço');
    }
  };

  const handleEdit = (servico: BusinessService) => {
    setEditingServico(servico.id);
    
    // Parse materials from JSON string
    let materials = [];
    try {
      materials = JSON.parse(servico.materials || '[]');
    } catch (e) {
      console.error('Erro ao parsear materiais:', e);
    }
    
    setSelectedMaterials(materials);
    
    form.reset({
      name: servico.name,
      description: servico.description || '',
      price: servico.price.toString(),
      laborCost: servico.laborCost.toString(),
      laborHours: servico.laborHours.toString(),
      foodCost: servico.foodCost.toString(),
      transportCost: servico.transportCost.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este serviço?')) {
      try {
        await deletarServico.mutateAsync(id);
        toast.success('Serviço deletado com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar serviço:', error);
        toast.error('Erro ao deletar serviço');
      }
    }
  };

  const addMaterial = (materialId: string) => {
    if (!selectedMaterials.find(m => m.materialId === materialId)) {
      setSelectedMaterials([...selectedMaterials, { materialId, quantity: 1 }]);
    }
  };

  const removeMaterial = (materialId: string) => {
    setSelectedMaterials(selectedMaterials.filter(m => m.materialId !== materialId));
  };

  const updateMaterialQuantity = (materialId: string, quantity: number) => {
    setSelectedMaterials(selectedMaterials.map(m => 
      m.materialId === materialId ? { ...m, quantity } : m
    ));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
            <p className="text-gray-600 mt-2">Gerencie os serviços oferecidos pelo seu negócio</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingServico ? 'Editar Serviço' : 'Novo Serviço'}</CardTitle>
            <CardDescription>{editingServico ? 'Edite as informações do serviço' : 'Adicione um novo serviço ao seu negócio'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Serviço *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Maquiagem Completa"
                    {...form.register('name')}
                    className={form.formState.errors.name ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço Cobrado *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    {...form.register('price')}
                    className={form.formState.errors.price ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="laborCost">Custo da Mão de Obra *</Label>
                  <Input
                    id="laborCost"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    {...form.register('laborCost')}
                    className={form.formState.errors.laborCost ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.laborCost && (
                    <p className="text-sm text-red-500">{form.formState.errors.laborCost.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="laborHours">Horas de Trabalho *</Label>
                  <Input
                    id="laborHours"
                    type="number"
                    step="0.5"
                    placeholder="1"
                    {...form.register('laborHours')}
                    className={form.formState.errors.laborHours ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.laborHours && (
                    <p className="text-sm text-red-500">{form.formState.errors.laborHours.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foodCost">Custo com Alimentação</Label>
                  <Input
                    id="foodCost"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    {...form.register('foodCost')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transportCost">Custo com Transporte</Label>
                  <Input
                    id="transportCost"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    {...form.register('transportCost')}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Materiais</Label>
                  
                  {/* Seleção de materiais */}
                  <div className="space-y-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addMaterial(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um material para adicionar</option>
                      {materiais?.map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.name} - {formatCurrency(material.cost)}/{material.unit}
                        </option>
                      ))}
                    </select>
                    
                    {/* Lista de materiais selecionados */}
                    {selectedMaterials.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Materiais selecionados:</p>
                        {selectedMaterials.map((selected) => {
                          const material = materiais?.find(m => m.id === selected.materialId);
                          return (
                            <div key={selected.materialId} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                              <span className="flex-1">{material?.name}</span>
                              <Input
                                type="number"
                                min="1"
                                value={selected.quantity}
                                onChange={(e) => updateMaterialQuantity(selected.materialId, Number(e.target.value))}
                                className="w-20"
                              />
                              <span className="text-sm text-gray-600">
                                {formatCurrency((material?.cost || 0) * selected.quantity)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMaterial(selected.materialId)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Descrição do serviço"
                    {...form.register('description')}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingServico(null);
                    setSelectedMaterials([]);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={criarServico.isPending || atualizarServico.isPending}>
                  {(criarServico.isPending || atualizarServico.isPending) ? 'Salvando...' : (editingServico ? 'Atualizar Serviço' : 'Salvar Serviço')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicos?.map((servico) => (
          <Card key={servico.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-lg">{servico.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(servico)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(servico.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
              {servico.description && (
                <CardDescription>{servico.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>Preço: {formatCurrency(servico.price)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Duração: {servico.laborHours}h</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>Lucro: {formatCurrency(servico.profit)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Margem: {servico.profitMargin.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">
                Custo Total: {formatCurrency(servico.totalCost)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {servicos?.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Scissors className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço cadastrado</h3>
            <p className="text-gray-600 mb-4">Comece adicionando serviços ao seu negócio</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Serviço
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
