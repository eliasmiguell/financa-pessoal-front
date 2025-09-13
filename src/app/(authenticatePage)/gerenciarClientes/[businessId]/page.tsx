"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Edit, Trash2, Users, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { useBusinessClients, useCriarCliente, useDeletarCliente, useAtualizarCliente, BusinessClient } from '../../../../../hooks/useBusinessClients';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const clienteSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

export default function GerenciarClientesPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.businessId as string;
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<string | null>(null);

  const { data: clientes, isLoading } = useBusinessClients(businessId);
  const criarCliente = useCriarCliente();
  const atualizarCliente = useAtualizarCliente();
  const deletarCliente = useDeletarCliente();

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    }
  });

  const onSubmit = async (data: ClienteFormData) => {
    try {
      if (editingCliente) {
        await atualizarCliente.mutateAsync({
          id: editingCliente,
          cliente: {
            name: data.name,
            email: data.email || undefined,
            phone: data.phone || undefined,
            address: data.address || undefined,
            notes: data.notes || undefined,
          }
        });
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await criarCliente.mutateAsync({
          businessId,
          cliente: {
            name: data.name,
            email: data.email || undefined,
            phone: data.phone || undefined,
            address: data.address || undefined,
            notes: data.notes || undefined,
          }
        });
        toast.success('Cliente criado com sucesso!');
      }
      form.reset();
      setShowForm(false);
      setEditingCliente(null);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast.error('Erro ao salvar cliente');
    }
  };

  const handleEdit = (cliente: BusinessClient) => {
    setEditingCliente(cliente.id);
    form.reset({
      name: cliente.name,
      email: cliente.email || '',
      phone: cliente.phone || '',
      address: cliente.address || '',
      notes: cliente.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await deletarCliente.mutateAsync(id);
        toast.success('Cliente deletado com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        toast.error('Erro ao deletar cliente');
      }
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-2">Gerencie os clientes do seu negócio</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingCliente ? 'Editar Cliente' : 'Novo Cliente'}</CardTitle>
            <CardDescription>{editingCliente ? 'Edite as informações do cliente' : 'Adicione um novo cliente ao seu negócio'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Maria Silva"
                    {...form.register('name')}
                    className={form.formState.errors.name ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="maria@email.com"
                    {...form.register('email')}
                    className={form.formState.errors.email ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    {...form.register('phone')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    placeholder="Rua, número, bairro"
                    {...form.register('address')}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    placeholder="Informações adicionais sobre o cliente"
                    {...form.register('notes')}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCliente(null);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={criarCliente.isPending || atualizarCliente.isPending}>
                  {(criarCliente.isPending || atualizarCliente.isPending) ? 'Salvando...' : (editingCliente ? 'Atualizar Cliente' : 'Salvar Cliente')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientes?.map((cliente) => (
          <Card key={cliente.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">{cliente.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(cliente)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(cliente.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {cliente.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{cliente.email}</span>
                </div>
              )}
              {cliente.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{cliente.phone}</span>
                </div>
              )}
              {cliente.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{cliente.address}</span>
                </div>
              )}
              {cliente.notes && (
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                  <span>{cliente.notes}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {clientes?.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente cadastrado</h3>
            <p className="text-gray-600 mb-4">Comece adicionando clientes ao seu negócio</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Cliente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
