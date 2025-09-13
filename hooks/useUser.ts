import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalExpenses: number;
  totalIncomes: number;
  totalGoals: number;
  totalCategories: number;
  memberSince: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

// Hook para buscar perfil do usuário
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await makeRequest.get('/profile');
      return response.data as UserProfile;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar estatísticas do usuário
export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      const response = await makeRequest.get('/stats');
      return response.data as UserStats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para atualizar perfil
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await makeRequest.put('/profile', data);
      return response.data as UserProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error: ApiError) => {
      console.error(error);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil');
    },
  });
};

// Hook para alterar senha
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await makeRequest.put('/change-password', data);
      return response.data;
    },
    onError: (error: ApiError) => {
      console.error(error);
      throw new Error(error.response?.data?.message || 'Erro ao alterar senha');
    },
  });
};
