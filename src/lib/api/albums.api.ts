import apiClient from '../api-client';
import type { Album, CreateAlbumDto } from '../../types/album.types';

export const albumsApi = {
  getAll: async (): Promise<Album[]> => {
    const { data } = await apiClient.get<Album[]>('/albums');
    return data;
  },

  getById: async (id: string): Promise<Album> => {
    const { data } = await apiClient.get<Album>(`/albums/${id}`);
    return data;
  },

  create: async (dto: CreateAlbumDto): Promise<Album> => {
    const { data } = await apiClient.post<Album>('/albums', dto);
    return data;
  },

  uploadCover: async (id: string, file: File): Promise<Album> => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await apiClient.post<Album>(`/albums/${id}/cover`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
