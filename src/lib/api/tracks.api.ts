import apiClient from '../api-client';
import type { Track, CreateTrackDto } from '../../types/album.types';

export const tracksApi = {
  getAll: async (): Promise<Track[]> => {
    const { data } = await apiClient.get<Track[]>('/tracks');
    return data;
  },

  getById: async (id: string): Promise<Track> => {
    const { data } = await apiClient.get<Track>(`/tracks/${id}`);
    return data;
  },

  create: async (dto: CreateTrackDto): Promise<Track> => {
    const { data } = await apiClient.post<Track>('/tracks', dto);
    return data;
  },

  uploadAudio: async (id: string, file: File): Promise<Track> => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await apiClient.post<Track>(`/tracks/${id}/audio`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
