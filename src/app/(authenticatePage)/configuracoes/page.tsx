"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Settings, User, Bell, Shield, Palette, Database } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUserProfile, useUpdateProfile, useChangePassword } from '../../../../hooks/useUser';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const settingsSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  address: z.string().optional(),
  currency: z.string().optional(),
  dateFormat: z.string().optional(),
  theme: z.string().optional(),
  language: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  paymentReminders: z.boolean().optional(),
  monthlyReports: z.boolean().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type SettingsFormData = z.infer<typeof settingsSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      currency: 'BRL',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
      language: 'pt-BR',
      emailNotifications: true,
      paymentReminders: true,
      monthlyReports: false,
    }
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Atualizar valores do formulário quando os dados carregarem
  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name,
        email: userProfile.email,
        phone: '',
        address: '',
        currency: 'BRL',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light',
        language: 'pt-BR',
        emailNotifications: true,
        paymentReminders: true,
        monthlyReports: false,
      });
    }
  }, [userProfile, form]);

  const handleSave = async (data: SettingsFormData) => {
    try {
      await updateProfile.mutateAsync({
        name: data.name,
        email: data.email,
      });
      toast.success('Configurações salvas com sucesso!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar configurações';
      toast.error(errorMessage);
    }
  };

  const handleChangePassword = async (data: PasswordFormData) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Senha alterada com sucesso!');
      setShowPasswordForm(false);
      passwordForm.reset();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar senha';
      toast.error(errorMessage);
    }
  };

  if (profileLoading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
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
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">Gerencie suas preferências e configurações</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSave)}>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil
            </CardTitle>
            <CardDescription>
              Informações pessoais e preferências
            </CardDescription>
          </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
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
                  {...form.register('phone')}
                />
              </div>
            </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você quer ser notificado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email de despesas</Label>
                <p className="text-sm text-gray-500">Receber notificações por email</p>
              </div>
              <input 
                type="checkbox" 
                {...form.register('emailNotifications')}
                className="rounded" 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Lembretes de pagamento</Label>
                <p className="text-sm text-gray-500">Notificações de vencimento</p>
              </div>
              <input 
                type="checkbox" 
                {...form.register('paymentReminders')}
                className="rounded" 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Relatórios mensais</Label>
                <p className="text-sm text-gray-500">Resumo financeiro mensal</p>
              </div>
              <input 
                type="checkbox" 
                {...form.register('monthlyReports')}
                className="rounded" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize a interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <select 
                  {...form.register('theme')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Idioma</Label>
                <select 
                  {...form.register('language')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Alterar Senha
            </Button>
            <Button variant="outline" className="w-full">
              Autenticação de Dois Fatores
            </Button>
            <Button variant="outline" className="w-full">
              Sessões Ativas
            </Button>
          </CardContent>
        </Card>

        {/* Dados */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Dados
            </CardTitle>
            <CardDescription>
              Gerencie seus dados financeiros
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                Exportar Dados
              </Button>
              <Button variant="outline" className="w-full">
                Importar Dados
              </Button>
              <Button variant="outline" className="w-full">
                Backup Automático
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                Excluir Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botão Salvar */}
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={updateProfile.isPending}>
          <Settings className="w-4 h-4 mr-2" />
          {updateProfile.isPending ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
      </form>

      {/* Formulário de Alteração de Senha */}
      {showPasswordForm && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Digite sua senha atual e a nova senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input 
                  id="currentPassword" 
                  type="password"
                  {...passwordForm.register('currentPassword')}
                  className={passwordForm.formState.errors.currentPassword ? 'border-red-500' : ''}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input 
                  id="newPassword" 
                  type="password"
                  {...passwordForm.register('newPassword')}
                  className={passwordForm.formState.errors.newPassword ? 'border-red-500' : ''}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  {...passwordForm.register('confirmPassword')}
                  className={passwordForm.formState.errors.confirmPassword ? 'border-red-500' : ''}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowPasswordForm(false);
                    passwordForm.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={changePassword.isPending}
                >
                  {changePassword.isPending ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
