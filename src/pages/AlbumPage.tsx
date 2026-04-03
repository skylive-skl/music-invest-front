import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Music, Calendar, Play } from "lucide-react";
import { albumsApi } from "../lib/api/albums.api";
import { TrackRow } from "../components/molecules/TrackRow";
import { Spinner } from "../components/atoms/Spinner";
import { formatDate, stringToGradient } from "../lib/utils";
import { usePlayerStore } from "../store/player.store";

export function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const { playTrack } = usePlayerStore();

  const {
    data: album,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["album", id],
    queryFn: () => albumsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-text-muted">
        <Music className="w-16 h-16 opacity-30" />
        <p className="text-xl font-semibold">Альбом не найден</p>
        <Link to="/" className="text-accent-purple hover:underline">
          На главную
        </Link>
      </div>
    );
  }

  const artistName = album.artist?.email?.split("@")[0] ?? "Artist";
  const tracks = album.tracks ?? [];
  const totalDuration = tracks.reduce((acc, t) => acc + (t.duration ?? 0), 0);
  const totalMin = Math.floor(totalDuration / 60);

  const handlePlayAll = () => {
    const playable = tracks.filter((t) => t.audioUrl);
    if (playable[0]) playTrack(playable[0], playable);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-44 md:h-72 overflow-hidden">
        {album.coverImageUrl ? (
          <img
            src={album.coverImageUrl}
            alt={album.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: stringToGradient(album.title) }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />

        {/* Back button */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 px-3 py-2 rounded-xl glass text-text-secondary hover:text-text-primary transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Назад
        </Link>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 -mt-12 md:-mt-20 relative pb-8 md:pb-10">
        <div className="flex items-end gap-6 mb-8">
          {/* Cover thumb */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-card flex-shrink-0 border-4 border-bg-primary"
          >
            {album.coverImageUrl ? (
              <img
                src={album.coverImageUrl}
                alt={album.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: stringToGradient(album.title) }}
              >
                <Music className="w-12 h-12 text-white/50" />
              </div>
            )}
          </motion.div>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 min-w-0 pb-2"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-purple mb-1">
              Альбом
            </p>
            <h1 className="text-xl md:text-3xl font-extrabold text-text-primary mb-2 line-clamp-2">
              {album.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-text-secondary flex-wrap">
              <Link
                to={`/artists/${album.artistId}`}
                className="font-semibold text-text-primary hover:text-accent-purple-light transition-colors"
              >
                {artistName}
              </Link>
              {album.releaseDate && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {formatDate(album.releaseDate)}
                  </span>
                </>
              )}
              <span>·</span>
              <span>{tracks.length} треков</span>
              {totalMin > 0 && (
                <>
                  <span>·</span>
                  <span>{totalMin} мин.</span>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Play all button */}
        {tracks.some((t) => t.audioUrl) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-purple text-white font-semibold hover:bg-accent-purple-light transition-colors shadow-glow-purple"
            >
              <Play size={18} fill="currentColor" />
              Слушать всё
            </button>
          </motion.div>
        )}

        {/* Track list */}
        {tracks.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <Music className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Треки ещё не добавлены</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-bg-card border border-border rounded-2xl p-2"
          >
            {/* Header row */}
            <div className="flex items-center gap-3 px-3 py-2 text-xs text-text-muted border-b border-border mb-1">
              <div className="w-8 text-center">#</div>
              <div className="flex-1">Название</div>
              <div>Длит.</div>
            </div>
            {tracks.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i} queue={tracks} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
