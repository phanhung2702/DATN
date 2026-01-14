import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Song = {
  _id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string; 
  duration?: number;
  lyrics?: string;
  createdAt?: string;
  genre?: string;
  album?: string;
};

type RepeatMode = "off" | "all" | "one";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  queue: Song[];
  currentIndex: number;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  showLyrics: boolean;
  
  // Actions
  reset: () => void;
  setQueue: (songs: Song[], index: number) => void;
  setCurrentSong: (song: Song) => void;
  togglePlay: () => void;
  setIsPlaying: (val: boolean) => void;
  setVolume: (val: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLyrics: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      currentSong: null,
      isPlaying: false,
      volume: 0.5,
      queue: [],
      currentIndex: -1,
      isShuffled: false,
      repeatMode: "off",
      showLyrics: false,

      // Hàm Reset: Xóa sạch State và xóa luôn LocalStorage
      reset: () => {
        set({
          currentSong: null,
          isPlaying: false,
          queue: [],
          currentIndex: -1,
          showLyrics: false,
        });
        // Lệnh này cực kỳ quan trọng để xóa dữ liệu đã lưu trong trình duyệt
        usePlayerStore.persist.clearStorage();
      },

      setQueue: (songs, index) => {
        set({
          queue: songs,
          currentIndex: index,
          currentSong: songs[index],
          isPlaying: true,
        });
      },

      playNext: () => {
        const { queue, currentIndex, isShuffled, repeatMode } = get();
        if (queue.length === 0) return;

        let nextIndex: number;
        if (isShuffled) {
          nextIndex = Math.floor(Math.random() * queue.length);
        } else {
          nextIndex = (currentIndex + 1) % queue.length;
        }

        if (nextIndex >= queue.length && repeatMode === "off") {
            return set({ isPlaying: false });
        }

        set({
          currentIndex: nextIndex,
          currentSong: queue[nextIndex],
          isPlaying: true,
        });
      },

      playPrevious: () => {
        const { queue, currentIndex } = get();
        if (queue.length === 0) return;

        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        set({
          currentIndex: prevIndex,
          currentSong: queue[prevIndex],
          isPlaying: true,
        });
      },

      setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setIsPlaying: (val) => set({ isPlaying: val }),
      setVolume: (val) => set({ volume: val }),
      toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
      toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics })),
      toggleRepeat: () => {
        const modes: RepeatMode[] = ["off", "all", "one"];
        const nextIndex = (modes.indexOf(get().repeatMode) + 1) % 3;
        set({ repeatMode: modes[nextIndex] });
      },
    }),
    {
      name: "player-storage", // Tên key lưu trong LocalStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        currentSong: state.currentSong,
        queue: state.queue,
        currentIndex: state.currentIndex,
        volume: state.volume,
        repeatMode: state.repeatMode,
        isShuffled: state.isShuffled,
      }),
    }
  )
);