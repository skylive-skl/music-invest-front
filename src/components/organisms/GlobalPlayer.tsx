import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";
import { usePlayerStore } from "../../store/player.store";
import { formatDuration, cn, stringToGradient } from "../../lib/utils";

export function GlobalPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isMuted,
    setAudioRef,
    togglePlay,
    setProgress,
    setVolume,
    toggleMute,
    playNext,
    playPrev,
    seek,
  } = usePlayerStore();

  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
    }
  }, [setAudioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const dur = audio.duration || 0;
      const cur = audio.currentTime;
      setProgress(dur > 0 ? cur / dur : 0, cur, dur);
    };

    const onEnded = () => {
      playNext();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [setProgress, playNext]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(1, p)));
  };

  const artistName =
    currentTrack?.artist?.email?.split("@")[0] ??
    (currentTrack?.albumId ? "Artist" : "");

  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50 h-20 glass border-t border-border shadow-player"
          >
            {/* Progress bar — at the very top */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-bg-elevated cursor-pointer group"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-gradient-purple transition-none relative"
                style={{ width: `${progress * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="flex items-center h-full px-4 gap-4">
              {/* Track info */}
              <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-64 md:flex-shrink-0">
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden",
                    isPlaying && "shadow-glow-purple",
                  )}
                  style={{ background: stringToGradient(currentTrack.title) }}
                >
                  {currentTrack.album?.coverImageUrl ? (
                    <img
                      src={currentTrack.album.coverImageUrl}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-5 h-5 text-white/60" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {currentTrack.title}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {artistName}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-center gap-4">
                  <button
                    onClick={playPrev}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <SkipBack size={20} fill="currentColor" />
                  </button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-glow-purple"
                  >
                    {isPlaying ? (
                      <Pause
                        size={18}
                        className="text-bg-primary"
                        fill="currentColor"
                      />
                    ) : (
                      <Play
                        size={18}
                        className="text-bg-primary ml-0.5"
                        fill="currentColor"
                      />
                    )}
                  </motion.button>

                  <button
                    onClick={playNext}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <SkipForward size={20} fill="currentColor" />
                  </button>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span>{formatDuration(currentTime)}</span>
                  <span>/</span>
                  <span>{formatDuration(duration)}</span>
                </div>
              </div>

              {/* Volume */}
              <div className="hidden md:flex items-center gap-2 w-40 flex-shrink-0 justify-end">
                <button
                  onClick={toggleMute}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={18} />
                  ) : (
                    <Volume2 size={18} />
                  )}
                </button>
                <div
                  className="flex-1 relative h-1 bg-bg-elevated rounded-full cursor-pointer group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const v = (e.clientX - rect.left) / rect.width;
                    setVolume(Math.max(0, Math.min(1, v)));
                  }}
                >
                  <div
                    className="h-full bg-text-secondary rounded-full transition-none"
                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      left: `${(isMuted ? 0 : volume) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
