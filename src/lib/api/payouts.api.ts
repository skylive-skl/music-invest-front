import apiClient from '../api-client';
import type { Payout, RevenueReport, CreateRevenueReportDto } from '../../types/investment.types';

export const payoutsApi = {
  submitRevenue: async (dto: CreateRevenueReportDto): Promise<RevenueReport> => {
    const { data } = await apiClient.post<RevenueReport>('/payouts/revenue', dto);
    return data;
  },

  getHistory: async (): Promise<Payout[]> => {
    const { data } = await apiClient.get<Payout[]>('/payouts/history');
    return data;
  },
};
