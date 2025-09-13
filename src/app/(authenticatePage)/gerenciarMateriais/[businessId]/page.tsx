"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Edit, Trash2, Package, DollarSign, Hash, Ruler } from 'lucide-react';
import { toast } from 'react-toastify';
import { useBusinessMaterials, useCriarMaterial, useDeletarMaterial, useAtualizarMaterial, BusinessMaterial } from '../../../../../hooks/useBusinessMaterials';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const materialSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  cost: z.string().min(1, 'Custo é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Custo deve ser um número positivo'),
  quantity: z.string().min(1, 'Quantidade é obrigatória').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Quantidade deve ser um número positivo'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  usagePerClient: z.string().optional(),
  minStock: z.string().optional(),
  supplier: z.string().optional(),
});

type MaterialFormData = z.infer<typeof materialSchema>;

export default function GerenciarMateriaisPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.businessId as string;
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null);

  const { data: materials, isLoading } = useBusinessMaterials(businessId);
  const criarMaterial = useCriarMaterial();
  const atualizarMaterial = useAtualizarMaterial();
  const deletarMaterial = useDeletarMaterial();

  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: '',
      description: '',
      cost: '',
      quantity: '',
      unit: '',
      usagePerClient: '',
      minStock: '0',
      supplier: '',
    }
  });

  const onSubmit = async (data: MaterialFormData) => {
    try {
      if (editingMaterial) {
        await atualizarMaterial.mutateAsync({
          id: editingMaterial,
          material: {
            name: data.name,
            description: data.description || undefined,
            cost: Number(data.cost),
            quantity: Number(data.quantity),
            unit: data.unit,
            usagePerClient: data.usagePerClient ? Number(data.usagePerClient) : undefined,
            minStock: data.minStock ? Number(data.minStock) : 0,
            supplier: data.supplier || undefined,
          }
        });
        toast.success('Material atualizado com sucesso!');
      } else {
        await criarMaterial.mutateAsync({
          businessId,
          material: {
            name: data.name,
            description: data.description || undefined,
            cost: Number(data.cost),
            quantity: Number(data.quantity),
            unit: data.unit,
            usagePerClient: data.usagePerClient ? Number(data.usagePerClient) : undefined,
            minStock: data.minStock ? Number(data.minStock) : 0,
            supplier: data.supplier || undefined,
          }
        });
        toast.success('Material criado com sucesso!');
      }
      form.reset();
      setShowForm(false);
      setEditingMaterial(null);
    } catch (error) {
      console.error('Erro ao salvar material:', error);
      toast.error('Erro ao salvar material');
    }
  };

  const handleEdit = (material: BusinessMaterial) => {
    setEditingMaterial(material.id);
    form.reset({
      name: material.name,
      description: material.description || '',
      cost: material.cost.toString(),
      quantity: material.quantity.toString(),
      unit: material.unit,
      usagePerClient: material.usagePerClient?.toString() || '',
      minStock: material.minStock?.toString() || '0',
      supplier: material.supplier || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este material?')) {
      try {
        await deletarMaterial.mutateAsync(id);
        toast.success('Material deletado com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar material:', error);
        toast.error('Erro ao deletar material');
      }
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Materiais</h1>
            <p className="text-gray-600 mt-2">Gerencie os materiais do seu negócio</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Material
          </Button>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingMaterial ? 'Editar Material' : 'Novo Material'}</CardTitle>
            <CardDescription>{editingMaterial ? 'Edite as informações do material' : 'Adicione um novo material ao seu negócio'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Base líquida"
                    {...form.register('name')}
                    className={form.formState.errors.name ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Custo Unitário *</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    {...form.register('cost')}
                    className={form.formState.errors.cost ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.cost && (
                    <p className="text-sm text-red-500">{form.formState.errors.cost.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...form.register('quantity')}
                    className={form.formState.errors.quantity ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.quantity && (
                    <p className="text-sm text-red-500">{form.formState.errors.quantity.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade *</Label>
                  <Input
                    id="unit"
                    placeholder="Ex: ml, g, unidade"
                    {...form.register('unit')}
                    className={form.formState.errors.unit ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.unit && (
                    <p className="text-sm text-red-500">{form.formState.errors.unit.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usagePerClient">Uso por Cliente</Label>
                  <Input
                    id="usagePerClient"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...form.register('usagePerClient')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Estoque Mínimo</Label>
                  <Input
                    id="minStock"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...form.register('minStock')}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Input
                    id="supplier"
                    placeholder="Nome do fornecedor"
                    {...form.register('supplier')}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Descrição do material"
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
                    setEditingMaterial(null);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={criarMaterial.isPending || atualizarMaterial.isPending}>
                  {(criarMaterial.isPending || atualizarMaterial.isPending) ? 'Salvando...' : (editingMaterial ? 'Atualizar Material' : 'Salvar Material')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Materiais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials?.map((material) => (
          <Card key={material.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(material)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(material.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
              {material.description && (
                <CardDescription>{material.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>Custo: {formatCurrency(material.cost)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Hash className="w-4 h-4 text-blue-600" />
                <span>Quantidade: {material.quantity} {material.unit}</span>
              </div>
              {material.usagePerClient && (
                <div className="flex items-center gap-2 text-sm">
                  <Ruler className="w-4 h-4 text-purple-600" />
                  <span>Uso/Cliente: {material.usagePerClient} {material.unit}</span>
                </div>
              )}
              {material.supplier && (
                <div className="text-sm text-gray-600">
                  Fornecedor: {material.supplier}
                </div>
              )}
              <div className="text-sm text-gray-500">
                Estoque mínimo: {material.minStock} {material.unit}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {materials?.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum material cadastrado</h3>
            <p className="text-gray-600 mb-4">Comece adicionando materiais ao seu negócio</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Material
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
