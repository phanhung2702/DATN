import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { usePlayerStore, type Song } from "@/stores/usePlayerStore";
import SongMoreMenuUser from "@/components/user/SongMoreMenuUser";
import LikeButton from "@/components/song/LikeButton";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { setQueue, currentSong } = usePlayerStore();

  const fetchFavorites = async () => {
  try {
    setLoading(true);
    const res = await axios.get("/user/favorites");
    
    console.log("Dữ liệu thực tế:", res.data);

    // TRỎ ĐÚNG VÀO TRƯỜNG favoriteSongs
    const data = res.data.favoriteSongs || []; 
    
    setFavorites(data);
  } catch (error) {
    console.error("Lỗi tải bài hát yêu thích:", error);
    setFavorites([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchFavorites();
  }, []);

  const formatDuration = (d?: number) => {
    if (!d) return "0:00";
    const m = Math.floor(d / 60);
    const s = Math.round(d % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) return <div className="p-10 text-muted-foreground font-medium">Đang tải thư viện yêu thích...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-6">
      {/* Header */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 shadow-2xl flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-[100px] fill-1">favorite</span>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Playlist</h4>
          <h1 className="text-6xl font-black mb-4">Bài hát đã thích</h1>
          <p className="text-muted-foreground font-medium">{favorites.length} bài hát</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={() => favorites.length > 0 && setQueue(favorites, 0)}
          className="h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition shadow-lg shadow-primary/30"
        >
          <span className="material-symbols-outlined text-4xl">play_arrow</span>
        </button>
      </div>

      {/* List Header */}
      <div className="grid grid-cols-[40px_1fr_1fr_80px_100px] gap-4 px-4 py-2 text-xs font-bold text-muted-foreground border-b border-border/60 mb-2 uppercase tracking-wider">
        <div className="text-center">#</div>
        <div>Tiêu đề</div>
        <div className="hidden md:block">Album</div>
        <div className="text-right"><span className="material-symbols-outlined text-lg">schedule</span></div>
        <div></div>
      </div>

      {/* List Body */}
      <div className="flex flex-col">
        {favorites.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground bg-gray-50 rounded-3xl border border-dashed">
             <p className="font-bold">Chưa có bài hát nào trong danh sách yêu thích.</p>
             <p className="text-sm">Hãy thả tim cho bài hát bạn yêu để lưu lại tại đây nhé!</p>
          </div>
        ) : (
          favorites.map((song, index) => {
            const isCurrent = currentSong?._id === song._id;
            return (
              <div
                key={song._id}
                onClick={() => setQueue(favorites, index)}
                className={`grid grid-cols-[40px_1fr_1fr_80px_100px] gap-4 px-4 py-3 rounded-xl transition-all items-center group cursor-pointer
                  ${isCurrent ? "bg-primary/5" : "hover:bg-gray-50"}`}
              >
                <div className="text-center">
                  <span className={`font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                    {index + 1}
                  </span>
                </div>

                <div className="flex items-center gap-4 min-w-0">
                  <img src={song.coverUrl} className="w-10 h-10 rounded shadow-sm object-cover" />
                  <div className="min-w-0">
                    <div className={`font-bold truncate ${isCurrent ? "text-primary" : ""}`}>{song.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
                  </div>
                </div>

                <div className="hidden md:block text-sm text-muted-foreground truncate italic">
                  {song.album || "—"}
                </div>

                <div className="text-right text-sm text-muted-foreground font-mono">
                  {formatDuration(song.duration)}
                </div>

                <div className="flex items-center justify-end gap-3 pr-2">
                  <LikeButton 
    songId={song._id} 
    onToggle={(isLikedNow) => {
      // Nếu trạng thái bây giờ là false (vừa bỏ thích)
      if (!isLikedNow) {
        // Lọc bỏ bài hát này ra khỏi danh sách đang hiển thị trên màn hình
        setFavorites((prev) => prev.filter((item) => item._id !== song._id));
      }
    }}
  />
                  <SongMoreMenuUser song={song} />
                  
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}