"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useAtualizarNegocio, useNegocioById, NovoNegocio } from '../../../../../hooks/useNegocios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Building2, FileText, Tag } from 'lucide-react';

const negocioSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  type: z.enum(['SALAO', 'MAQUIAGEM', 'OUTRO'], {
    required_error: 'Tipo de negócio é obrigatório',
  }),
});

type NegocioFormData = z.infer<typeof negocioSchema>;

export default function EditarNegocioPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  
  const negocioId = id ? String(id) : '';
  const { data: negocio, isLoading, error } = useNegocioById(negocioId);
  const atualizarNegocio = useAtualizarNegocio();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NegocioFormData>({
    resolver: zodResolver(negocioSchema),
    defaultValues: {
      type: 'SALAO',
    },
  });

  // Atualizar o formulário quando os dados do negócio forem carregados
  useEffect(() => {
    if (negocio) {
      reset({
        name: negocio.name || '',
        description: negocio.description || '',
        type: negocio.type || 'SALAO',
      });
    }
  }, [negocio, reset]);

  const onSubmit = async (data: NegocioFormData) => {
    if (!negocio?.id) return;
    
    setLoading(true);
    try {
      const dadosAtualizacao: Partial<NovoNegocio> = {
        name: data.name,
        description: data.description || undefined,
        type: data.type,
      };

      await atualizarNegocio.mutateAsync({ id: negocio.id, ...dadosAtualizacao });
      toast.success('Negócio atualizado com sucesso!');
      router.push('/gerenciarNegocios');
    } catch (error) {
      console.error('Erro ao atualizar negócio:', error);
      toast.error('Erro ao atualizar negócio');
    } finally {
      setLoading(false);
    }
  };

  // Verificar se o ID é válido
  if (!id || negocioId.length < 25) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">ID Inválido</h1>
          <p className="text-gray-600 mb-4">O ID do negócio não é válido.</p>
          <Button onClick={() => router.push('/gerenciarNegocios')}>
            Voltar para Negócios
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao Carregar</h1>
          <p className="text-gray-600 mb-4">Não foi possível carregar o negócio.</p>
          <Button onClick={() => router.push('/gerenciarNegocios')}>
            Voltar para Negócios
          </Button>
        </div>
      </div>
    );
  }

  if (!negocio) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Negócio Não Encontrado</h1>
          <p className="text-gray-600 mb-4">O negócio solicitado não foi encontrado.</p>
          <Button onClick={() => router.push('/gerenciarNegocios')}>
            Voltar para Negócios
          </Button>
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
        <h1 className="text-3xl font-bold text-gray-900">Editar Negócio</h1>
        <p className="text-gray-600 mt-2">Edite os dados do negócio: {negocio.name}</p>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Informações do Negócio
          </CardTitle>
          <CardDescription>
            Atualize os dados do seu negócio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Nome do Negócio *
              </Label>
              <Input
                id="name"
                placeholder="Ex: Salão de Beleza Maria, Maquiagem Profissional, etc."
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Descrição
              </Label>
              <textarea
                id="description"
                placeholder="Descreva brevemente seu negócio..."
                {...register('description')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>

            {/* Tipo de Negócio */}
            <div className="space-y-2">
              <Label htmlFor="type" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tipo de Negócio *
              </Label>
              <select
                id="type"
                {...register('type')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="SALAO">Salão de Beleza</option>
                <option value="MAQUIAGEM">Maquiagem</option>
                <option value="OUTRO">Outro</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || atualizarNegocio.isPending}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading || atualizarNegocio.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
