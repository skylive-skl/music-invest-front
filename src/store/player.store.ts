import { create } from 'zustand';
import type { Track } from '../types/album.types';

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  progress: number;       // 0..1
  currentTime: number;    // seconds
  duration: number;       // seconds
  volume: number;         // 0..1
  isMuted: boolean;
  audioRef: HTMLAudioElement | null;
}

interface PlayerActions {
  setAudioRef: (ref: HTMLAudioElement) => void;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  seek: (progress: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  playNext: () => void;
  playPrev: () => void;
  setProgress: (progress: number, currentTime: number, duration: number) => void;
}

export const usePlayerStore = create<PlayerState & PlayerActions>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  progress: 0,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  audioRef: null,

  setAudioRef: (ref) => set({ audioRef: ref }),

  playTrack: (track, queue = []) => {
    const { audioRef } = get();
    if (!audioRef || !track.audioUrl) return;

    set({ currentTrack: track, queue, isPlaying: true, progress: 0, currentTime: 0 });
    audioRef.src = track.audioUrl;
    audioRef.volume = get().isMuted ? 0 : get().volume;
    audioRef.play().catch(console.error);
  },

  togglePlay: () => {
    const { audioRef, isPlaying } = get();
    if (!audioRef) return;
    if (isPlaying) {
      audioRef.pause();
      set({ isPlaying: false });
    } else {
      audioRef.play().catch(console.error);
      set({ isPlaying: true });
    }
  },

  pause: () => {
    const { audioRef } = get();
    audioRef?.pause();
    set({ isPlaying: false });
  },

  seek: (progress) => {
    const { audioRef, duration } = get();
    if (!audioRef || !duration) return;
    const time = progress * duration;
    audioRef.currentTime = time;
    set({ progress, currentTime: time });
  },

  setVolume: (volume) => {
    const { audioRef } = get();
    if (audioRef) audioRef.volume = volume;
    set({ volume, isMuted: volume === 0 });
  },

  toggleMute: () => {
    const { audioRef, isMuted, volume } = get();
    if (!audioRef) return;
    if (isMuted) {
      audioRef.volume = volume;
      set({ isMuted: false });
    } else {
      audioRef.volume = 0;
      set({ isMuted: true });
    }
  },

  playNext: () => {
    const { queue, currentTrack, playTrack } = get();
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const next = queue[idx + 1];
    if (next) playTrack(next, queue);
  },

  playPrev: () => {
    const { queue, currentTrack, playTrack, audioRef } = get();
    // If more than 3s played — restart current
    if (audioRef && audioRef.currentTime > 3) {
      audioRef.currentTime = 0;
      return;
    }
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const prev = queue[idx - 1];
    if (prev) playTrack(prev, queue);
  },

  setProgress: (progress, currentTime, duration) =>
    set({ progress, currentTime, duration }),
}));
