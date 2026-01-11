import axios from "../lib/axios";

export default {
  createSong: async (payload: {
    title: string;
    artist: string;
    album?: string;
    genre?: string;
    lyrics?: string;
    url: string;
    coverUrl?: string;
    duration?: number;
  }) => {
    const res = await axios.post("/songs", payload);
    return res.data;
  },
  getAllSongForAdmin: async (page = 1, limit = 50) => {
    const res = await axios.get("/songs/admin", { params: { page, limit } });
    return res.data; // { items, total, page, limit }
  },
};