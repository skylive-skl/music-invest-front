import type { User } from './user.types';

export type ProjectStatus = 'DRAFT' | 'FUNDING' | 'ACTIVE' | 'FAILED' | 'COMPLETED';

export interface MediaAttachment {
  id: string;
  url: string;
  filename: string;
  type: 'AUDIO' | 'VIDEO';
  projectId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
  revenueSharePercent: number;
  durationMonths: number;
  coverImageUrl: string | null;
  status: ProjectStatus;
  artistId: string;
  artist?: User;
  mediaAttachments?: MediaAttachment[];
  investments?: Investment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  fundingGoal: number;
  revenueSharePercent: number;
  durationMonths: number;
}

// Circular import workaround
interface Investment {
  id: string;
  amount: number;
  sharePercent: number;
}
