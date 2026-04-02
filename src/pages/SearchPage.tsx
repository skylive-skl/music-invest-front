import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Music, Disc3, User, TrendingUp } from 'lucide-react';
import { searchApi } from '../lib/api/search.api';
import { AlbumCard } from '../components/molecules/AlbumCard';
import { ProjectCard } from '../components/molecules/ProjectCard';
import { TrackRow } from '../components/molecules/TrackRow';
import { Spinner } from '../components/atoms/Spinner';
import { Avatar } from '../components/atoms/Avatar';
import { Link } from 'react-router-dom';

type Filter = 'all' | 'track' | 'album' | 'artist' | 'project';

const filters: { key: Filter; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'Все', icon: <Search size={14} /> },
  { key: 'track', label: 'Треки', icon: <Music size={14} /> },
  { key: 'album', label: 'Альбомы', icon: <Disc3 size={14} /> },
  { key: 'artist', label: 'Артисты', icon: <User size={14} /> },
  { key: 'project', label: 'Проекты', icon: <TrendingUp size={14} /> },
];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleInput = useCallback((val: string) => {
    setQuery(val);
    if (debounceTimer) clearTimeout(debounceTimer);
    const t = setTimeout(() => setDebouncedQuery(val), 400);
    setDebounceTimer(t);
  }, [debounceTimer]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', debouncedQuery, activeFilter],
    queryFn: () => searchApi.search(
      debouncedQuery,
      activeFilter === 'all' ? undefined : [activeFilter as any]
    ),
    enabled: debouncedQuery.length >= 2,
  });

  const hasResults = data && (
    (data.tracks?.length ?? 0) +
    (data.albums?.length ?? 0) +
    (data.artists?.length ?? 0) +
    (data.projects?.length ?? 0)
  ) > 0;

  return (
    <div className="min-h-screen px-8 py-8">
      {/* Search bar */}
      <div className="max-w-2xl mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Поиск</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Треки, альбомы, артисты, проекты..."
            className="w-full pl-12 pr-12 py-4 bg-bg-card border border-border rounded-2xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setDebouncedQuery(''); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {filters.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === key
                  ? 'bg-accent-purple text-white'
                  : 'bg-bg-elevated text-text-secondary border border-border hover:border-accent-purple/40 hover:text-text-primary'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {!query && (
        <div className="flex flex-col items-center justify-center py-24 text-text-muted">
          <Search className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg">Начните вводить запрос</p>
          <p className="text-sm mt-1">Минимум 2 символа</p>
        </div>
      )}

      {/* Loading */}
      {debouncedQuery.length >= 2 && (isLoading || isFetching) && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {/* No results */}
      {debouncedQuery.length >= 2 && !isLoading && !isFetching && !hasResults && (
        <div className="text-center py-16 text-text-muted">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-lg">Ничего не найдено</p>
          <p className="text-sm mt-1">Попробуйте другой запрос</p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {data && hasResults && (
          <motion.div
            key={debouncedQuery + activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* Tracks */}
            {(activeFilter === 'all' || activeFilter === 'track') && (data.tracks?.length ?? 0) > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Music className="w-4 h-4 text-accent-purple" />
                  <h2 className="text-lg font-bold text-text-primary">Треки</h2>
                  <span className="text-sm text-text-muted">({data.tracks.length})</span>
                </div>
                <div className="bg-bg-card border border-border rounded-2xl p-2">
                  {data.tracks.map((track, i) => (
                    <TrackRow key={track.id} track={track} index={i} queue={data.tracks} />
                  ))}
                </div>
              </section>
            )}

            {/* Albums */}
            {(activeFilter === 'all' || activeFilter === 'album') && (data.albums?.length ?? 0) > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Disc3 className="w-4 h-4 text-accent-cyan" />
                  <h2 className="text-lg font-bold text-text-primary">Альбомы</h2>
                  <span className="text-sm text-text-muted">({data.albums.length})</span>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {data.albums.map((album) => (
                    <AlbumCard key={album.id} album={album} size="sm" />
                  ))}
                </div>
              </section>
            )}

            {/* Artists */}
            {(activeFilter === 'all' || activeFilter === 'artist') && (data.artists?.length ?? 0) > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-success" />
                  <h2 className="text-lg font-bold text-text-primary">Артисты</h2>
                  <span className="text-sm text-text-muted">({data.artists.length})</span>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {data.artists.map((artist) => (
                    <Link key={artist.id} to={`/artists/${artist.id}`}>
                      <motion.div
                        whileHover={{ y: -3 }}
                        className="flex flex-col items-center gap-2 p-4 bg-bg-card border border-border rounded-2xl hover:border-accent-purple/40 transition-colors w-32 cursor-pointer"
                      >
                        <Avatar name={artist.email} size="lg" />
                        <p className="text-sm font-medium text-text-primary text-center truncate w-full">
                          {artist.email.split('@')[0]}
                        </p>
                        <p className="text-xs text-text-muted capitalize">{artist.role.toLowerCase()}</p>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {(activeFilter === 'all' || activeFilter === 'project') && (data.projects?.length ?? 0) > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-warning" />
                  <h2 className="text-lg font-bold text-text-primary">Проекты</h2>
                  <span className="text-sm text-text-muted">({data.projects.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
