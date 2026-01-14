import React, { useEffect, useState, type JSX, useCallback } from "react";
import axios from "../../lib/axios";
import ProtectedImage from "../../components/shared/ProtectedImage";
import { usePlayerStore, type Song } from "../../stores/usePlayerStore";
import EditSongModal from "../../components/song/EditSongModal";
import SongActionMenu from "../../components/song/SongActionMenu";

export default function AdminLibrary(): JSX.Element {
  const [items, setItems] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const { setCurrentSong, currentSong, isPlaying } = usePlayerStore();
  const { setQueue } = usePlayerStore();

  // Tách hàm load ra riêng để có thể gọi lại (refresh)
  const fetchSongs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/songs/admin", { params: { page, limit } });
      setItems(res.data.items ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Lỗi khi tải danh sách");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const formatDuration = (d?: number) => {
    if (!d && d !== 0) return "--:--";
    const m = Math.floor(d / 60);
    const s = Math.round(d % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-foreground">Thư viện Quản trị</h1>
          <p className="text-muted-foreground font-medium">Quản lý nội dung âm nhạc trên toàn hệ thống</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold border border-primary/20 shadow-sm">
          {items.length} bài hát
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-3 border border-red-100">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {/* Table Header - 6 cột: #, Tiêu đề, Nghệ sĩ, Ngày thêm, Thời lượng, Thao tác */}
      <div className="grid grid-cols-[40px_1fr_1fr_120px_80px_50px] gap-4 px-4 py-2 text-sm font-bold text-muted-foreground border-b border-border/60 mb-2 uppercase tracking-wider items-center">
        <div className="text-center">#</div>
        <div>Tiêu đề</div>
        <div className="hidden md:block">Nghệ sĩ</div>
        <div className="hidden sm:block text-right">Ngày thêm</div>
        <div className="text-right">
          <span className="material-symbols-outlined text-lg">schedule</span>
        </div>
        <div className="text-right"></div>
      </div>

      {/* Song List */}
      <div className="flex flex-col">
        {loading && [1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 animate-pulse bg-gray-50 rounded-xl mb-2" />
        ))}

        {!loading && items.map((song, index) => {
          const isCurrent = currentSong?._id === song._id;
          
          return (
            <div
              key={song._id}
              onClick={() => setQueue(items, index)}
              className={`grid grid-cols-[40px_1fr_1fr_120px_80px_50px] gap-4 px-4 py-3 rounded-xl transition-all items-center group cursor-pointer
                ${isCurrent ? "bg-primary/5 shadow-sm" : "hover:bg-gray-100/60"}`}
            >
              {/* Cột 1: Index / Trạng thái phát */}
              <div className="flex justify-center">
                {isCurrent && isPlaying ? (
                   <div className="flex gap-1 items-end h-4">
                      <div className="w-1 bg-primary animate-[music-wave_0.6s_ease-in-out_infinite]" />
                      <div className="w-1 bg-primary animate-[music-wave_0.9s_ease-in-out_infinite]" />
                      <div className="w-1 bg-primary animate-[music-wave_0.7s_ease-in-out_infinite]" />
                   </div>
                ) : (
                  <span className={`font-medium ${isCurrent ? "text-primary" : "text-muted-foreground group-hover:hidden"}`}>
                    {index + 1 + (page - 1) * limit}
                  </span>
                )}
                <span className="material-symbols-outlined text-primary hidden group-hover:block transition animate-in fade-in zoom-in duration-200">
                  {isCurrent && isPlaying ? "pause" : "play_arrow"}
                </span>
              </div>

              {/* Cột 2: Title & Image */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-lg overflow-hidden shadow-sm flex-shrink-0 border border-black/5">
                  <ProtectedImage
                    src={song.coverUrl ?? null}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className={`font-bold truncate ${isCurrent ? "text-primary" : "text-foreground"}`}>
                    {song.title}
                  </div>
                  <div className="text-xs text-muted-foreground md:hidden truncate font-medium">{song.artist}</div>
                </div>
              </div>

              {/* Cột 3: Artist (Desktop) */}
              <div className={`hidden md:block truncate font-medium ${isCurrent ? "text-primary/80" : "text-muted-foreground"}`}>
                {song.artist}
              </div>

              {/* Cột 4: Created At */}
              <div className="hidden sm:block text-xs text-muted-foreground text-right font-medium">
                {formatDate(song.createdAt)}
              </div>

              {/* Cột 5: Duration */}
              <div className="text-right font-mono text-sm text-muted-foreground font-medium">
                {formatDuration(song.duration)}
              </div>

              {/* Cột 6: Action Menu */}
              <div className="flex justify-end">
                <SongActionMenu 
                  song={song} 
                  onRefresh={fetchSongs} 
                  onEdit={(s) => setEditingSong(s)} 
                />
              </div>
            </div>
          );
        })}

        {!loading && items.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
             <span className="material-symbols-outlined text-6xl opacity-20 mb-4">music_off</span>
             <p className="font-medium">Thư viện trống</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-10 border-t border-border/60 pt-6">
        <p className="text-sm text-muted-foreground font-medium">
          Trang <span className="text-foreground font-bold">{page}</span>
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 px-4 py-2 rounded-full border border-border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition font-bold text-sm"
          >
            <span className="material-symbols-outlined">chevron_left</span>
            Trước
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={items.length < limit}
            className="flex items-center gap-1 px-4 py-2 rounded-full border border-border hover:bg-gray-50 disabled:opacity-30 transition font-bold text-sm"
          >
            Sau
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      {editingSong && (
        <EditSongModal 
          song={editingSong} 
          onClose={() => setEditingSong(null)} 
          onRefresh={fetchSongs} 
        />
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes music-wave {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
      `}</style>
    </div>
  );
} 