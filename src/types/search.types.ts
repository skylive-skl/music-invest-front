import type { Track } from './album.types';
import type { Album } from './album.types';
import type { User } from './user.types';
import type { Project } from './project.types';

export interface SearchResult {
  tracks: Track[];
  albums: Album[];
  artists: User[];
  projects: Project[];
}
