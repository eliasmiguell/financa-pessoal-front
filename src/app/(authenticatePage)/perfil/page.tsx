"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Mail, Phone, Calendar, Edit, Save, X, Shield, Settings } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUserProfile, useUserStats, useUpdateProfile, useChangePassword } from '../../../../hooks/useUser';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function PerfilPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // Hooks para dados
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: userStats } = useUserStats();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  // Formulário de perfil
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userProfile?.name || '',
      email: userProfile?.email || '',
    }
  });

  // Formulário de senha
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Atualizar valores do formulário quando os dados carregarem
  useEffect(() => {
    if (userProfile) {
      profileForm.reset({
        name: userProfile.name,
        email: userProfile.email,
      });
    }
  }, [userProfile, profileForm]);

  const handleSaveProfile = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
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

  const handleCancel = () => {
    setIsEditing(false);
    profileForm.reset({
      name: userProfile?.name || '',
      email: userProfile?.email || '',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
    });
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600 mt-2">Gerencie suas informações pessoais</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button 
                  onClick={profileForm.handleSubmit(handleSaveProfile)} 
                  disabled={updateProfile.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfile.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Pessoais */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Suas informações básicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      {...profileForm.register('name')}
                      disabled={!isEditing}
                      className={profileForm.formState.errors.name ? 'border-red-500' : ''}
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-red-500">{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...profileForm.register('email')}
                      disabled={!isEditing}
                      className={profileForm.formState.errors.email ? 'border-red-500' : ''}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preferências */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>
                Configure suas preferências de uso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Moeda Padrão</Label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={!isEditing}
                >
                  <option value="BRL">Real Brasileiro (R$)</option>
                  <option value="USD">Dólar Americano ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Formato de Data</Label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={!isEditing}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Avatar e Estatísticas */}
        <div className="space-y-6">
          {/* Avatar */}
          <Card>
            <CardHeader>
              <CardTitle>Foto do Perfil</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
              {isEditing && (
                <Button variant="outline" size="sm">
                  Alterar Foto
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Membro desde</span>
                </div>
                <span className="text-sm font-medium">
                  {userProfile ? formatDate(userProfile.createdAt) : 'Carregando...'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Despesas</span>
                </div>
                <span className="text-sm font-medium">
                  {userStats?.totalExpenses || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Receitas</span>
                </div>
                <span className="text-sm font-medium">
                  {userStats?.totalIncomes || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Metas</span>
                </div>
                <span className="text-sm font-medium">
                  {userStats?.totalGoals || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                <Shield className="w-4 h-4 mr-2" />
                Alterar Senha
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/configuracoes')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </CardContent>
          </Card>

          {/* Formulário de Alteração de Senha */}
          {showPasswordForm && (
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
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
      </div>
    </div>
  );
}
