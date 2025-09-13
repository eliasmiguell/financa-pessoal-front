"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useCriarNegocio, NovoNegocio } from '../../../../hooks/useNegocios';
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

export default function NovoNegocioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const criarNegocio = useCriarNegocio();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NegocioFormData>({
    resolver: zodResolver(negocioSchema),
    defaultValues: {
      type: 'SALAO',
    },
  });

  const onSubmit = async (data: NegocioFormData) => {
    setLoading(true);
    try {
      const novoNegocio: NovoNegocio = {
        name: data.name,
        description: data.description || undefined,
        type: data.type,
      };

      await criarNegocio.mutateAsync(novoNegocio);
      toast.success('Negócio criado com sucesso!');
      router.push('/gerenciarNegocios');
    } catch (error) {
      console.error('Erro ao criar negócio:', error);
      toast.error('Erro ao criar negócio');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Novo Negócio</h1>
        <p className="text-gray-600 mt-2">Crie um novo negócio para gerenciar suas finanças</p>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Informações do Negócio
          </CardTitle>
          <CardDescription>
            Preencha os dados do seu novo negócio
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
                disabled={loading || criarNegocio.isPending}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading || criarNegocio.isPending ? 'Criando...' : 'Criar Negócio'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
