import React, { useState, useRef, useEffect } from "react";
import axios from "@/lib/axios";
import { type Song } from "@/stores/usePlayerStore";

interface Props {
  song: Song;
  onRefresh: () => void;
  onEdit: (song: Song) => void;
}

export default function SongActionMenu({ song, onRefresh, onEdit }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Xóa bài hát "${song.title}"?`)) return;
    try {
      await axios.delete(`/songs/${song._id}`);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi xóa");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="p-2 hover:bg-gray-200 rounded-full transition flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-muted-foreground">more_vert</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-border shadow-xl rounded-xl z-50 py-2 animate-in fade-in zoom-in duration-150">
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); onEdit(song); }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition"
          >
            <span className="material-symbols-outlined text-blue-500 text-lg">edit</span>
            Chỉnh sửa
          </button>
          <div className="h-[1px] bg-gray-100 my-1" />
          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-500 flex items-center gap-3 transition"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
            Xóa bài hát
          </button>
        </div>
      )}
    </div>
  );
}