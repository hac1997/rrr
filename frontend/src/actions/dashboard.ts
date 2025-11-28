'use server';

import { apiGet } from '@/lib/services/api-client';
import { UserStatsDTO } from '@/lib/types';

export async function getUserDashboard(userId: number): Promise<UserStatsDTO> {
  return apiGet<UserStatsDTO>(`/users/${userId}/stats`);
}
