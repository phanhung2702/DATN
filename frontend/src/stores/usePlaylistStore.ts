import { create } from "zustand";
import axios from "@/lib/axios";

interface Playlist {
  _id: string;
  title: string;
}

interface PlaylistStore {
  myPlaylists: Playlist[];
  fetchMyPlaylists: () => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  myPlaylists: [],
  
  fetchMyPlaylists: async () => {
    try {
      const res = await axios.get("/playlists/my-playlists");
      set({ myPlaylists: res.data });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error("Lỗi tải playlist cá nhân");
    }
  },

  // HÀM MỚI: Tạo và cập nhật UI ngay lập tức
//   createPlaylist: async (title: string) => {
//     try {
//         const res = await axios.post("/playlists", { title });
//         const newPlaylist: Playlist = res.data;
//         set((state) => ({
//             myPlaylists: [newPlaylist, ...state.myPlaylists]
//         }));
//         return newPlaylist;
//     } catch (error) {
//         console.error("Lỗi khi tạo playlist");
//     }
//   },

  addSongToPlaylist: async (playlistId, songId) => {
    try {
      await axios.post("/playlists/add-song", { playlistId, songId });
      alert("Đã thêm vào danh sách phát!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi thêm vào playlist");
    }
  },
}));