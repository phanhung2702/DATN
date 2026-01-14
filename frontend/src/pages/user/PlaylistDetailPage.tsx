import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { usePlayerStore, type Song } from "@/stores/usePlayerStore";
import { toast } from "sonner";

interface Playlist {
  _id: string;
  title: string;
  coverUrl: string;
  songs: Song[]; // Backend cần .populate('songs')
}

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  // Lấy các hàm từ Store của bạn
  const { setQueue, currentSong, isPlaying, togglePlay } = usePlayerStore();

  useEffect(() => {
   
    const fetchPlaylistDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/playlists/${id}`);
        setPlaylist(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải danh sách phát");
        navigate("/playlists");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPlaylistDetail();
  }, [id, navigate]);

  // Hàm xử lý khi click vào một bài hát
  const handlePlaySong = (index: number) => {
    if (!playlist) return;
    // Đưa toàn bộ danh sách bài hát vào queue và phát bài tại vị trí index
    setQueue(playlist.songs, index);
  };

  // Hàm format thời gian (giây -> mm:ss)
  const formatTime = (seconds?: number) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  if (loading) {
    return <div className="p-10 text-center text-muted-foreground animate-pulse">Đang tải danh sách bài hát...</div>;
  }

  if (!playlist) {
    return <div className="p-10 text-center">Không tìm thấy danh sách phát</div>;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* HEADER: Ảnh cover và thông tin playlist */}
      <div className="p-8 flex flex-col md:flex-row items-end gap-8 bg-gradient-to-b from-primary/20 to-transparent">
        <img
          src={playlist.coverUrl || "/default-playlist.png"}
          alt={playlist.title}
          className="w-52 h-52 md:w-64 md:h-64 object-cover rounded-2xl shadow-2xl"
        />
        <div className="flex-1">
          <span className="text-xs font-bold uppercase tracking-wider">Danh sách phát</span>
          <h1 className="text-5xl md:text-7xl font-black mt-2 mb-6">{playlist.title}</h1>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-primary">Người dùng của bạn</span>
            <span className="text-muted-foreground">• {playlist.songs.length} bài hát</span>
          </div>
        </div>
      </div>

      {/* ACTIONS: Nút Play chính */}
      <div className="px-8 py-4">
        <button
          onClick={() => handlePlaySong(0)}
          className="h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition shadow-lg shadow-primary/30"
        >
          <span className="material-symbols-outlined text-4xl">play_arrow</span>
        </button>
      </div>

      {/* TABLE: Danh sách bài hát */}
      <div className="px-8 mt-4">
        {/* Header Table */}
        <div className="grid grid-cols-[16px_4fr_3fr_minmax(100px,1fr)] gap-4 px-4 py-2 border-b border-gray-100 text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
          <div>#</div>
          <div>Tiêu đề</div>
          <div>Nghệ sĩ</div>
          <div className="flex justify-end pr-4">
            <span className="material-symbols-outlined text-sm">schedule</span>
          </div>
        </div>

        {/* Danh sách các dòng bài hát */}
        {playlist.songs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground italic">
            Danh sách này hiện chưa có bài hát nào.
          </div>
        ) : (
          playlist.songs.map((song, index) => {
            const isCurrentPlaying = currentSong?._id === song._id;

            return (
              <div
                key={song._id}
                onClick={() => handlePlaySong(index)}
                className={`grid grid-cols-[16px_4fr_3fr_minmax(100px,1fr)] gap-4 px-4 py-3 rounded-xl items-center cursor-pointer group transition-all duration-200 ${
                  isCurrentPlaying ? "bg-primary/5" : "hover:bg-gray-50"
                }`}
              >
                {/* Cột 1: STT hoặc icon đang phát */}
                <div className="text-sm font-medium">
                  {isCurrentPlaying && isPlaying ? (
                    <div className="flex items-center gap-0.5 h-4">
                        <span className="w-1 h-3 bg-primary animate-[bounce_0.8s_infinite]"></span>
                        <span className="w-1 h-4 bg-primary animate-[bounce_1.2s_infinite]"></span>
                        <span className="w-1 h-2 bg-primary animate-[bounce_1s_infinite]"></span>
                    </div>
                  ) : (
                    <span className={`${isCurrentPlaying ? "text-primary" : "text-muted-foreground"}`}>
                        {index + 1}
                    </span>
                  )}
                </div>

                {/* Cột 2: Ảnh & Tên bài */}
                <div className="flex items-center gap-3 min-w-0">
                  <img src={song.coverUrl} className="w-10 h-10 rounded-lg object-cover shadow-sm" alt="" />
                  <div className="min-w-0">
                    <p className={`font-bold text-sm truncate ${isCurrentPlaying ? "text-primary" : "text-foreground"}`}>
                      {song.title}
                    </p>
                  </div>
                </div>

                {/* Cột 3: Nghệ sĩ */}
                <div className={`text-sm truncate ${isCurrentPlaying ? "text-primary/80" : "text-muted-foreground"}`}>
                  {song.artist}
                </div>

                {/* Cột 4: Thời lượng */}
                <div className="text-right pr-4 text-xs font-medium text-muted-foreground">
                  {formatTime(song.duration)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}