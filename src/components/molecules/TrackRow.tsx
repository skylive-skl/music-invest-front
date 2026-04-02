import { motion } from 'framer-motion';
import { Play, Pause, Music } from 'lucide-react';
import type { Track } from '../../types/album.types';
import { usePlayerStore } from '../../store/player.store';
import { formatDuration, cn } from '../../lib/utils';

interface TrackRowProps {
  track: Track;
  index: number;
  queue?: Track[];
  className?: string;
}

export function TrackRow({ track, index, queue = [], className }: TrackRowProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const isActive = currentTrack?.id === track.id;

  const handlePlay = () => {
    if (isActive) {
      togglePlay();
    } else {
      playTrack(track, queue.length > 0 ? queue : [track]);
    }
  };

  return (
    <motion.div
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer',
        'transition-colors duration-200',
        isActive ? 'bg-accent-purple/10 border border-accent-purple/20' : 'hover:bg-bg-elevated',
        !track.audioUrl && 'opacity-50',
        className
      )}
      onClick={handlePlay}
      whileTap={{ scale: 0.99 }}
    >
      {/* Index / Play icon */}
      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
        {isActive && isPlaying ? (
          <div className="flex items-end gap-0.5 h-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 bg-accent-purple rounded-full equalizer-bar"
                style={{ height: '100%', animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        ) : (
          <>
            <span className={cn(
              'text-sm font-medium group-hover:hidden',
              isActive ? 'text-accent-purple hidden' : 'text-text-muted'
            )}>
              {index + 1}
            </span>
            <div className={cn(
              'hidden group-hover:flex items-center justify-center w-8 h-8 rounded-full',
              isActive ? 'flex' : ''
            )}>
              {isActive && !isPlaying ? (
                <Play className="w-4 h-4 text-accent-purple" fill="currentColor" />
              ) : (
                <>
                  {isActive ? (
                    <Pause className="w-4 h-4 text-accent-purple" fill="currentColor" />
                  ) : (
                    <Play className="w-4 h-4 text-text-primary" fill="currentColor" />
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          isActive ? 'text-accent-purple-light' : 'text-text-primary'
        )}>
          {track.title}
        </p>
        {track.artist && (
          <p className="text-xs text-text-muted truncate mt-0.5">
            {track.artist.email?.split('@')[0]}
          </p>
        )}
      </div>

      {/* Audio indicator */}
      {!track.audioUrl && (
        <Music className="w-4 h-4 text-text-muted flex-shrink-0" />
      )}

      {/* Duration */}
      <span className="text-xs text-text-muted flex-shrink-0">
        {formatDuration(track.duration)}
      </span>
    </motion.div>
  );
}
