import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Music, Disc3, ArrowLeft } from "lucide-react";
import { usersApi } from "../lib/api/users.api";
import { albumsApi } from "../lib/api/albums.api";
import { projectsApi } from "../lib/api/projects.api";
import { AlbumCard } from "../components/molecules/AlbumCard";
import { ProjectCard } from "../components/molecules/ProjectCard";
import { Avatar } from "../components/atoms/Avatar";
import { Spinner } from "../components/atoms/Spinner";

export function ArtistPage() {
  const { id } = useParams<{ id: string }>();

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getAll,
  });

  const { data: albums, isLoading: albumsLoading } = useQuery({
    queryKey: ["albums"],
    queryFn: albumsApi.getAll,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
  });

  const artist = users?.find((u) => u.id === id);
  const artistAlbums = albums?.filter((a) => a.artistId === id) ?? [];
  const artistProjects = projects?.filter((p) => p.artistId === id) ?? [];

  const isLoading = usersLoading || albumsLoading || projectsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-text-muted">
        <p className="text-xl font-semibold">Артист не найден</p>
        <Link to="/" className="text-accent-purple hover:underline">
          На главную
        </Link>
      </div>
    );
  }

  const artistName = artist.email.split("@")[0];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-36 md:h-56 overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            background: `radial-gradient(ellipse 80% 80% at 30% 50%, rgba(124,58,237,0.5), rgba(6,182,212,0.2)), #111118`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary to-transparent" />

        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 px-3 py-2 rounded-xl glass text-text-secondary hover:text-text-primary transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Назад
        </Link>
      </div>

      <div className="px-4 md:px-8 -mt-10 md:-mt-16 relative pb-8 md:pb-12 space-y-8 md:space-y-10">
        {/* Artist profile */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end gap-5 mb-6"
        >
          <div className="ring-4 ring-bg-primary rounded-full">
            <Avatar name={artist.email} size="xl" />
          </div>
          <div className="pb-2">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1 capitalize">
              {artist.role.toLowerCase()}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-1">
              {artistName}
            </h1>
            <p className="text-sm text-text-secondary">{artist.email}</p>
            <div className="flex gap-4 mt-2 text-sm text-text-muted">
              <span>{artistAlbums.length} альбомов</span>
              <span>{artistProjects.length} проектов</span>
            </div>
          </div>
        </motion.div>

        {/* Albums */}
        {artistAlbums.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Disc3 className="w-4 h-4 text-accent-cyan" />
              <h2 className="text-lg font-bold text-text-primary">Альбомы</h2>
            </div>
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
              {artistAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} size="md" />
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {artistProjects.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-4 h-4 text-accent-purple" />
              <h2 className="text-lg font-bold text-text-primary">
                Краудфандинг-проекты
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {artistProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {artistAlbums.length === 0 && artistProjects.length === 0 && (
          <div className="text-center py-20 text-text-muted">
            <Music className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Артист ещё ничего не добавил</p>
          </div>
        )}
      </div>
    </div>
  );
}
