import apiClient from '../api-client';
import type { Investment, CreateInvestmentDto } from '../../types/investment.types';

export const investmentsApi = {
  invest: async (dto: CreateInvestmentDto): Promise<Investment> => {
    const { data } = await apiClient.post<Investment>('/investments', dto);
    return data;
  },

  getMyInvestments: async (): Promise<Investment[]> => {
    const { data } = await apiClient.get<Investment[]>('/investments/my-investments');
    return data;
  },
};
