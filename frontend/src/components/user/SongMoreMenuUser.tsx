import React, { useState, useRef, useEffect } from "react";
import { type Song } from "@/stores/usePlayerStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SongMoreMenuUser({ song }: { song: Song }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const { myPlaylists, fetchMyPlaylists, addSongToPlaylist } = usePlaylistStore();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowPlaylists(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      fetchMyPlaylists();
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={handleOpenMenu}
        className="h-9 w-9 rounded-full hover:bg-gray-200 flex items-center justify-center transition active:scale-90"
      >
        <span className="material-symbols-outlined text-xl text-muted-foreground">more_horiz</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-64 bg-white shadow-2xl rounded-2xl border border-border/50 py-2 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* --- MỤC THÊM VÀO PLAYLIST --- */}
          <div 
            className="relative"
            onMouseEnter={() => setShowPlaylists(true)}
            onMouseLeave={() => setShowPlaylists(false)}
          >
            <div className="px-4 py-2.5 hover:bg-primary/5 hover:text-primary flex items-center justify-between cursor-pointer text-sm font-semibold transition">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">playlist_add</span>
                Thêm vào playlist
              </div>
              {/* Sửa 1: Đổi icon thành mũi tên trái nếu bạn muốn mở sang trái, hoặc giữ nguyên nếu mở sang phải */}
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </div>

            {/* SUB-MENU DANH SÁCH PLAYLIST */}
            {showPlaylists && (
              <div 
                // Sửa 2: "right-full" để mở sang trái (vì menu chính đang nằm sát lề phải màn hình)
                // Sửa 3: Quan trọng nhất - loại bỏ "mr-1" và thay bằng một lớp đệm để không bị mất hover
                className="absolute right-full top-[-8px] pr-2 w-56 z-[110] animate-in fade-in slide-in-from-right-2 duration-200"
              >
                {/* Lớp bọc màu trắng thực sự */}
                <div className="bg-white shadow-2xl rounded-2xl border border-border/50 py-2">
                  <div className="px-4 py-1.5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Danh sách của bạn</div>
                  
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {myPlaylists.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-muted-foreground italic">Bạn chưa có playlist nào</div>
                    ) : (
                      myPlaylists.map((pl) => (
                        <div
                          key={pl._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            addSongToPlaylist(pl._id, song._id);
                            setIsOpen(false);
                            setShowPlaylists(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-50 transition cursor-pointer text-sm truncate font-medium"
                        >
                          {pl.title}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-border/40 my-1"></div>
                  <div 
                    className="px-4 py-2.5 hover:bg-gray-50 text-primary font-bold text-xs cursor-pointer flex items-center gap-2"
                    onClick={() => navigate("/playlists")}
                  >
                    <span className="material-symbols-outlined text-sm font-bold">add</span>
                    Tạo mới playlist
                  </div>
                </div>
              </div>
            )}
          </div>

          <MenuItem 
            icon="share" 
            label="Chia sẻ" 
            onClick={(e) => {
               e.stopPropagation();
               navigator.clipboard.writeText(`${window.location.origin}/song/${song._id}`);
               toast.success("Đã sao chép link bài hát!");
               setIsOpen(false);
            }} 
          />
          
          <MenuItem 
            icon="download" 
            label="Tải xuống" 
            onClick={(e) => {
               e.stopPropagation();
               window.open(song.audioUrl, "_blank");
               setIsOpen(false);
            }} 
          />

          <div className="border-t border-border/40 my-1"></div>

          <MenuItem 
            icon="info" 
            label="Thông tin chi tiết" 
            onClick={(e) => {
              e.stopPropagation();
              alert(`Nghệ sĩ: ${song.artist}\nAlbum: ${song.album || "N/A"}`);
              setIsOpen(false);
            }} 
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: string; label: string; onClick: (e: React.MouseEvent) => void }) {
  return (
    <div 
      onClick={onClick}
      className="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 cursor-pointer text-sm font-semibold transition text-foreground/80 hover:text-foreground"
    >
      <span className="material-symbols-outlined text-lg opacity-70">{icon}</span>
      {label}
    </div>
  );
}