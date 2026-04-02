import type { Project } from './project.types';
import type { User } from './user.types';

export interface Investment {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  sharePercent: number;
  project?: Project;
  user?: User;
  payouts?: Payout[];
  createdAt: string;
  updatedAt: string;
}

export interface Payout {
  id: string;
  userId: string;
  investmentId: string;
  amount: number;
  reportId: string;
  createdAt: string;
}

export interface RevenueReport {
  id: string;
  projectId: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  payouts?: Payout[];
  createdAt: string;
}

export interface CreateInvestmentDto {
  projectId: string;
  amount: number;
}

export interface CreateRevenueReportDto {
  projectId: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
}

export interface InvestorStats {
  totalInvested: number;
  totalPayouts: number;
  totalProfit: number;
  investments: Investment[];
}
