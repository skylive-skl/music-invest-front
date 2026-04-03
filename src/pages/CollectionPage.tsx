import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Heart, Disc3, Music } from "lucide-react";
import { albumsApi } from "../lib/api/albums.api";
import { AlbumCard } from "../components/molecules/AlbumCard";
import { Spinner } from "../components/atoms/Spinner";

export function CollectionPage() {
  const { data: albums, isLoading } = useQuery({
    queryKey: ["albums"],
    queryFn: albumsApi.getAll,
  });

  return (
    <div className="min-h-screen px-4 py-4 md:px-8 md:py-8 space-y-6 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-6 h-6 text-accent-purple" />
          <h1 className="text-3xl font-bold text-text-primary">
            Моя коллекция
          </h1>
        </div>
        <p className="text-text-secondary">
          Все доступные альбомы на платформе
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : !albums || albums.length === 0 ? (
        <div className="text-center py-24 text-text-muted">
          <Music className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-semibold">Коллекция пуста</p>
          <p className="text-sm mt-1">Альбомы появятся здесь</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Disc3 className="w-4 h-4 text-accent-cyan" />
            <h2 className="text-lg font-bold text-text-primary">Все альбомы</h2>
            <span className="text-sm text-text-muted">({albums.length})</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {albums.map((album, i) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <AlbumCard album={album} size="sm" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
