import apiClient from '../api-client';
import type { User, Wallet } from '../../types/user.types';

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/users/me');
    return data;
  },

  getWallet: async (): Promise<Wallet> => {
    const { data } = await apiClient.get<Wallet>('/users/wallet');
    return data;
  },
};
