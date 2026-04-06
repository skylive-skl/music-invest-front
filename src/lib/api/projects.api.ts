import apiClient from "../api-client";
import type { Project, CreateProjectDto } from "../../types/project.types";

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const { data } = await apiClient.get<Project[]>("/projects");
    return data;
  },

  getByArtist: async (artistId: string): Promise<Project[]> => {
    const { data } = await apiClient.get<Project[]>("/projects", {
      params: { artistId },
    });
    return data;
  },

  getById: async (id: string): Promise<Project> => {
    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
  },

  create: async (dto: CreateProjectDto): Promise<Project> => {
    const { data } = await apiClient.post<Project>("/projects", dto);
    return data;
  },

  uploadCover: async (id: string, file: File): Promise<Project> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<Project>(
      `/projects/${id}/cover`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  },

  uploadMedia: async (id: string, files: File[]): Promise<Project> => {
    const form = new FormData();
    files.forEach((file) => {
      form.append("files", file);
    });
    const { data } = await apiClient.post<Project>(
      `/projects/${id}/media`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  },
};
