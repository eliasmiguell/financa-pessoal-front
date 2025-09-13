"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useAdicionarMeta, NovaMeta } from '../../../../hooks/useMetas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Target, DollarSign, Calendar, FileText, AlertCircle } from 'lucide-react';

const metaSchema = z.object({
  name: z.string().min(1, 'Nome da meta é obrigatório'),
  description: z.string().optional(),
  targetAmount: z.string().min(1, 'Valor alvo é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valor deve ser um número positivo'),
  deadline: z.string().optional(),
  priority: z.enum(['BAIXA', 'MEDIA', 'ALTA'], {
    required_error: 'Prioridade é obrigatória',
  }),
});

type MetaFormData = z.infer<typeof metaSchema>;

export default function NovaMetaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const adicionarMeta = useAdicionarMeta();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MetaFormData>({
    resolver: zodResolver(metaSchema),
    defaultValues: {
      priority: 'MEDIA',
    },
  });

  const onSubmit = async (data: MetaFormData) => {
    setLoading(true);
    try {
      const novaMeta: NovaMeta = {
        name: data.name,
        description: data.description || undefined,
        targetAmount: Number(data.targetAmount),
        deadline: data.deadline || undefined,
        priority: data.priority,
      };

      await adicionarMeta.mutateAsync(novaMeta);
      toast.success('Meta criada com sucesso!');
      router.push('/main');
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      toast.error('Erro ao criar meta');
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
        <h1 className="text-3xl font-bold text-gray-900">Nova Meta Financeira</h1>
        <p className="text-gray-600 mt-2">Defina uma nova meta para seus objetivos financeiros</p>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Informações da Meta
          </CardTitle>
          <CardDescription>
            Preencha os dados da sua nova meta financeira
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome da Meta */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Nome da Meta *
              </Label>
              <Input
                id="name"
                placeholder="Ex: Viagem para Europa, Reserva de Emergência, etc."
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
                placeholder="Descreva sua meta com mais detalhes..."
                {...register('description')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
              />
            </div>

            {/* Valor Alvo */}
            <div className="space-y-2">
              <Label htmlFor="targetAmount" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Valor Alvo *
              </Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                placeholder="0,00"
                {...register('targetAmount')}
                className={errors.targetAmount ? 'border-red-500' : ''}
              />
              {errors.targetAmount && (
                <p className="text-sm text-red-500">{errors.targetAmount.message}</p>
              )}
            </div>

            {/* Data Limite */}
            <div className="space-y-2">
              <Label htmlFor="deadline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data Limite
              </Label>
              <Input
                id="deadline"
                type="date"
                {...register('deadline')}
              />
              <p className="text-sm text-gray-500">
                Quando você gostaria de alcançar esta meta?
              </p>
            </div>

            {/* Prioridade */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Prioridade *
              </Label>
              <select
                id="priority"
                {...register('priority')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.priority ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
              {errors.priority && (
                <p className="text-sm text-red-500">{errors.priority.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Defina a prioridade desta meta em relação às suas outras metas
              </p>
            </div>

            {/* Dicas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para suas metas:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Seja específico sobre o que você quer alcançar</li>
                <li>• Defina prazos realistas</li>
                <li>• Considere dividir metas grandes em menores</li>
                <li>• Revise suas metas regularmente</li>
              </ul>
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
                disabled={loading}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Salvando...' : 'Criar Meta'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
