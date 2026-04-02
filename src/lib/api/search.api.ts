import apiClient from '../api-client';
import type { SearchResult } from '../../types/search.types';

export type SearchType = 'track' | 'album' | 'artist' | 'project';

export const searchApi = {
  search: async (q: string, types?: SearchType[]): Promise<SearchResult> => {
    const params: Record<string, string> = { q };
    if (types && types.length > 0) {
      params.type = types.join(',');
    }
    const { data } = await apiClient.get<SearchResult>('/search', { params });
    return data;
  },
};
