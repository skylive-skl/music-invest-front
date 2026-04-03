import { motion } from "framer-motion";
import { Play, Music } from "lucide-react";
import { Link } from "react-router-dom";
import type { Album } from "../../types/album.types";
import { stringToGradient, cn } from "../../lib/utils";

interface AlbumCardProps {
  album: Album;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-36 min-w-[9rem]",
  md: "w-40 min-w-[10rem]",
  lg: "w-48 min-w-[12rem]",
};

export function AlbumCard({ album, className, size = "md" }: AlbumCardProps) {
  const artistName = album.artist?.email?.split("@")[0] ?? "Artist";

  return (
    <Link to={`/albums/${album.id}`}>
      <motion.div
        className={cn(
          "group cursor-pointer flex-shrink-0",
          sizeClasses[size],
          className,
        )}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Cover */}
        <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-card">
          {album.coverImageUrl ? (
            <img
              src={album.coverImageUrl}
              alt={album.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: stringToGradient(album.title) }}
            >
              <Music className="w-8 h-8 text-white/60" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 h-12 rounded-full bg-accent-purple flex items-center justify-center shadow-glow-purple"
            >
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            </motion.div>
          </div>
        </div>

        {/* Info */}
        <div className="px-1">
          <p className="text-sm font-semibold text-text-primary truncate group-hover:text-accent-purple-light transition-colors">
            {album.title}
          </p>
          <p className="text-xs text-text-secondary mt-0.5 truncate">
            {artistName}
            {album.tracks && <> · {album.tracks.length} треков</>}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
