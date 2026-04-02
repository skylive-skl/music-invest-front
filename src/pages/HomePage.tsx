import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, TrendingUp, Disc3 } from 'lucide-react';
import { albumsApi } from '../lib/api/albums.api';
import { projectsApi } from '../lib/api/projects.api';
import { AlbumCard } from '../components/molecules/AlbumCard';
import { ProjectCard } from '../components/molecules/ProjectCard';
import { Spinner } from '../components/atoms/Spinner';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export function HomePage() {
  const { data: albums, isLoading: albumsLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: albumsApi.getAll,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const activeProjects = projects?.filter((p) => p.status === 'ACTIVE') ?? [];
  const fundingProjects = projects?.filter((p) => p.status === 'FUNDING') ?? [];
  const recentAlbums = albums?.slice(0, 10) ?? [];

  return (
    <div className="min-h-screen px-8 py-8 space-y-12">
      {/* Hero */}
      <motion.section {...fadeUp} className="relative overflow-hidden rounded-3xl">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.5), transparent)',
          }}
        />
        <div className="relative px-10 py-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <Sparkles className="w-5 h-5 text-accent-purple" />
            <span className="text-sm font-medium text-accent-purple-light uppercase tracking-widest">
              Новая платформа
            </span>
          </motion.div>
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Инвестируй <span className="text-gradient">в музыку</span><br />
            будущего
          </h1>
          <p className="text-text-secondary text-lg max-w-xl leading-relaxed">
            Поддерживай любимых артистов и получай долю от их выручки.
            Слушай, открывай, инвестируй.
          </p>
        </div>
      </motion.section>

      {/* New Albums */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Disc3 className="w-5 h-5 text-accent-cyan" />
          <h2 className="text-xl font-bold text-text-primary">Новые альбомы</h2>
        </div>

        {albumsLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : recentAlbums.length === 0 ? (
          <p className="text-text-muted text-sm py-6">Альбомы не найдены</p>
        ) : (
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
            {recentAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} size="md" />
            ))}
          </div>
        )}
      </motion.section>

      {/* Investment Projects */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-accent-purple" />
          <h2 className="text-xl font-bold text-text-primary">Открытые проекты</h2>
          {activeProjects.length > 0 && (
            <span className="ml-auto text-sm text-text-muted">
              {activeProjects.length} проектов
            </span>
          )}
        </div>

        {projectsLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : activeProjects.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Активных проектов пока нет</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {activeProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}



      </motion.section>


      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-accent-purple" />
          <h2 className="text-xl font-bold text-text-primary">Проекты в разработке</h2>
          {fundingProjects.length > 0 && (
            <span className="ml-auto text-sm text-text-muted">
              {fundingProjects.length} проектов
            </span>
          )}
        </div>

        {projectsLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : fundingProjects.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Проектов в разработке пока нет</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {fundingProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}


      </motion.section>






      {/* All Albums grid */}
      {!albumsLoading && (albums?.length ?? 0) > 10 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Disc3 className="w-5 h-5 text-text-muted" />
            <h2 className="text-xl font-bold text-text-primary">Все альбомы</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {albums?.slice(10).map((album) => (
              <AlbumCard key={album.id} album={album} size="sm" />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
