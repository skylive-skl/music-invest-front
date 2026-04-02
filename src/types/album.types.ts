import type { User } from './user.types';

export interface Track {
  id: string;
  title: string;
  audioUrl: string | null;
  duration: number | null; // seconds
  albumId: string;
  artistId: string;
  artist?: User;
  album?: Album;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: string;
  title: string;
  coverImageUrl: string | null;
  releaseDate: string | null;
  artistId: string;
  artist?: User;
  tracks?: Track[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlbumDto {
  title: string;
  releaseDate?: string;
}

export interface CreateTrackDto {
  title: string;
  albumId: string;
}
